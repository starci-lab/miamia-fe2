import { Tree } from "@/components/branches/Tree"; import { EmptyNotice } from "@/components/composites/EmptyNotice"; import { GameLobbyPanel } from "@/components/composites/GameLobbyPanel"; import { GameResultCard } from "@/components/composites/GameResultCard"; import { GameCanvas } from "@/components/leaves/GameCanvas"; import { Button } from "@/components/leaves/Button"
import { defineCompositeComponent, defineContractComponent, defineLeafComponent, type BlockProps } from "@/components/contracts/props"; import type { GameAnswerResult, GameCharacter, GameSnapshot, GameType } from "@/modules/games/types"
/** Runtime data needed to render every game connection phase. */
export type GameRunnerData = { readonly gameType: GameType; readonly character: GameCharacter; readonly snapshot?: GameSnapshot; readonly answerResult?: GameAnswerResult; readonly errorMessage?: string }
/** User actions routed from game chrome and canvas back to Colyseus. */
export type GameRunnerActions = { readonly copyCode?: () => void; readonly restart?: () => void; readonly retry?: () => void; readonly exit?: () => void; readonly answer?: (index: number) => void }
/** Pure block contract for the finite game runner states. */
export type GameRunnerProps = BlockProps<"connecting" | "waiting" | "playing" | "finished" | "failed" | "disconnected", GameRunnerData> & { readonly on?: GameRunnerActions }
/** Render connection, lobby, canvas, result and recovery chrome by server state. */
export const _GameRunner = (input: GameRunnerProps) => {
    const snapshot = input.props.snapshot; const ranked = [...(snapshot?.players ?? [])].sort((a, b) => b.score - a.score)
    // vn-ok: This pure block formats localized Vietnamese runtime copy for each game state.
    const content = defineContractComponent("game-runner-stack", {
        ...(input.state === "waiting" ? { lobby: defineCompositeComponent("game-lobby-panel", {}, () => <GameLobbyPanel props={{ title: "Đang chờ bạn vào phòng", roomCode: snapshot?.roomCode, players: (snapshot?.players ?? []).map((player) => `${player.name}${player.bot ? " · máy" : ""}`), copyLabel: "Sao chép mã phòng" }} on={{ copyCode: input.on?.copyCode }} />) } : {}), // vn-ok: localized runtime copy
        ...(input.state === "playing" || input.state === "finished" ? { canvas: defineContractComponent("game-canvas-frame", { canvas: defineLeafComponent("game-canvas", {}, () => <GameCanvas props={{ gameType: input.props.gameType, character: input.props.character, snapshot, answerResult: input.props.answerResult }} on={{ answer: input.on?.answer }} />) }) } : {}),
        ...(input.state === "finished" ? { result: defineCompositeComponent("game-result-card", {}, () => <GameResultCard props={{ title: snapshot?.winner === "DRAW" ? "Ván đấu hòa" : `${snapshot?.winner ?? "Đội thắng"} chiến thắng`, players: ranked.map((player, index) => `${index + 1}. ${player.name} · ${player.score} điểm · combo ${player.combo}`), rematchLabel: "Chơi lại", lobbyLabel: "Về sảnh" }} on={{ rematch: input.on?.restart, lobby: input.on?.exit }} />) } : {}), // vn-ok: localized runtime copy
        ...(input.state === "connecting" ? { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ message: "Đang kết nối server trò chơi…", description: "Colyseus chạy độc lập với API học tập." }} />) } : {}), // vn-ok: localized runtime copy
        ...(input.state === "failed" || input.state === "disconnected" ? { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ message: input.state === "failed" ? "Chưa vào được phòng" : "Kết nối phòng đã đóng", description: input.props.errorMessage, actionLabel: "Thử lại" }} on={{ act: input.on?.retry }} />) } : {}), // vn-ok: localized runtime copy
        exit: defineLeafComponent("button", {}, () => <Button props={{ label: "Về sảnh trò chơi", variant: "ghost" }} on={{ press: input.on?.exit }} />), // vn-ok: localized runtime copy
    })
    return <Tree contract="game-runner-stack" render={content} />
}
/** Declares the finite runner renderer as a pure game block. */
export const meta = { shape: "block", world: "pure", domain: "games" } as const
