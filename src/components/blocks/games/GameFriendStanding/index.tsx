"use client"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { useQueryFriendsLeaderboardSwr } from "@/hooks/swr/useQueryFriendsLeaderboardSwr"
import type { FriendsLeaderboardRow } from "@/modules/api/graphql/queries/types/friends-leaderboard"
import { GameFriendStandingBase } from "./component"

/** Navigation and authentication actions exposed by the friend standing block. */
export type GameFriendStandingProps = { readonly onChooseGame: () => void; readonly onRequireSignIn: () => void }

/** The five states the rivalry hero can settle into. */
type FriendStandingState = "pending" | "guest" | "ready" | "empty" | "failed"

/** Signed-out beats a failed fetch beats still-loading beats no viewer row; ready is what's left. */
const resolveState = (
    signedIn: boolean,
    hasError: boolean,
    hasData: boolean,
    hasViewer: boolean,
): FriendStandingState => {
    if (!signedIn) return "guest"
    if (hasError) return "failed"
    if (!hasData) return "pending"
    if (!hasViewer) return "empty"
    return "ready"
}

/** Resolves current MiaMia Vietnamese product copy at runtime. */
const resolveTitle = (state: FriendStandingState, viewer: FriendsLeaderboardRow | undefined): string => {
    if (state === "guest") return "Rủ bạn vào một phòng MiaMia" // vn-ok: MiaMia Vietnamese runtime copy.
    if (state === "failed") return "Chưa đọc được bảng bạn bè" // vn-ok: MiaMia Vietnamese runtime copy.
    if (viewer === undefined) return "Chơi cùng bạn, không cần học một mình" // vn-ok: MiaMia Vietnamese runtime copy.
    return `Bạn đang hạng ${viewer.rank} trong nhóm bạn` // vn-ok: MiaMia Vietnamese runtime copy.
}

/** Resolves current MiaMia Vietnamese product copy at runtime. */
const resolveSubtitle = (gap: number | undefined, aheadName: string | undefined): string => {
    if (gap === undefined) return "Chọn một trò, tạo mã phòng và gửi cho người bạn muốn đấu cùng." // vn-ok: MiaMia Vietnamese runtime copy.
    return `Thêm ${gap} XP để vượt ${aheadName ?? "người phía trước"} tuần này.` // vn-ok: MiaMia Vietnamese runtime copy.
}

/** Resolve private weekly friend standing into the rivalry hero states. */
export const GameFriendStanding = ({ onChooseGame, onRequireSignIn }: GameFriendStandingProps) => {
    const token = useSessionToken()
    const query = useQueryFriendsLeaderboardSwr(token !== undefined)
    const rows = query.data ?? []
    const viewer = rows.find((row) => row.isViewer)
    const ahead = viewer === undefined
        ? undefined
        : rows.filter((row) => row.weeklyXp > viewer.weeklyXp).sort((a, b) => a.weeklyXp - b.weeklyXp)[0]
    const state = resolveState(token !== undefined, query.error !== undefined, query.data !== undefined, viewer !== undefined)
    const gap = viewer === undefined || ahead === undefined ? undefined : Math.max(0, ahead.weeklyXp - viewer.weeklyXp)
    const progressRatio = viewer === undefined || ahead === undefined
        ? undefined
        : Math.min(1, viewer.weeklyXp / Math.max(1, ahead.weeklyXp))

    return (
        <GameFriendStandingBase
            state={state}
            props={{
                rank: viewer?.rank,
                title: resolveTitle(state, viewer),
                subtitle: resolveSubtitle(gap, ahead?.name),
                fact: viewer === undefined ? undefined : `${viewer.weeklyXp} XP`,
                // vn-ok: This block resolves current MiaMia Vietnamese product copy at runtime.
                ctaLabel: state === "guest" ? "Đăng nhập để chơi cùng bạn" : "Chọn trò để thách đấu",
                // vn-ok: This block resolves current MiaMia Vietnamese product copy at runtime.
                progressLabel: gap === undefined ? undefined : `Còn ${gap} XP`,
                progressRatio,
            }}
            on={{ chooseGame: onChooseGame, requireSignIn: onRequireSignIn }}
        />
    )
}

/** Declares the friend standing binder as a connected game block. */
export const meta = { shape: "block", world: "connected", domain: "games" } as const
