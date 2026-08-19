import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
type TestPageInput = { readonly state: string; readonly props: { readonly primary: { readonly id: string } }; readonly on: { readonly open: (id: string) => void; readonly retry: () => void } }
const m = vi.hoisted(() => ({ course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, mine: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, lessons: { data: undefined as unknown, mutate: vi.fn() }, challenges: { data: undefined as unknown, mutate: vi.fn() }, decks: { data: undefined as unknown }, project: { data: undefined as unknown }, interview: { data: undefined as unknown }, route: { trigger: vi.fn() }, push: vi.fn(), view: "today" }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => m.course }))
vi.mock("@/hooks/swr/useQueryMyCoursesSwr", () => ({ useQueryMyCoursesSwr: () => m.mine }))
vi.mock("@/hooks/swr/useQueryMyLearnedLessonsSwr", () => ({ useQueryMyLearnedLessonsSwr: () => m.lessons }))
vi.mock("@/hooks/swr/useQueryMyInProgressChallengesSwr", () => ({ useQueryMyInProgressChallengesSwr: () => m.challenges }))
vi.mock("@/hooks/swr/useQueryFlashcardDecksByCourseSwr", () => ({ useQueryFlashcardDecksByCourseSwr: () => m.decks }))
vi.mock("@/hooks/swr/useQueryCoursePersonalProjectSwr", () => ({ useQueryCoursePersonalProjectSwr: () => m.project }))
vi.mock("@/hooks/swr/useQueryMyInProgressMockInterviewSessionSwr", () => ({ useQueryMyInProgressMockInterviewSessionSwr: () => m.interview }))
vi.mock("@/hooks/swr/useQueryResolveRouteSwr", () => ({ useQueryResolveRouteSwr: () => m.route }))
vi.mock("@/components/layouts/LearnShellLayout", () => ({ useLearnMobileView: () => ({ view: m.view }) }))
vi.mock("./component", () => ({ _CourseLearnTodayPage: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><output data-testid="primary">interview-resume</output><button onClick={() => on.open("interview-resume")}>open</button><button onClick={on.retry}>retry</button></> }))
import { CourseLearnTodayPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.course.data = undefined; m.course.error = undefined; m.mine.data = undefined; m.mine.error = undefined; m.lessons.data = []; m.challenges.data = []; m.decks.data = []; m.project.data = {}; m.interview.data = undefined })
describe("CourseLearnTodayPage route", () => {
    it("reports pending, failed, empty and ready states", () => { const view = render(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.course.error = new Error("offline"); view.rerender(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); m.course.error = undefined; m.course.data = null; m.mine.data = []; view.rerender(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("empty"); m.course.data = { id: "course", title: "Course" }; m.mine.data = []; view.rerender(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready") })
    it("ranks active interview and retries its source queries", () => { m.course.data = { id: "course", title: "Course" }; m.mine.data = []; m.interview.data = { sessionId: "session", promptTitle: "Interview", deadlineAt: new Date(Date.now() + 60000).toISOString() }; render(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("primary")).toHaveTextContent("interview-resume"); fireEvent.click(screen.getByText("open")); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/mock-interview/interview/session"); fireEvent.click(screen.getByText("retry")); expect(m.course.mutate).toHaveBeenCalled() })
})
