/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import {
    QUERY_PERSONAL_TASK_ATTEMPTS_SWR_KEY,
    useQueryPersonalTaskAttemptsSwr,
} from "./useQueryPersonalTaskAttemptsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-course-personal-project", () => ({
    queryPersonalTaskAttempts: mocks.query,
}))

const wrapper = ({ children }: PropsWithChildren) => createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0 } },
    children,
)
const attempts = [{ id: "task-attempt-1", attemptNumber: 2, status: "PASSED" }]

beforeEach(() => {
    setSessionToken("task-viewer")
    mocks.query.mockReset()
    mocks.query.mockResolvedValue({ data: { userPersonalTaskAttempts: { data: { data: attempts } } } })
})

describe("useQueryPersonalTaskAttemptsSwr", () => {
    it("publishes a stable cache prefix", () => {
        expect(QUERY_PERSONAL_TASK_ATTEMPTS_SWR_KEY).toBe("QUERY_PERSONAL_TASK_ATTEMPTS_SWR")
    })

    it("does not request an incomplete course/task scope", () => {
        const { result } = renderHook(() => useQueryPersonalTaskAttemptsSwr("course"), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })

    it("requests newest attempts and unwraps the list", async () => {
        const { result } = renderHook(() => useQueryPersonalTaskAttemptsSwr("course", "task"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(attempts))
        expect(mocks.query).toHaveBeenCalledWith({
            courseId: "course",
            taskId: "task",
            filters: { pageNumber: 0, limit: 20, sorts: [{ by: "attemptNumber", order: "DESC" }] },
        })
    })

    it("returns an empty list when the response body is absent", async () => {
        mocks.query.mockResolvedValue({ data: { userPersonalTaskAttempts: undefined } })
        const { result } = renderHook(() => useQueryPersonalTaskAttemptsSwr("course", "task"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual([]))
    })
})
