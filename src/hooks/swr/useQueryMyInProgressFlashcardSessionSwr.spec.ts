/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryMyInProgressFlashcardSessionSwr } from "./useQueryMyInProgressFlashcardSessionSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-my-in-progress-flashcard-session", () => ({ queryMyInProgressFlashcardSession: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { m.query.mockReset(); m.query.mockResolvedValue({ id: "session" }) })
describe("useQueryMyInProgressFlashcardSessionSwr", () => {
    it("does not fetch without a request", () => { const { result } = renderHook(() => useQueryMyInProgressFlashcardSessionSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("passes a review request and returns the session", async () => { const request = { mode: "review", courseId: "course", deckId: "deck", reviewKind: "due" } as const; const { result } = renderHook(() => useQueryMyInProgressFlashcardSessionSwr(request), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ id: "session" })); expect(m.query).toHaveBeenCalledWith(request) })
})
