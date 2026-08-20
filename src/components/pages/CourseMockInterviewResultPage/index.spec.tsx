import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ locale: "en", course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, attempt: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => mocks.locale }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => mocks.course }))
vi.mock("@/hooks/swr/useQueryMockInterviewAttemptBySessionSwr", () => ({ useQueryMockInterviewAttemptBySessionSwr: () => mocks.attempt }))
type ResultStubProps = { readonly state: string; readonly props: { readonly score?: number; readonly reviews: ReadonlyArray<{ readonly title: string }>; readonly phases: ReadonlyArray<unknown> }; readonly on: { readonly retry: () => void; readonly newSession: () => void } }
vi.mock("@/components/pages/CourseMockInterviewResultPage/component", () => ({ CourseMockInterviewResultPageBase: (input: ResultStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="score">{input.props.score}</output><output data-testid="reviews">{input.props.reviews.map((review) => review.title).join("|")}</output><button onClick={input.on.retry}>retry</button><button onClick={input.on.newSession}>new</button></> }))
import { CourseMockInterviewResultPage } from "@/components/pages/CourseMockInterviewResultPage/index"

describe("CourseMockInterviewResultPage connected polling", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.locale = "en"; mocks.course.data = undefined; mocks.course.error = undefined; mocks.attempt.data = undefined; mocks.attempt.error = undefined })
    it("resolves pending, failed and ready persisted results", async () => {
        const view = render(<CourseMockInterviewResultPage displayId="course" sessionId="session" />); expect(screen.getByTestId("state")).toHaveTextContent("grading")
        mocks.course.error = new Error("offline"); view.rerender(<CourseMockInterviewResultPage displayId="course" sessionId="session" />); expect(screen.getByTestId("state")).toHaveTextContent("failed")
        mocks.course.error = undefined; mocks.course.data = { id: "course" }; mocks.attempt.data = { overallScore: 88, verdict: "pass", promptTitle: "Distributed cache", phaseScores: [{ phase: "requirements", score: 18, max: 20 }], strengths: ["Trade-offs"], gaps: ["Capacity"], questionReviews: [{ questionIndex: 0, kind: "design", question: "Cache", candidateAnswer: "Keys", feedback: "Eviction", score: 8, max: 10 }] }; mocks.locale = "vi"; view.rerender(<CourseMockInterviewResultPage displayId="course" sessionId="session" />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready")); expect(screen.getByTestId("score")).toHaveTextContent("88"); expect(screen.getByTestId("reviews")).toHaveTextContent("Cache")
        fireEvent.click(screen.getByRole("button", { name: "retry" })); fireEvent.click(screen.getByRole("button", { name: "new" })); expect(mocks.course.mutate).toHaveBeenCalled(); expect(mocks.attempt.mutate).toHaveBeenCalled(); expect(mocks.push).toHaveBeenCalledWith("/courses/course/learn/mock-interview")
    })
})
