import { beforeEach, describe, expect, it, vi } from "vitest"

const mutate = vi.fn()
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ mutate })) }))

import { mutationAddToCart } from "./mutation-add-to-cart"
import { mutationCoursesCheckout } from "./mutation-courses-checkout"
import { mutationStartFlashcardSession } from "./mutation-start-flashcard-session"

describe("commerce and flashcard mutation boundaries", () => {
    beforeEach(() => mutate.mockReset())

    it("adds a course idempotently through the authenticated client", async () => {
        mutate.mockResolvedValue({ data: { addToCart: { data: { id: "line-1", courseId: "course-1" } } } })
        await mutationAddToCart({ courseId: "course-1" })
        expect(mutate.mock.calls[0][0].variables).toEqual({ request: { courseId: "course-1" } })
    })

    it("passes checkout request and options without inventing installment fields", async () => {
        mutate.mockResolvedValue({ data: { coursesCheckout: { data: { checkoutUrl: "https://pay.test" } } } })
        const request = { courseIds: ["course-1"], provider: "payos" as const, successUrl: "/ok", cancelUrl: "/cancel" }
        await mutationCoursesCheckout(request, { debug: true })
        expect(mutate.mock.calls[0][0].variables).toEqual({ request })
    })

    it("dispatches review deck, due review and quiz session requests", async () => {
        mutate.mockResolvedValueOnce({ data: { startFlashcardReviewSession: { data: { sessionId: "deck-1" } } } })
        await expect(mutationStartFlashcardSession({ mode: "review", kind: "deck", deckId: "deck", cardIds: ["a"], reviewMode: "due" })).resolves.toEqual({ sessionId: "deck-1", mode: "review", kind: "deck" })
        mutate.mockResolvedValueOnce({ data: { startFlashcardDueReviewSession: { data: { sessionId: "due-1" } } } })
        await expect(mutationStartFlashcardSession({ mode: "review", kind: "due", courseId: "course", cardIds: ["a"] })).resolves.toEqual({ sessionId: "due-1", mode: "review", kind: "due" })
        mutate.mockResolvedValueOnce({ data: { startFlashcardQuizSession: { data: { sessionId: "quiz-1", deadlineAt: "later" } } } })
        await expect(mutationStartFlashcardSession({ mode: "quiz", courseId: "course", cardIds: ["a"], practiceMode: "quick", level: null })).resolves.toEqual({ sessionId: "quiz-1", deadlineAt: "later", mode: "quiz" })
    })

    it("returns null when the backend accepts no session payload", async () => {
        mutate.mockResolvedValue({ data: { startFlashcardQuizSession: { data: null } } })
        await expect(mutationStartFlashcardSession({ mode: "quiz", courseId: "course", cardIds: [], practiceMode: "deep", level: "B2" })).resolves.toBeNull()
    })
})
