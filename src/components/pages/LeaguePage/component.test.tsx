import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _LeaguePage, type LeaguePageProps } from "./component"

const board = {
    standing: { rank: 4, rankLabel: "Rank 4", title: "Rank 4", subtitle: "70 points" },
    ctaLabel: "Climb",
    progressAccessibleLabel: "League",
    podium: [{ rank: 1, username: "Ada", avatar: null, rankLabel: "Rank 1", pointsLabel: "100 points", isMe: false }],
    meLabel: "You",
    anonymousLabel: "Anonymous",
    rows: [{ id: "R2xvYmFsOjE=", rank: 4, rankLabel: "Rank 4", name: "Una", avatar: null, points: "70 points", rankDelta: 1, movementLabel: "Up", verdict: "success" as const, isMe: false, isFollowing: false, isPending: false, followLabel: "Follow", followingLabel: "Following" }],
    listLabel: "League entries",
    selfRow: { id: "self", rank: 4, rankLabel: "Rank 4", name: "You", avatar: null, points: "70 points", isMe: true, isFollowing: false, isPending: false, followLabel: "Follow", followingLabel: "Following" },
    ellipsisLabel: "⋯ 5 others",
}

const props = (): LeaguePageProps => ({
    state: "ready",
    props: { title: "League", trail: [{ id: "home", label: "Home" }, { id: "league", label: "League" }], scopeLabel: "Scope", scope: "weekly", weeklyLabel: "Weekly", globalLabel: "Global", board, emptyMessage: "Nobody yet", errorMessage: "Failed", retryLabel: "Retry" },
    on: { selectScope: vi.fn(), goHome: vi.fn(), climb: vi.fn(), retry: vi.fn(), [`open:${board.rows[0].id}`]: vi.fn(), [`follow:${board.rows[0].id}`]: vi.fn() },
})

describe("_LeaguePage", () => {
    it("draws the ready board and forwards scope, climb and row actions", () => {
        const input = props()
        render(<_LeaguePage {...input} />)
        fireEvent.click(screen.getByRole("tab", { name: "Global" }))
        fireEvent.click(screen.getByRole("button", { name: "Climb" }))
        fireEvent.click(screen.getByRole("button", { name: "Follow" }))
        expect(input.on?.selectScope).toHaveBeenCalledWith("global")
        expect(input.on?.climb).toHaveBeenCalledOnce()
        expect(input.on?.[`follow:${board.rows[0].id}`]).toHaveBeenCalledOnce()
    })

    it("uses climb for empty and retry for failed boards", () => {
        const input = { ...props(), state: "empty" as const }
        render(<_LeaguePage {...input} />)
        fireEvent.click(screen.getByRole("button", { name: "Climb" }))
        expect(input.on?.climb).toHaveBeenCalledOnce()
        const failed = { ...props(), state: "failed" as const }
        render(<_LeaguePage {...failed} />)
        fireEvent.click(screen.getByRole("button", { name: "Retry" }))
        expect(failed.on?.retry).toHaveBeenCalledOnce()
    })
})
