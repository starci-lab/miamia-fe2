/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
    useQueryFlashcardDecksByCourseSwr,
    useQueryMyDueFlashcardsSwr,
} from "./useQueryFlashcardDecksByCourseSwr"

const mocks = vi.hoisted(() => ({ decks: vi.fn(), due: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-flashcard-decks-by-course", () => ({
    queryFlashcardDecksByCourse: mocks.decks,
    queryMyDueFlashcards: mocks.due,
}))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const decks = [{ id: "deck-1", title: "Basics" }]
const due = { count: 1, cards: [{ id: "card-1" }] }

beforeEach(() => { mocks.decks.mockReset(); mocks.due.mockReset(); mocks.decks.mockResolvedValue(decks); mocks.due.mockResolvedValue(due) })

describe("useQueryFlashcardDecksByCourseSwr", () => {
    it("does not fetch decks without a course", () => {
        const { result } = renderHook(() => useQueryFlashcardDecksByCourseSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.decks).not.toHaveBeenCalled()
    })
    it("reads decks for one course", async () => {
        const { result } = renderHook(() => useQueryFlashcardDecksByCourseSwr("course"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(decks))
        expect(mocks.decks).toHaveBeenCalledWith("course")
    })
})

describe("useQueryMyDueFlashcardsSwr", () => {
    it("does not fetch due cards without a course", () => {
        const { result } = renderHook(() => useQueryMyDueFlashcardsSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.due).not.toHaveBeenCalled()
    })
    it("reads due cards for one course", async () => {
        const { result } = renderHook(() => useQueryMyDueFlashcardsSwr("course"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(due))
        expect(mocks.due).toHaveBeenCalledWith("course")
    })
})
