import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ locale: "en", course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, inProgress: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, start: { isMutating: false, trigger: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => mocks.locale }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => mocks.course }))
vi.mock("@/hooks/swr/useQueryMyInProgressMockInterviewSessionSwr", () => ({ useQueryMyInProgressMockInterviewSessionSwr: () => mocks.inProgress }))
vi.mock("@/hooks/swr/useMutateStartMockInterviewSessionSwr", () => ({ useMutateStartMockInterviewSessionSwr: () => mocks.start }))
type SetupStubProps = { readonly state: string; readonly props: { readonly status?: string; readonly selectedLevel: string; readonly selectedMode: string }; readonly on?: { readonly configure?: (field: string, value: string) => void; readonly start?: () => void; readonly resume?: () => void; readonly retry?: () => void } }
vi.mock("./component", () => ({ CourseMockInterviewSetupPageBase: (input: SetupStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="status">{input.props.status}</output><output data-testid="selection">{input.props.selectedLevel}:{input.props.selectedMode}</output><button onClick={() => input.on?.configure?.("level", "senior")}>level</button><button onClick={() => input.on?.configure?.("mode", "design")}>mode</button><button onClick={input.on?.start}>start</button><button onClick={input.on?.resume}>resume</button><button onClick={input.on?.retry}>retry</button></> }))

import { CourseMockInterviewSetupPage } from "./index"

describe("CourseMockInterviewSetupPage", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.locale = "en"; mocks.course.data = undefined; mocks.course.error = undefined; mocks.inProgress.data = undefined; mocks.inProgress.error = undefined; mocks.start.isMutating = false; mocks.start.trigger.mockReset() })

    it("resolves pending, failed, ready and resumable states", async () => {
        const view = render(<CourseMockInterviewSetupPage displayId="course-1" />); expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.course.error = new Error("offline"); view.rerender(<CourseMockInterviewSetupPage displayId="course-1" />); expect(screen.getByTestId("state")).toHaveTextContent("failed")
        mocks.course.error = undefined; mocks.course.data = { id: "course-1" }; mocks.inProgress.data = null; view.rerender(<CourseMockInterviewSetupPage displayId="course-1" />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready"))
        mocks.inProgress.data = { sessionId: "session-1" }; view.rerender(<CourseMockInterviewSetupPage displayId="course-1" />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("resumable")); fireEvent.click(screen.getByRole("button", { name: "resume" })); expect(mocks.push).toHaveBeenCalledWith("/courses/course-1/learn/mock-interview/interview/session-1")
    })

    it("configures locale/options, starts successfully and reports start failure", async () => {
        mocks.locale = "vi"; mocks.course.data = { id: "course-1" }; mocks.inProgress.data = null; mocks.start.trigger.mockResolvedValue({ data: { startMockInterviewSession: { success: true, data: { sessionId: "session-2" } } } })
        const view = render(<CourseMockInterviewSetupPage displayId="course-1" />); fireEvent.click(screen.getByRole("button", { name: "level" })); fireEvent.click(screen.getByRole("button", { name: "mode" })); expect(screen.getByTestId("selection")).toHaveTextContent("senior:design"); fireEvent.click(screen.getByRole("button", { name: "start" })); await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/courses/course-1/learn/mock-interview/interview/session-2")); expect(mocks.start.trigger).toHaveBeenCalledWith({ courseId: "course-1", level: "senior", mode: "design" })
        mocks.start.trigger.mockRejectedValue(new Error("offline")); view.rerender(<CourseMockInterviewSetupPage displayId="course-1" />); fireEvent.click(screen.getByRole("button", { name: "start" })); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("failed")); fireEvent.click(screen.getByRole("button", { name: "retry" })); expect(mocks.course.mutate).toHaveBeenCalled(); expect(mocks.inProgress.mutate).toHaveBeenCalled(); view.unmount()
    })
})
