import { Grammar } from "@/components/layouts/Grammar"; import { GameCatalogCard } from "@/components/composites/GameCatalogCard"; import { Heading } from "@/components/leaves/Heading"; import { renderComposite, layoutNode, renderLeaf, type BlockProps } from "@/modules/types/layout"; import type { GameDefinition } from "@/modules/games/catalog"; import type { GameId } from "@/modules/games/types"
type GameCatalogData = { readonly title: string; readonly games: ReadonlyArray<GameDefinition>; readonly actionLabel: string }
type GameCatalogActions = { readonly pick?: (game: GameId) => void }
type GameCatalogProps = BlockProps<"ready", GameCatalogData> & { readonly on?: GameCatalogActions }
/** Render the fixed four-game catalog below its section heading. */
export const GameCatalogBase = (input: GameCatalogProps) => <Grammar layout="game-catalog-section" render={layoutNode("game-catalog-section", {
    header: layoutNode("page-header-stack", { title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />) }),
    games: layoutNode("game-grid", { game: input.props.games.map((game) => renderComposite("game-catalog-card", {}, () => <GameCatalogCard props={{ ...game, actionLabel: input.props.actionLabel }} on={{ pick: () => input.on?.pick?.(game.id) }} />)) }),
})} />
/** Declares the catalog renderer as a pure game block. */
