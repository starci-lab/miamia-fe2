import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, mine: { data: undefined as unknown }, lessons: { data: undefined as unknown }, challenges: { data: undefined as unknown }, decks: { data: undefined as unknown }, project: { data: undefined as unknown }, interview: { data: undefined as unknown }, route: { trigger: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => mocks.course }))
vi.mock("@/hooks/swr/useQueryMyCoursesSwr", () => ({ useQueryMyCoursesSwr: () => mocks.mine }))
vi.mock("@/hooks/swr/useQueryMyLearnedLessonsSwr", () => ({ useQueryMyLearnedLessonsSwr: () => mocks.lessons }))
vi.mock("@/hooks/swr/useQueryMyInProgressChallengesSwr", () => ({ useQueryMyInProgressChallengesSwr: () => mocks.challenges }))
vi.mock("@/hooks/swr/useQueryFlashcardDecksByCourseSwr", () => ({ useQueryFlashcardDecksByCourseSwr: () => mocks.decks }))
vi.mock("@/hooks/swr/useQueryCoursePersonalProjectSwr", () => ({ useQueryCoursePersonalProjectSwr: () => mocks.project }))
vi.mock("@/hooks/swr/useQueryMyInProgressMockInterviewSessionSwr", () => ({ useQueryMyInProgressMockInterviewSessionSwr: () => mocks.interview }))
vi.mock("@/hooks/swr/useQueryResolveRouteSwr", () => ({ useQueryResolveRouteSwr: () => mocks.route }))
vi.mock("@/components/layouts/LearnShellLayout", () => ({ useLearnMobileView: () => ({ view: "progress" }) }))
type TodayStubProps = { readonly state: string; readonly props: { readonly primary: { readonly id: string }; readonly secondary: ReadonlyArray<{ readonly id: string }> }; readonly on: { readonly open: (id: string) => void; readonly retry: () => void } }
vi.mock("@/components/pages/CourseLearnTodayPage/component", () => ({ CourseLearnTodayPageBase: (input: TodayStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="primary">{input.props.primary.id}</output><output data-testid="secondary">{input.props.secondary.map((item) => item.id).join("|")}</output><button onClick={() => input.on.open(input.props.primary.id)}>open-primary</button>{input.props.secondary.map((item) => <button key={item.id} onClick={() => input.on.open(item.id)}>{item.id}</button>)}<button onClick={input.on.retry}>retry</button></> }))

import { CourseLearnTodayPage } from "@/components/pages/CourseLearnTodayPage/index"

describe("CourseLearnTodayPage additional journeys", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.course.data = { id: "course", title: "Course" }; mocks.course.error = undefined; mocks.mine.data = []; mocks.lessons.data = []; mocks.challenges.data = []; mocks.decks.data = []; mocks.project.data = { currentTask: null }; mocks.interview.data = undefined })
    it("ranks challenge, lesson and course fallback and opens secondary routes", async () => {
        mocks.challenges.data = [{ globalId: "challenge", label: "Challenge" }]; mocks.lessons.data = [{ globalId: "lesson", label: "Lesson" }]; mocks.decks.data = [{ dueCount: 2 }]; mocks.project.data = { currentTask: { id: "task" } }; const view = render(<CourseLearnTodayPage displayId="course" />)
        expect(screen.getByTestId("primary")).toHaveTextContent("resolve:challenge"); mocks.route.trigger.mockResolvedValue({ data: { resolveRoute: { data: { path: "/en/challenge" } } } }); fireEvent.click(screen.getByRole("button", { name: "open-primary" })); await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/en/challenge")); fireEvent.click(screen.getByRole("button", { name: "flashcards" })); fireEvent.click(screen.getByRole("button", { name: "project:task" })); expect(mocks.push).toHaveBeenCalledWith("/courses/course/learn/flashcards/review"); expect(mocks.push).toHaveBeenCalledWith("/courses/course/learn/personal-project/tasks/task")
        mocks.challenges.data = []; mocks.lessons.data = [{ globalId: "lesson", label: "Lesson" }]; view.rerender(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("primary")).toHaveTextContent("resolve:lesson"); mocks.lessons.data = []; view.rerender(<CourseLearnTodayPage displayId="course" />); expect(screen.getByTestId("primary")).toHaveTextContent("modules")
    })
})
