type TestPageInput = { state: string; on: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ token: "token" as string | undefined, restoring: false, scope: "", weekly: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, global: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, me: { data: { username: "me", avatar: null } }, push: vi.fn(), replace: vi.fn(), follow: vi.fn().mockResolvedValue({ data: { setFollow: { success: true } } }) }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(m.scope) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push, replace: m.replace }) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => m.token }))
vi.mock("@/hooks/auth/useSessionRefresh", () => ({ useSessionRefresh: () => ({ isRestoring: m.restoring }) }))
vi.mock("@/hooks", () => ({ useQueryMeSwr: () => m.me, useQueryMyLeagueSwr: () => m.weekly, useQueryGlobalLeaderboardSwr: () => m.global, useMutateSetFollowSwr: () => ({ trigger: m.follow }) }))
vi.mock("./component", () => ({ LeaguePageBase: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><button onClick={() => on.selectScope?.("global")}>global</button><button onClick={on.goHome}>home</button><button onClick={on.climb}>climb</button><button onClick={on.retry}>retry</button><button onClick={on["follow:R2xvYmFsOjE="]}>follow-R2xvYmFsOjE=</button><button onClick={on["follow:R2xvYmFsOjQ="]}>follow-R2xvYmFsOjQ=</button><button onClick={on["follow:bad-id"]}>follow-bad-id</button><button onClick={on["open:R2xvYmFsOjE="]}>open-R2xvYmFsOjE=</button><button onClick={on["open:R2xvYmFsOjQ="]}>open-R2xvYmFsOjQ=</button></> }))
import { LeaguePage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.token = "token"; m.restoring = false; m.scope = ""; m.weekly.data = undefined; m.weekly.error = undefined; m.global.data = undefined; m.global.error = undefined; m.follow.mockResolvedValue({ data: { setFollow: { success: true } } }) })
describe("LeaguePage route", () => {
    it("keeps the signed-in page pending while the league answer is unresolved", () => {
        render(<LeaguePage />)
        expect(screen.getByTestId("state")).toHaveTextContent("pending")
        expect(m.replace).not.toHaveBeenCalled()
    })
    it("withholds signed-out content and redirects to authentication", () => { m.token = undefined; render(<LeaguePage />); expect(screen.queryByTestId("state")).not.toBeInTheDocument(); expect(m.replace).toHaveBeenCalledWith("/authentication") })
    it("reports pending, failed, empty and ready states with navigation", () => { const view = render(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.weekly.error = new Error("offline"); view.rerender(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); m.weekly.error = undefined; m.weekly.data = { weekEndAt: new Date(Date.now() + 1000).toISOString(), entries: [] }; view.rerender(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("empty"); m.weekly.data = { weekEndAt: new Date(Date.now() + 1000).toISOString(), entries: [{ userGlobalId: "gid://User/1", username: "Ada", rank: 1, weekPoints: 10, rankDelta: 0, avatar: null }] }; view.rerender(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); fireEvent.click(screen.getByText("global")); fireEvent.click(screen.getByText("home")); fireEvent.click(screen.getByText("climb")); fireEvent.click(screen.getByText("retry")); expect(m.push).toHaveBeenCalledWith("/league?scope=global"); expect(m.push).toHaveBeenCalledWith("/dashboard"); expect(m.push).toHaveBeenCalledWith("/dashboard?tab=courses"); expect(m.weekly.mutate).toHaveBeenCalled() })
    it("assembles weekly rows and toggles follow/profile actions", async () => {
        const id = "R2xvYmFsOjE="
        m.weekly.data = { weekEndAt: new Date(Date.now() + 90_000_000).toISOString(), entries: [
            { userGlobalId: "R2xvYmFsOjE=", username: "Ada", rank: 1, weekPoints: 100, rankDelta: 2, avatar: null },
            { userGlobalId: "R2xvYmFsOjI=", username: "Bob", rank: 2, weekPoints: 90, rankDelta: -1, avatar: null },
            { userGlobalId: "R2xvYmFsOjM=", username: null, rank: 3, weekPoints: 80, rankDelta: null, avatar: null },
            { userGlobalId: id, username: "me", rank: 4, weekPoints: 70, rankDelta: 1, avatar: null },
            { userGlobalId: "R2xvYmFsOjQ=", username: "Una", rank: 5, weekPoints: 60, rankDelta: -1, avatar: null },
        ] }
        const view = render(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("ready")
        fireEvent.click(screen.getByText(`follow-${id}`)); fireEvent.click(screen.getByText(`open-${id}`)); await new Promise((resolve) => setTimeout(resolve, 0))
        expect(m.follow).toHaveBeenCalledWith({ userId: "1", follow: true }); expect(m.push).not.toHaveBeenCalledWith("/profile/me")
        fireEvent.click(screen.getByText("open-R2xvYmFsOjQ=")); expect(m.push).toHaveBeenCalledWith("/profile/Una")
        m.scope = "scope=unknown"; view.rerender(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("ready")
    })
    it("rolls back optimistic follow state when the server rejects or throws", async () => {
        m.weekly.data = { weekEndAt: new Date(Date.now() + 1000).toISOString(), entries: [
            { userGlobalId: "R2xvYmFsOjE=", username: "Ada", rank: 1, weekPoints: 10, rankDelta: 0, avatar: null },
            { userGlobalId: "R2xvYmFsOjI=", username: "Bob", rank: 2, weekPoints: 9, rankDelta: 0, avatar: null },
            { userGlobalId: "R2xvYmFsOjM=", username: "Cara", rank: 3, weekPoints: 8, rankDelta: 0, avatar: null },
            { userGlobalId: "R2xvYmFsOjQ=", username: "Una", rank: 4, weekPoints: 7, rankDelta: 0, avatar: null },
        ] }
        m.follow.mockResolvedValueOnce({ data: { setFollow: { success: false, error: "DENIED" } } }).mockRejectedValueOnce(new Error("offline"))
        render(<LeaguePage />); fireEvent.click(screen.getByText("follow-R2xvYmFsOjQ=")); await new Promise((resolve) => setTimeout(resolve, 0)); fireEvent.click(screen.getByText("follow-R2xvYmFsOjQ=")); await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.follow).toHaveBeenCalledTimes(2)
    })
    it("ignores a malformed global id without mutating", () => {
        m.weekly.data = { weekEndAt: new Date(Date.now() + 1000).toISOString(), entries: [{ userGlobalId: "R2xvYmFsOjE=", username: "Ada", rank: 1, weekPoints: 10, rankDelta: 0, avatar: null }, { userGlobalId: "R2xvYmFsOjI=", username: "Bob", rank: 2, weekPoints: 9, rankDelta: 0, avatar: null }, { userGlobalId: "R2xvYmFsOjM=", username: "Cara", rank: 3, weekPoints: 8, rankDelta: 0, avatar: null }, { userGlobalId: "bad-id", username: "Bad", rank: 4, weekPoints: 7, rankDelta: 0, avatar: null }] }
        render(<LeaguePage />); fireEvent.click(screen.getByText("follow-bad-id")); expect(m.follow).not.toHaveBeenCalled()
    })
    it("builds global progress and pins a viewer omitted from the fetched slice", async () => {
        m.scope = "scope=global"; m.global.data = { myRank: 10, myPoints: 50, entries: [{ userGlobalId: "R2xvYmFsOjE=", username: "Ada", rank: 1, points: 100, isFollowing: false, avatar: null }, { userGlobalId: "R2xvYmFsOjI=", username: "Bob", rank: 2, points: 90, isFollowing: true, avatar: null }, { userGlobalId: "R2xvYmFsOjM=", username: "Una", rank: 3, points: 80, isFollowing: false, avatar: null }, { userGlobalId: "R2xvYmFsOjQ=", username: "Other", rank: 4, points: 70, isFollowing: false, avatar: null }] }
        m.weekly.data = { weekEndAt: new Date(Date.now() + 1000).toISOString(), entries: [] }
        render(<LeaguePage />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); fireEvent.click(screen.getByText("retry")); expect(m.global.mutate).toHaveBeenCalledOnce(); fireEvent.click(screen.getByText("global")); expect(m.push).toHaveBeenCalledWith("/league?scope=global")
    })
})


