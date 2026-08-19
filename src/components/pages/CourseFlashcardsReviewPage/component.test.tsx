/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { _CourseFlashcardsReviewPage, type CourseFlashcardsReviewPageProps } from "./component"

const makeInput = (): CourseFlashcardsReviewPageProps => ({
    state: "ready",
    props: {
        title: "Flashcards",
        subtitle: "Review",
        reviewLabel: "Review",
        quizLabel: "Quiz",
        dueTitle: "Due today",
        dueDescription: "Review due cards",
        statsTitle: "Review progress",
        streakText: "2 day streak",
        retentionText: "80% retention",
        decksTitle: "Decks",
        cardsLabel: "cards",
        dueLabel: "due",
        masteredLabel: "mastered",
        startLabel: "Start",
        resumeLabel: "Resume session",
        retryLabel: "Retry",
        emptyText: "Empty",
        failedText: "Failed",
        dueCount: 3,
        decks: [{ id: "deck-1", title: "Core", description: "Core concepts", difficulty: "easy", cardCount: 5, dueCount: 3, masteredCount: 1 }],
    },
    on: { openQuiz: vi.fn(), startDue: vi.fn(), startDeck: vi.fn(), resume: vi.fn(), retry: vi.fn() },
})

afterEach(cleanup)

describe("_CourseFlashcardsReviewPage", () => {
    it("starts the cross-deck due session and a selected deck", () => {
        const input = makeInput()
        const { container } = render(<_CourseFlashcardsReviewPage {...input} />)

        expect(container.querySelector("[data-node=course-flashcards-review-page]")).toBeTruthy()
        expect(container.querySelectorAll("[data-node=flashcard-review-deck-card]")).toHaveLength(1)
        const startButtons = screen.getAllByRole("button", { name: "Start" })
        fireEvent.click(startButtons[0])
        fireEvent.click(startButtons[1])
        expect(input.on.startDue).toHaveBeenCalledOnce()
        expect(input.on.startDeck).toHaveBeenCalledWith("deck-1")
    })
    it("renders pending skeletons and retryable failure or empty notices", () => {
        const pending = { ...makeInput(), state: "pending" as const }; const { container } = render(<_CourseFlashcardsReviewPage {...pending} />); expect(container.querySelectorAll("[data-node=flashcard-review-deck-card]")).toHaveLength(4)
        const failed = { ...makeInput(), state: "failed" as const }; render(<_CourseFlashcardsReviewPage {...failed} />); fireEvent.click(screen.getByRole("button", { name: "Retry" })); expect(failed.on.retry).toHaveBeenCalledOnce()
        const empty = { ...makeInput(), state: "empty" as const }; render(<_CourseFlashcardsReviewPage {...empty} />); expect(screen.getByText("Empty")).toBeInTheDocument()
    })
    it("resumes a due session instead of starting a new queue", () => {
        const input = { ...makeInput(), props: { ...makeInput().props, resumeSessionId: "session-1" } }; render(<_CourseFlashcardsReviewPage {...input} />); fireEvent.click(screen.getByRole("button", { name: "Resume session" })); expect(input.on.resume).toHaveBeenCalledWith("session-1")
    })
})
