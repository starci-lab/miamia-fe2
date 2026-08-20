/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { SortOrder } from "../../modules/api/graphql/types"
import {
    QUERY_CONTENT_CHALLENGE_ATTEMPTS_SWR_KEY,
    useQueryContentChallengeAttemptsSwr,
} from "./useQueryContentChallengeAttemptsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-content-challenge-attempts", () => ({
    queryContentChallengeAttempts: mocks.query,
}))

const wrapper = ({ children }: PropsWithChildren) => createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0 } },
    children,
)

const attempts = [{ id: "attempt-1", attemptNumber: 1, processedAt: "2026-08-20T00:00:00Z" }]

beforeEach(() => {
    setSessionToken("challenge-attempt-viewer")
    mocks.query.mockReset()
    mocks.query.mockResolvedValue({ data: { userChallengeSubmissionAttempts: { data: { data: attempts } } } })
})

describe("useQueryContentChallengeAttemptsSwr", () => {
    it("publishes its stable key prefix", () => {
        expect(QUERY_CONTENT_CHALLENGE_ATTEMPTS_SWR_KEY).toBe("QUERY_CONTENT_CHALLENGE_ATTEMPTS_SWR")
    })

    it("does not fetch until every viewer and scope id exists", () => {
        const { result } = renderHook(() => useQueryContentChallengeAttemptsSwr(undefined, "submission"), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })

    it("passes the course and submission scope and unwraps attempts", async () => {
        const { result } = renderHook(() => useQueryContentChallengeAttemptsSwr("course", "submission"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(attempts))
        expect(mocks.query).toHaveBeenCalledWith({
            request: {
                challengeSubmissionId: "submission",
                filters: { pageNumber: 0, limit: 50, sorts: [{ by: "attemptNumber", order: SortOrder.Desc }] },
            },
            headers: { "X-Course-Id": "course" },
        })
    })

    it("returns null when the transport has no attempts payload", async () => {
        mocks.query.mockResolvedValue({ data: { userChallengeSubmissionAttempts: undefined } })
        const { result } = renderHook(() => useQueryContentChallengeAttemptsSwr("course", "submission"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
