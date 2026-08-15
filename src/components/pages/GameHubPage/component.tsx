import type { ComponentType } from "react"; import { Tree } from "@/components/branches/Tree"; import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"
/** Pure page slots for discovery and the in-place active runner. */
export type GameHubPageProps = { readonly standingSurface: ComponentType; readonly catalogSurface: ComponentType; readonly runnerSurface?: ComponentType }
/** Keep rivalry before catalog, or replace both with the active runner in place. */
export const _GameHubPage = ({ standingSurface, catalogSurface, runnerSurface }: GameHubPageProps) => {
    if (runnerSurface !== undefined) { const Runner = runnerSurface; return <Tree contract="game-active-session-page" render={defineContractComponent("game-active-session-page", { runner: defineContractProjection("game-runner-stack", () => <Runner />) })} /> }
    const Standing = standingSurface; const Catalog = catalogSurface
    return <Tree contract="game-hub-page" render={defineContractComponent("game-hub-page", { standing: defineContractProjection("standing-hero-card", () => <Standing />), catalog: defineContractProjection("game-catalog-section", () => <Catalog />) })} />
}
/** Declares the game hub arrangement as a pure page. */
export const meta = { shape: "page", world: "pure", domain: "games" } as const
