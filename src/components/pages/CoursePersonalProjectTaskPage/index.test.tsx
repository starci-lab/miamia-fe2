import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ project: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, attempts: { mutate: vi.fn() }, submission: { error: undefined as unknown, isMutating: false, trigger: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => "en" }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/swr/useQueryCoursePersonalProjectSwr", () => ({ useQueryCoursePersonalProjectSwr: () => m.project }))
vi.mock("@/hooks/swr/useQueryPersonalTaskAttemptsSwr", () => ({ useQueryPersonalTaskAttemptsSwr: () => m.attempts }))
vi.mock("@/hooks/swr/useMutateSubmitPersonalTaskAttemptSwr", () => ({ useMutateSubmitPersonalTaskAttemptSwr: () => m.submission }))
type TaskProps = { readonly state: string; readonly on: { readonly submit: () => void; readonly retry: () => void } }
vi.mock("./component", () => ({ CoursePersonalProjectTaskPageBase: ({ state, on }: TaskProps) => <><output data-testid="state">{state}</output><button onClick={on.submit}>submit</button><button onClick={on.retry}>retry</button></> }))
import { CoursePersonalProjectTaskPage } from "./index"
const project = { course: { id: "course" }, milestones: [{ tasks: [{ id: "task", title: "Task", type: "Write", maxScore: 10 }] }] }
beforeEach(() => { vi.clearAllMocks(); m.project.data = undefined; m.project.error = undefined; m.submission.error = undefined; m.submission.isMutating = false })
describe("CoursePersonalProjectTaskPage", () => { it("settles pending, failed and ready", () => { const view = render(<CoursePersonalProjectTaskPage displayId="course" taskId="task" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.project.error = new Error("offline"); view.rerender(<CoursePersonalProjectTaskPage displayId="course" taskId="task" />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); m.project.error = undefined; m.project.data = project; view.rerender(<CoursePersonalProjectTaskPage displayId="course" taskId="task" />); expect(screen.getByTestId("state")).toHaveTextContent("ready") }); it("submits and routes to the result", async () => { m.project.data = project; m.submission.trigger.mockResolvedValue({}); render(<CoursePersonalProjectTaskPage displayId="course" taskId="task" />); fireEvent.click(screen.getByText("submit")); await waitFor(() => expect(m.submission.trigger).toHaveBeenCalledWith({ courseId: "course", taskId: "task" })); await waitFor(() => expect(m.push).toHaveBeenCalledWith("/courses/course/learn/personal-project/tasks/task/result")) }) })
