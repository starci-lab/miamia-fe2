/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryPersonalTaskAttemptFeedbacksSwr } from "./useQueryPersonalTaskAttemptFeedbacksSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-course-personal-project", () => ({ queryPersonalTaskAttemptFeedbacks: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { setSessionToken("viewer"); m.query.mockReset(); m.query.mockResolvedValue({ data: { userPersonalTaskAttemptFeedbacks: { data: { data: [{ id: "feedback" }] } } } }) })
describe("useQueryPersonalTaskAttemptFeedbacksSwr", () => {
    it("does not fetch without attempt scope", () => { const { result } = renderHook(() => useQueryPersonalTaskAttemptFeedbacksSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("requests sorted feedback", async () => { const { result } = renderHook(() => useQueryPersonalTaskAttemptFeedbacksSwr("attempt"), { wrapper }); await waitFor(() => expect(result.current.data).toEqual([{ id: "feedback" }])); expect(m.query).toHaveBeenCalledWith({ attemptId: "attempt", filters: { pageNumber: 0, limit: 100, sorts: [{ by: "sortIndex", order: "ASC" }] } }) })
})
