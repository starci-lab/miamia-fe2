/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { SortOrder } from "../../modules/api/graphql/types"
import {
    QUERY_CONTENT_CHALLENGE_FEEDBACKS_SWR_KEY,
    useQueryContentChallengeFeedbacksSwr,
} from "./useQueryContentChallengeFeedbacksSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-content-challenge-feedbacks", () => ({
    queryContentChallengeFeedbacks: mocks.query,
}))

const wrapper = ({ children }: PropsWithChildren) => createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0 } },
    children,
)
const feedbacks = [{ id: "feedback-1", sortIndex: 0, message: "Good" }]

beforeEach(() => {
    setSessionToken("feedback-viewer")
    mocks.query.mockReset()
    mocks.query.mockResolvedValue({ data: { userChallengeSubmissionFeedbacks: { data: { data: feedbacks } } } })
})

describe("useQueryContentChallengeFeedbacksSwr", () => {
    it("publishes a stable cache prefix", () => {
        expect(QUERY_CONTENT_CHALLENGE_FEEDBACKS_SWR_KEY).toBe("QUERY_CONTENT_CHALLENGE_FEEDBACKS_SWR")
    })

    it("does not fetch while either challenge scope id is absent", () => {
        const { result } = renderHook(() => useQueryContentChallengeFeedbacksSwr("course"), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })

    it("requests sorted feedback for a challenge attempt", async () => {
        const { result } = renderHook(() => useQueryContentChallengeFeedbacksSwr("course", "attempt"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(feedbacks))
        expect(mocks.query).toHaveBeenCalledWith({
            request: {
                submissionAttemptId: "attempt",
                filters: { pageNumber: 0, limit: 100, sorts: [{ by: "sortIndex", order: SortOrder.Asc }] },
            },
            headers: { "X-Course-Id": "course" },
        })
    })

    it("returns null when no feedback body was returned", async () => {
        mocks.query.mockResolvedValue({ data: { userChallengeSubmissionFeedbacks: undefined } })
        const { result } = renderHook(() => useQueryContentChallengeFeedbacksSwr("course", "attempt"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
