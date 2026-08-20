import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ locale: "en", category: null as string | null, course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, me: { data: undefined as unknown }, board: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => mocks.locale }))
vi.mock("next/navigation", () => ({ useSearchParams: () => ({ get: () => mocks.category }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => mocks.course }))
vi.mock("@/hooks/swr/useQueryMeSwr", () => ({ useQueryMeSwr: () => mocks.me }))
vi.mock("@/hooks/swr/useQueryCourseLeaderboardSwr", () => ({ useQueryCourseLeaderboardSwr: () => mocks.board }))
type LeaderStubProps = { readonly state: string; readonly props: { readonly selectedCategory: string; readonly board: { readonly podium: ReadonlyArray<{ readonly username?: string }>; readonly rows: ReadonlyArray<{ readonly name: string }>; readonly selfRow?: unknown } }; readonly on: { readonly course: () => void; readonly selectCategory: (category: string) => void; readonly climb: () => void; readonly retry: () => void } }
vi.mock("./component", () => ({ CourseLeaderboardPageBase: (input: LeaderStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="category">{input.props.selectedCategory}</output><output data-testid="podium">{input.props.board.podium.map((row) => row.username).join("|")}</output><output data-testid="rows">{input.props.board.rows.map((row) => row.name).join("|")}</output><button onClick={input.on.course}>course</button><button onClick={() => input.on.selectCategory("challenge")}>category</button><button onClick={input.on.climb}>climb</button><button onClick={input.on.retry}>retry</button></> }))

import { CourseLeaderboardPage } from "./index"

describe("CourseLeaderboardPage connected ranking", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.locale = "en"; mocks.category = null; mocks.course.data = undefined; mocks.course.error = undefined; mocks.me.data = undefined; mocks.board.data = undefined; mocks.board.error = undefined })

    it("resolves pending, failed, empty and ready ranking states", async () => {
        const view = render(<CourseLeaderboardPage displayId="course-1" />); expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.course.error = new Error("offline"); view.rerender(<CourseLeaderboardPage displayId="course-1" />); expect(screen.getByTestId("state")).toHaveTextContent("failed")
        mocks.course.error = undefined; mocks.course.data = { id: "course-1", title: "Algorithms", isEnrolled: false }; mocks.board.data = { entries: [], myRank: null, computedAt: undefined }; view.rerender(<CourseLeaderboardPage displayId="course-1" />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("empty"))
        mocks.me.data = { id: "u1", username: "Ada", avatar: null }; mocks.board.data = { entries: [{ userId: "u2", enrollmentId: "e2", username: "Bob", avatar: null, totalXp: 20, totalScore: 4, lessonsRead: 2, milestoneProgress: 1 }, { userId: "u1", enrollmentId: "e1", username: null, avatar: null, totalXp: 10, totalScore: 8, lessonsRead: 3, milestoneProgress: 2 }, { userId: "u3", enrollmentId: "e3", username: "Cy", avatar: null, totalXp: 30, totalScore: 7, lessonsRead: 1, milestoneProgress: 0 }, { userId: "u4", enrollmentId: "e4", username: "Dee", avatar: null, totalXp: 4, totalScore: 1, lessonsRead: 1, milestoneProgress: 1 }], myRank: { rank: 8, totalXp: 10, totalScore: 8, lessonsRead: 3, milestoneProgress: 2 }, computedAt: "2026-01-01T00:00:00.000Z" }; mocks.category = "challenge"; mocks.locale = "vi"; view.rerender(<CourseLeaderboardPage displayId="course-1" />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready")); expect(screen.getByTestId("category")).toHaveTextContent("challenge")
        fireEvent.click(screen.getByRole("button", { name: "category" })); fireEvent.click(screen.getByRole("button", { name: "course" })); fireEvent.click(screen.getByRole("button", { name: "climb" })); expect(mocks.push).toHaveBeenCalledWith("/courses/course-1/learn/leaderboard?category=challenge"); expect(mocks.push).toHaveBeenCalledWith("/courses/course-1"); expect(mocks.push).toHaveBeenCalledWith("/courses/course-1/learn/content")
    })
})
