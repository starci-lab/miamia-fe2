import type { GameId, GameMode } from "./types"

/** One locally resolved game card and its supported server modes. */
export type GameDefinition = { readonly id: GameId; readonly title: string; readonly description: string; readonly cover: string; readonly modes: ReadonlyArray<GameMode> }

/** The four legacy-backed MiaMia games available in the hub. */
// vn-ok: These Vietnamese values are localized runtime product copy for the current MiaMia locale.
export const GAME_CATALOG: ReadonlyArray<GameDefinition> = [
    { id: "vocab_defense", title: "Thủ thành từ vựng", description: "Trả lời đúng để tung phép, dựng khiên và giữ căn cứ.", cover: "/game-assets/sprites/mia/attack-preview.webp", modes: ["SINGLE", "COUPLE", "TEAM2V2"] }, // vn-ok: localized runtime copy
    { id: "vocab_race", title: "Đua từ vựng", description: "Ai trả lời đúng nhanh hơn sẽ chạy xa hơn.", cover: "/game-assets/sprites/mia/run-preview.webp", modes: ["SINGLE", "COUPLE"] }, // vn-ok: localized runtime copy
    { id: "match_pairs", title: "Ghép cặp", description: "Ghép từ và nghĩa trên bàn chung trước đội đối thủ.", cover: "/game-assets/sprites/max/think-preview.webp", modes: ["SINGLE", "COUPLE", "TEAM2V2"] }, // vn-ok: localized runtime copy
    { id: "couple_quiz", title: "Đấu đôi", description: "Mia và Max đối đầu trực tiếp qua từng câu hỏi.", cover: "/game-assets/sprites/mia/celebrate-preview.webp", modes: ["SINGLE", "COUPLE"] }, // vn-ok: localized runtime copy
]
