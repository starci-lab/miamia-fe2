/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryMockInterviewAttemptBySessionSwr } from "./useQueryMockInterviewAttemptBySessionSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-mock-interview-attempt-by-session", () => ({ queryMockInterviewAttemptBySession: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const attempt = { id: "attempt-1", status: "COMPLETED", score: 90 }

beforeEach(() => { setSessionToken("interview-viewer"); mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { myMockInterviewAttemptBySessionId: { data: attempt } } }) })

describe("useQueryMockInterviewAttemptBySessionSwr", () => {
    it("does not fetch until viewer and both ids exist", () => {
        const { result } = renderHook(() => useQueryMockInterviewAttemptBySessionSwr("course"), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })
    it("reads one viewer-owned attempt and passes course headers", async () => {
        const { result } = renderHook(() => useQueryMockInterviewAttemptBySessionSwr("course", "session", 2500), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(attempt))
        expect(mocks.query).toHaveBeenCalledWith({ request: { courseId: "course", sessionId: "session" }, headers: { "X-Course-Id": "course" } })
    })
    it("returns null when no attempt was found", async () => {
        mocks.query.mockResolvedValue({ data: { myMockInterviewAttemptBySessionId: undefined } })
        const { result } = renderHook(() => useQueryMockInterviewAttemptBySessionSwr("course", "session"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
