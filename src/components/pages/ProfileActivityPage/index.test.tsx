import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ProfileActivityPage } from "./index"

const m = vi.hoisted(() => ({ profile: { data: undefined as unknown, error: undefined as unknown, isLoading: true }, achievements: { data: undefined as unknown, error: undefined as unknown, isLoading: true }, activity: { data: undefined as unknown, error: undefined as unknown, isLoading: true, mutate: vi.fn() }, view: undefined as unknown }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada" }) }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => m.profile }))
vi.mock("@/hooks/swr/useQueryProfileEvidenceSwr", () => ({ useQueryProfileEvidenceSwr: (kind: string) => kind === "achievements" ? m.achievements : m.activity }))
vi.mock("./component", () => ({ _ProfileActivityPage: (input: unknown) => { m.view = input; const page = input as { feed: { on?: { resultAction?: () => void } } }; return <><output data-testid="achievement-state">{(input as { achievementState: string }).achievementState}</output><output data-testid="feed-state">{(input as { feed: { state: string } }).feed.state}</output><button onClick={page.feed.on?.resultAction}>retry-feed</button></> } }))

beforeEach(() => { vi.clearAllMocks(); m.profile.data = undefined; m.profile.error = undefined; m.profile.isLoading = true; m.achievements.data = undefined; m.achievements.error = undefined; m.achievements.isLoading = true; m.activity.data = undefined; m.activity.error = undefined; m.activity.isLoading = true })

describe("ProfileActivityPage connected half", () => {
    it("resolves pending, empty and error states independently", () => {
        const view = render(<ProfileActivityPage />); expect(screen.getByTestId("achievement-state")).toHaveTextContent("pending"); expect(screen.getByTestId("feed-state")).toHaveTextContent("pending"); m.profile.isLoading = false; m.profile.data = { id: "user" }; m.achievements.isLoading = false; m.achievements.data = []; m.activity.isLoading = false; m.activity.data = { items: [] }; view.rerender(<ProfileActivityPage />); expect(screen.getByTestId("achievement-state")).toHaveTextContent("ready"); expect(screen.getByTestId("feed-state")).toHaveTextContent("platformEmpty"); m.activity.error = new Error("offline"); view.rerender(<ProfileActivityPage />); expect(screen.getByTestId("feed-state")).toHaveTextContent("failed"); fireEvent.click(screen.getByText("retry-feed")); expect(m.activity.mutate).toHaveBeenCalledOnce()
    })
    it("groups activity by formatted day and keeps earned achievements", () => {
        m.profile.isLoading = false; m.profile.data = { id: "user" }; m.achievements.isLoading = false; m.achievements.data = [{ slug: "builder", name: "Builder", earned: true, currentValue: 3, threshold: 3, tierReached: "Gold", rarityPercent: 2 }]; m.activity.isLoading = false; m.activity.data = { items: [{ id: "a", at: "2025-01-01T10:00:00.000Z", actorUsername: "Ada", actorAvatar: null, type: "COMPLETED_LESSON", targetLabel: "Lesson", reactionCount: 2, isMine: true }, { id: "b", at: "2025-01-01T11:00:00.000Z", actorUsername: "Ada", actorAvatar: "avatar", type: "EARNED_BADGE", targetLabel: null, reactionCount: 0, isMine: false }] }; render(<ProfileActivityPage />); const page = m.view as { achievements: ReadonlyArray<{ name: string }>; feed: { props: { days: ReadonlyArray<{ rows: ReadonlyArray<{ action: string }> }> } } }; expect(page.achievements).toHaveLength(1); expect(page.feed.props.days).toHaveLength(1); expect(page.feed.props.days[0].rows).toHaveLength(2); expect(page.feed.props.days[0].rows[0].action).toBe("completed lesson")
    })
})
