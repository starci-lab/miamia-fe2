import { Grammar } from "@/components/branches/Grammar"; import { GameCatalogCard } from "@/components/composites/GameCatalogCard"; import { Heading } from "@/components/leaves/Heading"; import { createCompositeNode, createGrammarNode, createLeafNode, type BlockProps } from "@/components/contracts/props"; import type { GameDefinition } from "@/modules/games/catalog"; import type { GameId } from "@/modules/games/types"
type GameCatalogData = { readonly title: string; readonly games: ReadonlyArray<GameDefinition>; readonly actionLabel: string }
type GameCatalogActions = { readonly pick?: (game: GameId) => void }
type GameCatalogProps = BlockProps<"ready", GameCatalogData> & { readonly on?: GameCatalogActions }
/** Render the fixed four-game catalog below its section heading. */
export const GameCatalogBase = (input: GameCatalogProps) => <Grammar contract="game-catalog-section" render={createGrammarNode("game-catalog-section", {
    header: createGrammarNode("page-header-stack", { title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />) }),
    games: createGrammarNode("game-grid", { game: input.props.games.map((game) => createCompositeNode("game-catalog-card", {}, () => <GameCatalogCard props={{ ...game, actionLabel: input.props.actionLabel }} on={{ pick: () => input.on?.pick?.(game.id) }} />)) }),
})} />
/** Declares the catalog renderer as a pure game block. */
export const meta = { shape: "block", world: "pure", domain: "games" } as const
