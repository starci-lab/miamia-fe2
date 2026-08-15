"use client"
import { useSessionToken } from "@/hooks/auth/useSessionToken"; import { useQueryFriendsLeaderboardSwr } from "@/hooks/swr/useQueryFriendsLeaderboardSwr"; import { _GameFriendStanding } from "./component"
/** Navigation and authentication actions exposed by the friend standing block. */
export type GameFriendStandingProps = { readonly onChooseGame: () => void; readonly onRequireSignIn: () => void }
/** Resolve private weekly friend standing into the rivalry hero states. */
export const GameFriendStanding = ({ onChooseGame, onRequireSignIn }: GameFriendStandingProps) => {
    const token = useSessionToken(); const query = useQueryFriendsLeaderboardSwr(token !== undefined); const rows = query.data ?? []
    const viewer = rows.find((row) => row.isViewer); const ahead = viewer === undefined ? undefined : rows.filter((row) => row.weeklyXp > viewer.weeklyXp).sort((a, b) => a.weeklyXp - b.weeklyXp)[0]
    const state = token === undefined ? "guest" : query.error ? "failed" : query.data === undefined ? "pending" : viewer === undefined ? "empty" : "ready"
    const gap = viewer === undefined || ahead === undefined ? undefined : Math.max(0, ahead.weeklyXp - viewer.weeklyXp)
    const progressRatio = viewer === undefined || ahead === undefined ? undefined : Math.min(1, viewer.weeklyXp / Math.max(1, ahead.weeklyXp))
    // vn-ok: This block resolves current MiaMia Vietnamese product copy at runtime.
    return <_GameFriendStanding state={state} props={{ rank: viewer?.rank, title: state === "guest" ? "Rủ bạn vào một phòng MiaMia" : state === "failed" ? "Chưa đọc được bảng bạn bè" : viewer === undefined ? "Chơi cùng bạn, không cần học một mình" : `Bạn đang hạng ${viewer.rank} trong nhóm bạn`, subtitle: gap === undefined ? "Chọn một trò, tạo mã phòng và gửi cho người bạn muốn đấu cùng." : `Thêm ${gap} XP để vượt ${ahead?.name ?? "người phía trước"} tuần này.`, fact: viewer === undefined ? undefined : `${viewer.weeklyXp} XP`, ctaLabel: state === "guest" ? "Đăng nhập để chơi cùng bạn" : "Chọn trò để thách đấu", progressLabel: gap === undefined ? undefined : `Còn ${gap} XP`, progressRatio }} on={{ chooseGame: onChooseGame, requireSignIn: onRequireSignIn }} />
}
/** Declares the friend standing binder as a connected game block. */
export const meta = { shape: "block", world: "connected", domain: "games" } as const
