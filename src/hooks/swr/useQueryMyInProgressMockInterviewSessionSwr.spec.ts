/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryMyInProgressMockInterviewSessionSwr } from "./useQueryMyInProgressMockInterviewSessionSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-my-in-progress-mock-interview-session", () => ({ queryMyInProgressMockInterviewSession: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { setSessionToken("viewer"); m.query.mockReset(); m.query.mockResolvedValue({ data: { myInProgressMockInterviewSession: { data: { id: "session" } } } }) })
describe("useQueryMyInProgressMockInterviewSessionSwr", () => {
    it("does not fetch without course scope", () => { const { result } = renderHook(() => useQueryMyInProgressMockInterviewSessionSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("passes course scope and headers", async () => { const { result } = renderHook(() => useQueryMyInProgressMockInterviewSessionSwr("course"), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ id: "session" })); expect(m.query).toHaveBeenCalledWith({ request: { courseId: "course" }, headers: { "X-Course-Id": "course" } }) })
})
