import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _CourseLeaderboardPage } from "./component"

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock)

const props = {
    title: "Course leaderboard",
    trail: [{ id: "course", label: "TypeScript" }, { id: "leaderboard", label: "Course leaderboard" }],
    categoryLabel: "Ranking category",
    selectedCategory: "total" as const,
    categories: [{ id: "total" as const, label: "Total XP" }],
    board: {
        standing: { rank: 4, rankLabel: "Rank #4", title: "Rank #4", subtitle: "480 XP" },
        podium: [],
        rows: [],
    },
    listLabel: "Course standings",
    meLabel: "You",
    anonymousLabel: "Learner",
    climbLabel: "Continue learning",
    emptyMessage: "No learners are ranked in this course yet.",
    errorMessage: "Could not load the course leaderboard.",
    retryLabel: "Try again",
}

describe("CourseLeaderboardPage", () => {
    it("keeps category context and an honest empty result", () => {
        render(<_CourseLeaderboardPage state="empty" props={props} />)
        expect(screen.getByRole("heading", { name: "Course leaderboard" })).toBeInTheDocument()
        expect(screen.getByText("Total XP")).toBeInTheDocument()
        expect(screen.getByText("No learners are ranked in this course yet.")).toBeInTheDocument()
    })
    it("renders a ready podium, rows and climb recovery actions", () => { const climb = vi.fn(); const retry = vi.fn(); render(<_CourseLeaderboardPage state="ready" props={{ ...props, board: { standing: props.board.standing, podium: [{ rank: 1, username: "Ada", avatar: null, rankLabel: "Rank #1", pointsLabel: "100 XP", isMe: false }], rows: [{ id: "row", rank: 4, rankLabel: "Rank #4", name: "Me", avatar: null, points: "40 XP", isMe: true }], selfRow: { id: "viewer", rank: 9, rankLabel: "Rank #9", name: "You", avatar: null, points: "20 XP", isMe: true }, ellipsisLabel: "5 between" } }} on={{ climb, retry }} />); expect(screen.getByText("Ada")).toBeInTheDocument(); expect(screen.getByText("Me")).toBeInTheDocument(); fireEvent.click(screen.getByRole("button", { name: "Continue learning" })); expect(climb).toHaveBeenCalledOnce(); expect(retry).not.toHaveBeenCalled() })
})
