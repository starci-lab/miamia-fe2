import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, decks: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, session: { data: undefined as unknown }, start: vi.fn(), push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => "en" }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => m.course }))
vi.mock("@/hooks/swr/useQueryFlashcardDecksByCourseSwr", () => ({ useQueryFlashcardDecksByCourseSwr: () => m.decks }))
vi.mock("@/hooks/swr/useQueryMyInProgressFlashcardSessionSwr", () => ({ useQueryMyInProgressFlashcardSessionSwr: () => m.session }))
vi.mock("@/hooks/swr/useMutateStartFlashcardSessionSwr", () => ({ useMutateStartFlashcardSessionSwr: () => ({ trigger: m.start, error: undefined }) }))
type QuizProps = { readonly state: string; readonly on: Record<string, () => void> }
vi.mock("./component", () => ({ CourseFlashcardsQuizPageBase: ({ state, on }: QuizProps) => <><output data-testid="state">{state}</output><button onClick={on.start}>start</button><button onClick={on.resume}>resume</button><button onClick={on.retry}>retry</button></> }))
import { CourseFlashcardsQuizPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.course.data = undefined; m.course.error = undefined; m.decks.data = undefined; m.decks.error = undefined; m.session.data = undefined })
describe("CourseFlashcardsQuizPage", () => {
    it("settles pending, empty and ready states", () => { const view = render(<CourseFlashcardsQuizPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.course.data = { id: "course" }; m.decks.data = []; view.rerender(<CourseFlashcardsQuizPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("empty"); m.decks.data = [{ cards: [{ id: "card-1", level: "B1" }] }]; view.rerender(<CourseFlashcardsQuizPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready") })
    it("starts and resumes a durable quiz session, then retries reads", async () => { m.course.data = { id: "course" }; m.decks.data = [{ cards: [{ id: "card-1", level: "B1" }] }]; m.start.mockResolvedValue({ sessionId: "session-1" }); render(<CourseFlashcardsQuizPage displayId="course" />); fireEvent.click(screen.getByText("start")); await Promise.resolve(); expect(m.start).toHaveBeenCalled(); fireEvent.click(screen.getByText("resume")); expect(m.push).toHaveBeenCalled(); fireEvent.click(screen.getByText("retry")); expect(m.course.mutate).toHaveBeenCalled(); expect(m.decks.mutate).toHaveBeenCalled() })
})
