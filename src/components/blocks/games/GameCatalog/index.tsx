import { GAME_CATALOG } from "@/modules/games/catalog"; import type { GameId } from "@/modules/games/types"; import { GameCatalogBase } from "./component"
/** Selection callback required by the connected game catalog. */
export type GameCatalogProps = { readonly onPickGame: (game: GameId) => void }
/** Bind the canonical four-game catalog to its setup selection action. */
// vn-ok: These two strings are localized Vietnamese runtime copy.
export const GameCatalog = ({ onPickGame }: GameCatalogProps) => <GameCatalogBase state="ready" props={{ title: "Chọn một trò để bắt đầu", games: GAME_CATALOG, actionLabel: "Thiết lập ván" }} on={{ pick: onPickGame }} />
/** Declares the catalog binder as a connected game block. */
export const meta = { shape: "block", world: "connected", domain: "games" } as const
