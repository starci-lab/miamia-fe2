import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ token: undefined as string | undefined, friends: { data: undefined as unknown, error: undefined as unknown }, me: { data: undefined as unknown }, profile: { data: undefined as unknown }, wrapped: { data: undefined as unknown, error: undefined as unknown }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada" }) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => mocks.token }))
vi.mock("@/hooks/swr/useQueryFriendsLeaderboardSwr", () => ({ useQueryFriendsLeaderboardSwr: () => mocks.friends }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks", () => ({ useQueryMeSwr: () => mocks.me, useQueryUserProfileSwr: () => mocks.profile, useQueryWrappedSwr: () => mocks.wrapped }))
type FriendStubProps = { readonly state: string; readonly props: { readonly title: string; readonly subtitle: string; readonly progressRatio?: number }; readonly on: { readonly chooseGame: () => void; readonly requireSignIn: () => void } }
vi.mock("@/components/blocks/games/GameFriendStanding/component", () => ({ GameFriendStandingBase: (input: FriendStubProps) => <><output data-testid="friend-state">{input.state}</output><output data-testid="friend-title">{input.props.title}</output><output data-testid="friend-progress">{input.props.progressRatio}</output><button onClick={input.on.chooseGame}>choose</button><button onClick={input.on.requireSignIn}>sign-in</button></> }))
type WrappedStubProps = { readonly props: { readonly period: string; readonly summary: { readonly state: string; readonly props: { readonly notice: string } } }; readonly on: { readonly selectPeriod: (period: string) => void } }
vi.mock("@/components/pages/ProfileWrappedPage/component", () => ({ ProfileWrappedPageBase: (input: WrappedStubProps) => <><output data-testid="wrapped-state">{input.props.summary.state}</output><output data-testid="wrapped-notice">{input.props.summary.props.notice}</output><output data-testid="period">{input.props.period}</output><button onClick={() => input.on.selectPeriod("monthly")}>month</button></> }))
import { GameFriendStanding } from "@/components/blocks/games/GameFriendStanding/index"
import { ProfileWrappedPage } from "@/components/pages/ProfileWrappedPage/index"

describe("measured state-rich connected targets", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.token = undefined; mocks.friends.data = undefined; mocks.friends.error = undefined; mocks.me.data = undefined; mocks.profile.data = undefined; mocks.wrapped.data = undefined; mocks.wrapped.error = undefined })
    it("covers friend standing guest/failed/pending/empty/ready states", async () => {
        const choose = vi.fn(); const signIn = vi.fn(); const view = render(<GameFriendStanding onChooseGame={choose} onRequireSignIn={signIn} />); expect(screen.getByTestId("friend-state")).toHaveTextContent("guest")
        mocks.token = "token"; mocks.friends.error = new Error("offline"); view.rerender(<GameFriendStanding onChooseGame={choose} onRequireSignIn={signIn} />); expect(screen.getByTestId("friend-state")).toHaveTextContent("failed")
        mocks.friends.error = undefined; mocks.friends.data = []; view.rerender(<GameFriendStanding onChooseGame={choose} onRequireSignIn={signIn} />); expect(screen.getByTestId("friend-state")).toHaveTextContent("empty")
        mocks.friends.data = [{ id: "u1", name: "Ada", rank: 2, weeklyXp: 10, isViewer: true }, { id: "u2", name: "Bob", rank: 1, weeklyXp: 20, isViewer: false }]; view.rerender(<GameFriendStanding onChooseGame={choose} onRequireSignIn={signIn} />); await waitFor(() => expect(screen.getByTestId("friend-state")).toHaveTextContent("ready")); expect(screen.getByTestId("friend-progress")).toHaveTextContent("0.5"); fireEvent.click(screen.getByRole("button", { name: "choose" })); expect(choose).toHaveBeenCalled()
    })
    it("covers wrapped public/pending/locked/unlocked states and period selection", async () => {
        const view = render(<ProfileWrappedPage />); expect(screen.getByTestId("wrapped-state")).toHaveTextContent("failed")
        mocks.profile.data = { id: "u1" }; mocks.me.data = { id: "u1" }; view.rerender(<ProfileWrappedPage />); expect(screen.getByTestId("wrapped-state")).toHaveTextContent("pending")
        mocks.wrapped.data = { isUnlocked: false, daysUntilUnlock: 3, stats: undefined }; view.rerender(<ProfileWrappedPage />); expect(screen.getByTestId("wrapped-state")).toHaveTextContent("locked"); fireEvent.click(screen.getByRole("button", { name: "month" })); expect(screen.getByTestId("period")).toHaveTextContent("monthly")
        mocks.wrapped.data = { isUnlocked: true, daysUntilUnlock: 0, stats: { xpEarned: 10, phrasesLearned: 2, papersCompleted: 1, longestStreak: 3 } }; view.rerender(<ProfileWrappedPage />); await waitFor(() => expect(screen.getByTestId("wrapped-state")).toHaveTextContent("unlocked"))
    })
})
