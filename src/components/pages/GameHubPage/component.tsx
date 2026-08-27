import type { ComponentType } from "react"; import { Grammar } from "@/components/branches/Grammar"; import { createGrammarNode, createGrammarProjection } from "@/components/contracts/props"
/** Pure page slots for discovery and the in-place active runner. */
export type GameHubPageProps = { readonly standingSurface: ComponentType; readonly catalogSurface: ComponentType; readonly runnerSurface?: ComponentType }
/** Keep rivalry before catalog, or replace both with the active runner in place. */
export const GameHubPageBase = ({ standingSurface: Standing, catalogSurface: Catalog, runnerSurface: Runner }: GameHubPageProps) => {
    if (Runner !== undefined) { return <Grammar contract="game-active-session-page" render={createGrammarNode("game-active-session-page", { runner: createGrammarProjection("game-runner-stack", () => <Runner />) })} /> }
    return <Grammar contract="game-hub-page" render={createGrammarNode("game-hub-page", { standing: createGrammarProjection("standing-hero-card", () => <Standing />), catalog: createGrammarProjection("game-catalog-section", () => <Catalog />) })} />
}
/** Declares the game hub arrangement as a pure page. */
export const meta = { shape: "page", world: "pure", domain: "games" } as const
