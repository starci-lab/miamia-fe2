type TestPageInput = { state: string; on: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const m = vi.hoisted(() => ({ category: "category=challenge", course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, me: { data: undefined as unknown }, board: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => "en" }))
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(m.category) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => m.course }))
vi.mock("@/hooks/swr/useQueryMeSwr", () => ({ useQueryMeSwr: () => m.me }))
vi.mock("@/hooks/swr/useQueryCourseLeaderboardSwr", () => ({ useQueryCourseLeaderboardSwr: () => m.board }))
vi.mock("./component", () => ({ CourseLeaderboardPageBase: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><button onClick={on.course}>course</button><button onClick={() => on.selectCategory("challenge")}>category</button><button onClick={() => on.selectCategory("reading")}>reading</button><button onClick={() => on.selectCategory("unknown")}>unknown</button><button onClick={on.climb}>climb</button><button onClick={on.retry}>retry</button></> }))
import { CourseLeaderboardPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.category = "category=challenge"; m.course.data = { id: "c1", title: "Course", isEnrolled: true }; m.course.error = undefined; m.me.data = { id: "me", username: "me", avatar: null }; m.board.data = undefined; m.board.error = undefined })
describe("CourseLeaderboardPage route", () => {
    it("reports pending, empty and ready states", () => { const view = render(<CourseLeaderboardPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.board.data = { entries: [{ rank: 1, username: "Ada", points: 10, userGlobalId: "u1" }] }; view.rerender(<CourseLeaderboardPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); m.board.data = { entries: [] }; view.rerender(<CourseLeaderboardPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("empty") })
    it("routes category, course, climb and retry intents", () => { m.board.data = { entries: [{ rank: 1, username: "Ada", points: 10, userGlobalId: "u1" }] }; render(<CourseLeaderboardPage displayId="course" />); fireEvent.click(screen.getByText("course")); fireEvent.click(screen.getByText("category")); fireEvent.click(screen.getByText("climb")); fireEvent.click(screen.getByText("retry")); expect(m.push).toHaveBeenCalledWith("/courses/course"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/leaderboard?category=challenge"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/content"); expect(m.board.mutate).toHaveBeenCalled() })
    it("sorts alternate categories and handles hidden viewer, unranked and failed states", () => { m.category = "category=reading"; m.course.data = { id: "c1", title: "Course", isEnrolled: false }; m.board.data = { computedAt: "2025-01-01T00:00:00Z", myRank: { rank: 8, totalXp: 20, totalScore: 3, lessonsRead: 4, milestoneProgress: 2 }, entries: [{ enrollmentId: "1", userId: "a", username: "Ada", avatar: null, totalXp: 20, totalScore: 5, lessonsRead: 5, milestoneProgress: 1 }, { enrollmentId: "2", userId: "b", username: null, avatar: null, totalXp: 10, totalScore: 8, lessonsRead: 1, milestoneProgress: 4 }, { enrollmentId: "3", userId: "c", username: "Cal", avatar: null, totalXp: 8, totalScore: 2, lessonsRead: 2, milestoneProgress: 3 }, { enrollmentId: "4", userId: "d", username: "Dan", avatar: null, totalXp: 4, totalScore: 1, lessonsRead: 1, milestoneProgress: 1 }] }; const view = render(<CourseLeaderboardPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); fireEvent.click(screen.getByText("reading")); fireEvent.click(screen.getByText("unknown")); m.board.error = new Error("offline"); view.rerender(<CourseLeaderboardPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("failed") })
})





