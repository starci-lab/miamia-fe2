import { Tree } from "@/components/branches/Tree"; import { GameCatalogCard } from "@/components/composites/GameCatalogCard"; import { Heading } from "@/components/leaves/Heading"; import { defineCompositeComponent, defineContractComponent, defineLeafComponent, type BlockProps } from "@/components/contracts/props"; import type { GameDefinition } from "@/modules/games/catalog"; import type { GameId } from "@/modules/games/types"
type GameCatalogData = { readonly title: string; readonly games: ReadonlyArray<GameDefinition>; readonly actionLabel: string }
type GameCatalogActions = { readonly pick?: (game: GameId) => void }
type GameCatalogProps = BlockProps<"ready", GameCatalogData> & { readonly on?: GameCatalogActions }
/** Render the fixed four-game catalog below its section heading. */
export const _GameCatalog = (input: GameCatalogProps) => <Tree contract="game-catalog-section" render={defineContractComponent("game-catalog-section", {
    header: defineContractComponent("page-header-stack", { title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />) }),
    games: defineContractComponent("game-grid", { game: input.props.games.map((game) => defineCompositeComponent("game-catalog-card", {}, () => <GameCatalogCard props={{ ...game, actionLabel: input.props.actionLabel }} on={{ pick: () => input.on?.pick?.(game.id) }} />)) }),
})} />
/** Declares the catalog renderer as a pure game block. */
export const meta = { shape: "block", world: "pure", domain: "games" } as const
