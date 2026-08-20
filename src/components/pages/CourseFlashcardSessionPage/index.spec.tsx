type TestPageInput = { state: string; on: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ locale: "en", course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, session: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, result: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, sync: { isMutating: false, error: undefined as unknown, trigger: vi.fn().mockResolvedValue(true) }, rate: { isMutating: false, error: undefined as unknown, trigger: vi.fn().mockResolvedValue({ xpEarned: 2 }) }, complete: { isMutating: false, error: undefined as unknown, trigger: vi.fn().mockResolvedValue({}) }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => m.locale }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push, replace: m.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => m.course }))
vi.mock("@/hooks/swr/useQueryMyInProgressFlashcardSessionSwr", () => ({ useQueryMyInProgressFlashcardSessionSwr: () => m.session }))
vi.mock("@/hooks/swr/useQueryFlashcardSessionResultSwr", () => ({ useQueryFlashcardSessionResultSwr: () => m.result }))
vi.mock("@/hooks/swr/useMutateSyncFlashcardSessionSwr", () => ({ useMutateSyncFlashcardSessionSwr: () => m.sync, useMutateRateFlashcardSwr: () => m.rate }))
vi.mock("@/hooks/swr/useMutateCompleteFlashcardSessionSwr", () => ({ useMutateCompleteFlashcardSessionSwr: () => m.complete }))
vi.mock("./component", () => ({ CourseFlashcardSessionPageBase: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><button onClick={on.reveal}>reveal</button><button onClick={() => on.rate(2)}>rate</button><button onClick={() => on.answerQuiz?.(false)}>answer</button><button onClick={on.retry}>retry</button><button onClick={on.leave}>leave</button></> }))
import { CourseFlashcardSessionPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.locale = "en"; m.course.data = { id: "c1" }; m.course.error = undefined; m.session.data = undefined; m.session.error = undefined; m.result.data = undefined; m.result.error = undefined; m.sync.error = undefined; m.rate.error = undefined; m.complete.error = undefined; m.sync.isMutating = false; m.rate.isMutating = false; m.complete.isMutating = false; m.sync.trigger.mockResolvedValue(true); m.rate.trigger.mockResolvedValue({ xpEarned: 2 }); m.complete.trigger.mockResolvedValue({}) })
describe("CourseFlashcardSessionPage route", () => {
    it("reports pending, active, expired and failed states", () => { const view = render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.session.data = { cards: [{ cardId: "card", front: "Q", back: "A" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], xpEarned: 0, kind: "deck" }; m.result.data = { status: "completed" }; view.rerender(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); expect(screen.getByTestId("state")).toHaveTextContent("active"); m.session.data = null; m.result.data = { status: "in_progress" }; view.rerender(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); expect(screen.getByTestId("state")).toHaveTextContent("expired"); m.session.error = new Error("offline"); view.rerender(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); expect(screen.getByTestId("state")).toHaveTextContent("failed") })
    it("retries and leaves through the connected actions", () => { m.session.data = { cards: [{ cardId: "card", front: "Q", back: "A" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], xpEarned: 0, kind: "deck" }; m.result.data = { status: "completed" }; render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); fireEvent.click(screen.getByText("retry")); fireEvent.click(screen.getByText("leave")); expect(m.course.mutate).toHaveBeenCalled(); expect(m.session.mutate).toHaveBeenCalled(); expect(m.result.mutate).toHaveBeenCalled(); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/flashcards/review") })
    it("completes a quiz answer and routes to its result", async () => { m.session.data = { cards: [{ cardId: "card", front: "{{c1::answer}}", back: "answer" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], results: [], xpEarned: 0, kind: "deck" }; m.result.data = null; m.complete.trigger.mockResolvedValue({}); render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="quiz" />); fireEvent.click(screen.getByText("answer")); await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.rate.trigger).toHaveBeenCalled(); expect(m.complete.trigger).toHaveBeenCalled(); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/flashcards/quiz/sessions/s1/result") })
    it("reveals and syncs an intermediate review card before completing the final card", async () => {
        m.session.data = { sessionId: "s1", cards: [{ cardId: "one", front: "One", back: "A" }, { cardId: "two", front: "Two", back: "B" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], results: [], xpEarned: 0, kind: "deck" }
        m.result.data = null
        render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />)
        fireEvent.click(screen.getByText("reveal")); fireEvent.click(screen.getByText("rate"))
        await waitFor(() => expect(m.sync.trigger).toHaveBeenCalledWith(expect.objectContaining({ currentIndex: 1, reviewedCount: 1 })))
        fireEvent.click(screen.getByText("rate"))
        await waitFor(() => expect(m.complete.trigger).toHaveBeenCalledWith(expect.objectContaining({ mode: "review", reviewedCount: 2 })))
        expect(m.push).toHaveBeenCalledWith("/courses/course/learn/flashcards/review/sessions/s1/result")
    })
    it("marks a quiz answer wrong and exposes local failure when sync rejects", async () => {
        m.session.data = { sessionId: "s1", cards: [{ cardId: "one", front: "{{c1::A}}", back: "A" }, { cardId: "two", front: "B", back: "B" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], results: [], xpEarned: 0, kind: "deck" }
        m.result.data = null; m.sync.trigger.mockResolvedValue(false)
        const view = render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="quiz" />)
        fireEvent.click(screen.getByText("answer")); await waitFor(() => expect(m.sync.trigger).toHaveBeenCalledWith(expect.objectContaining({ results: [{ cardId: "one", correctBlanks: 0, totalBlanks: 1 }] })))
        view.rerender(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="quiz" />)
        expect(screen.getByTestId("state")).toHaveTextContent("failed")
    })
    it("routes away when the persisted result is already complete", () => {
        m.result.data = { status: "abandoned" }; render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />)
        expect(m.push).toHaveBeenCalledWith("/courses/course/learn/flashcards/review/sessions/s1/result")
    })
    it("supports the Vietnamese copy and advances through an intermediate quiz answer", async () => {
        m.locale = "vi"; m.session.data = { sessionId: "s1", cards: [{ cardId: "one", front: "{{c1::A}}", back: "A" }, { cardId: "two", front: "B", back: "B" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], results: [], xpEarned: 0, kind: "deck" }; m.result.data = null
        render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="quiz" />)
        fireEvent.click(screen.getByText("answer")); await waitFor(() => expect(m.sync.trigger).toHaveBeenCalledWith(expect.objectContaining({ currentIndex: 1, results: expect.any(Array) })))
        m.rate.trigger.mockRejectedValue(new Error("offline")); fireEvent.click(screen.getByText("answer")); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("failed"))
    })
    it("surfaces review transport failures and mutation-in-flight states", async () => {
        m.session.data = { sessionId: "s1", cards: [{ cardId: "one", front: "One", back: "A" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], results: [], xpEarned: 0, kind: "deck" }; m.result.data = null; m.rate.trigger.mockResolvedValueOnce(null)
        const view = render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); fireEvent.click(screen.getByText("rate")); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("failed")); view.unmount()
        m.session.data = { sessionId: "s1", cards: [{ cardId: "one", front: "{{c1::A}}", back: "A" }], currentIndex: 0, reviewedCount: 0, gradedIndexes: [], results: [], xpEarned: 0, kind: "deck" }; m.result.data = null; m.rate.trigger.mockResolvedValue({ xpEarned: 1 }); m.complete.isMutating = true; const completing = render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); expect(screen.getAllByTestId("state").at(-1)).toHaveTextContent("completing"); completing.unmount(); m.complete.isMutating = false; m.sync.isMutating = true; render(<CourseFlashcardSessionPage displayId="course" sessionId="s1" mode="review" />); expect(screen.getAllByTestId("state").at(-1)).toHaveTextContent("syncing")
    })
})


