import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
    suggested: { data: undefined as unknown, error: undefined as unknown },
    live: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    courses: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    route: { trigger: vi.fn() },
    follow: { trigger: vi.fn() },
    push: vi.fn(),
}))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "en" }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks", () => ({
    useQuerySuggestedUsersSwr: () => mocks.suggested,
    useQueryResolveRouteSwr: () => mocks.route,
    useMutateSetFollowSwr: () => mocks.follow,
    useQueryMyUpcomingLivestreamsSwr: () => mocks.live,
    useQueryMyCoursesSwr: () => mocks.courses,
}))

type WhoStubProps = { readonly state: string; readonly props: { readonly users: ReadonlyArray<{ readonly id: string; readonly name: string; readonly isFollowing: boolean }> }; readonly on?: Record<string, () => Promise<void>> }
vi.mock("./WhoToFollow/component", () => ({ WhoToFollowBase: (input: WhoStubProps) => <><output data-testid="who-state">{input.state}</output><output data-testid="who-users">{input.props.users.map((user) => `${user.name}:${user.isFollowing}`).join("|")}</output><button onClick={() => input.on?.["open:u1"]?.()}>open</button><button onClick={() => input.on?.["follow:u1"]?.()}>follow</button></> }))
type LiveStubProps = { readonly state: string; readonly props: { readonly rows: ReadonlyArray<{ readonly id: string; readonly routeId: string }> }; readonly on?: Record<string, () => Promise<void>> }
vi.mock("./UpcomingLivestreamCard/component", () => ({ UpcomingLivestreamCardBase: (input: LiveStubProps) => <><output data-testid="live-state">{input.state}</output><output data-testid="live-rows">{input.props.rows.map((row) => row.id).join("|")}</output><button onClick={() => { const key = Object.keys(input.on ?? {})[0]; if (key) void input.on?.[key]?.() }}>open-live</button><button onClick={input.on?.retry}>retry-live</button></> }))
type CoursesStubProps = { readonly state: string; readonly props: { readonly rows: ReadonlyArray<{ readonly id: string; readonly percent: number }> }; readonly on?: Record<string, () => Promise<void>>; }
vi.mock("./MyCoursesProgress/component", () => ({ MyCoursesProgressBase: (input: CoursesStubProps) => <><output data-testid="courses-state">{input.state}</output><output data-testid="courses-rows">{input.props.rows.map((row) => `${row.id}:${row.percent}`).join("|")}</output><button onClick={() => { const key = Object.keys(input.on ?? {}).find((item) => item.startsWith("open:")); if (key) void input.on?.[key]?.() }}>open-course</button><button onClick={input.on?.retry}>retry-courses</button></> }))

import { WhoToFollow } from "./WhoToFollow"
import { UpcomingLivestreamCard } from "./UpcomingLivestreamCard"
import { MyCoursesProgress } from "./MyCoursesProgress"

describe("connected dashboard blocks", () => {
    beforeEach(() => {
        vi.clearAllMocks(); mocks.suggested.data = undefined; mocks.suggested.error = undefined; mocks.live.data = undefined; mocks.live.error = undefined; mocks.courses.data = undefined; mocks.courses.error = undefined
    })

    it("hides, loads and follows suggested users with route resolution", async () => {
        const view = render(<WhoToFollow />)
        expect(screen.getByTestId("who-state")).toHaveTextContent("pending")
        mocks.suggested.data = []; view.rerender(<WhoToFollow />); expect(screen.getByTestId("who-state")).toHaveTextContent("hidden")
        mocks.suggested.data = [{ globalId: "u1", username: "ada", displayName: "Ada", avatar: null, openToWork: true }]; mocks.route.trigger.mockResolvedValue({ data: { resolveRoute: { data: { path: "/en/profile/ada" } } } }); mocks.follow.trigger.mockResolvedValue({ data: { setFollow: { success: true } } }); view.rerender(<WhoToFollow />)
        await waitFor(() => expect(screen.getByTestId("who-state")).toHaveTextContent("ready")); fireEvent.click(screen.getByRole("button", { name: "open" })); await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/en/profile/ada")); fireEvent.click(screen.getByRole("button", { name: "follow" })); await waitFor(() => expect(screen.getByTestId("who-users")).toHaveTextContent("Ada:true"))
        expect(mocks.follow.trigger).toHaveBeenCalledWith({ userId: "u1", follow: true })
    })

    it("separates livestream failed/pending/hidden/ready and strips locale on open", async () => {
        const view = render(<UpcomingLivestreamCard />); expect(screen.getByTestId("live-state")).toHaveTextContent("pending")
        mocks.live.error = new Error("offline"); view.rerender(<UpcomingLivestreamCard />); expect(screen.getByTestId("live-state")).toHaveTextContent("failed")
        mocks.live.error = undefined; mocks.live.data = []; view.rerender(<UpcomingLivestreamCard />); expect(screen.getByTestId("live-state")).toHaveTextContent("hidden")
        mocks.live.data = [{ courseGlobalId: "course", courseTitle: "Course", sessionTitle: null, nextStartAt: "2026-02-01T00:00:00.000Z" }, { courseGlobalId: "course-2", courseTitle: "Earlier", sessionTitle: "Live", nextStartAt: "2026-01-01T00:00:00.000Z" }]; mocks.route.trigger.mockResolvedValue({ data: { resolveRoute: { data: { path: "/en/courses/course-2" } } } }); view.rerender(<UpcomingLivestreamCard />)
        await waitFor(() => expect(screen.getByTestId("live-state")).toHaveTextContent("ready")); expect(screen.getByTestId("live-rows").textContent).toContain("course-2"); fireEvent.click(screen.getByRole("button", { name: "open-live" })); await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/courses/course-2"))
    })

    it("separates course progress states and maps completion dimensions", async () => {
        const view = render(<MyCoursesProgress />); expect(screen.getByTestId("courses-state")).toHaveTextContent("pending")
        mocks.courses.error = new Error("offline"); view.rerender(<MyCoursesProgress />); expect(screen.getByTestId("courses-state")).toHaveTextContent("failed")
        mocks.courses.error = undefined; mocks.courses.data = []; view.rerender(<MyCoursesProgress />); expect(screen.getByTestId("courses-state")).toHaveTextContent("empty")
        mocks.courses.data = [{ globalId: "course", label: "Course", completionPercent: 125, isEnrolled: false, contentCompleted: 2, contentTotal: 4, challengeCompleted: 1, challengeTotal: 2, completed: 1, total: 2, thumbnailUrl: null }]; mocks.route.trigger.mockResolvedValue({ data: { resolveRoute: { data: { path: "/en/courses/course" } } } }); view.rerender(<MyCoursesProgress />)
        await waitFor(() => expect(screen.getByTestId("courses-state")).toHaveTextContent("ready")); expect(screen.getByTestId("courses-rows")).toHaveTextContent("course:100"); fireEvent.click(screen.getByRole("button", { name: "open-course" })); await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/courses/course"))
    })
})
