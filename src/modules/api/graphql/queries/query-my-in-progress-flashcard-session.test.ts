import { beforeEach, describe, expect, it, vi } from "vitest"
import { queryMyInProgressFlashcardSession } from "./query-my-in-progress-flashcard-session"

const query = vi.fn()
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ query })) }))

const review = { sessionId: "review-1", kind: "deck" as const, cardIds: ["card-1"], currentIndex: 0, reviewedCount: 1, gradedIndexes: [0], xpEarned: 10, updatedAt: "today" }
const quiz = { sessionId: "quiz-1", cardIds: ["card-1"], currentIndex: 0, results: [{ cardId: "card-1", correctBlanks: 1, totalBlanks: 1 }], updatedAt: "today", deadlineAt: null, name: "Quick quiz" }
const cards = { flashcardCardsByIds: { data: { cards: [{ cardId: "card-1", deckTitle: "Basics", front: "hello", back: "xin chào", tags: [] }] } } }

const cardResponse = () => ({ data: cards })

describe("queryMyInProgressFlashcardSession", () => {
    beforeEach(() => query.mockReset())

    it("hydrates a review addressed by session, preserving its counters", async () => {
        query.mockResolvedValueOnce({ data: { myFlashcardReviewSessionBySessionId: { data: review } } }).mockResolvedValueOnce(cardResponse())
        await expect(queryMyInProgressFlashcardSession({ mode: "review", sessionId: "review-1", courseId: "course-1" })).resolves.toMatchObject({ sessionId: "review-1", kind: "deck", reviewedCount: 1, xpEarned: 10, cards: cards.flashcardCardsByIds.data.cards })
    })

    it("returns null for missing session and empty review selectors", async () => {
        query.mockResolvedValueOnce({ data: { myFlashcardReviewSessionBySessionId: { data: null } } })
        await expect(queryMyInProgressFlashcardSession({ mode: "review", sessionId: "missing" })).resolves.toBeNull()
        await expect(queryMyInProgressFlashcardSession({ mode: "review" })).resolves.toBeNull()
    })

    it("resolves due review only with a course and hydrates it as due", async () => {
        await expect(queryMyInProgressFlashcardSession({ mode: "review", reviewKind: "due" })).resolves.toBeNull()
        query.mockResolvedValueOnce({ data: { myInProgressFlashcardDueReviewSession: { data: review } } }).mockResolvedValueOnce(cardResponse())
        await expect(queryMyInProgressFlashcardSession({ mode: "review", reviewKind: "due", courseId: "course-1" })).resolves.toMatchObject({ kind: "due", sessionId: "review-1" })
    })

    it("searches deck ids until one review exists and handles an absent deck", async () => {
        query.mockResolvedValueOnce({ data: { myInProgressFlashcardReviewSession: { data: null } } }).mockResolvedValueOnce({ data: { myInProgressFlashcardReviewSession: { data: review } } }).mockResolvedValueOnce(cardResponse())
        await expect(queryMyInProgressFlashcardSession({ mode: "review", deckIds: ["empty", "deck-1"] })).resolves.toMatchObject({ sessionId: "review-1" })
        query.mockResolvedValueOnce({ data: { myInProgressFlashcardReviewSession: { data: null } } })
        await expect(queryMyInProgressFlashcardSession({ mode: "review", deckId: "empty" })).resolves.toBeNull()
    })

    it("hydrates quiz results and rejects a response for another session", async () => {
        query.mockResolvedValueOnce({ data: { myInProgressFlashcardQuizSession: { data: quiz } } })
        await expect(queryMyInProgressFlashcardSession({ mode: "quiz", courseId: "course-1", sessionId: "other" })).resolves.toBeNull()
        query.mockResolvedValueOnce({ data: { myInProgressFlashcardQuizSession: { data: quiz } } }).mockResolvedValueOnce(cardResponse())
        await expect(queryMyInProgressFlashcardSession({ mode: "quiz", courseId: "course-1", sessionId: "quiz-1" })).resolves.toMatchObject({ mode: "quiz", reviewedCount: 1, results: quiz.results, name: "Quick quiz" })
        query.mockResolvedValueOnce({ data: { myInProgressFlashcardQuizSession: { data: null } } })
        await expect(queryMyInProgressFlashcardSession({ mode: "quiz", courseId: "course-1" })).resolves.toBeNull()
    })
})
