import type { ComponentType } from "react"; import { Grammar } from "@/components/layouts/Grammar"; import { layoutNode, layoutContent } from "@/modules/types/layout"
/** Pure page slots for discovery and the in-place active runner. */
export type GameHubPageProps = { readonly standingSurface: ComponentType; readonly catalogSurface: ComponentType; readonly runnerSurface?: ComponentType }
/** Keep rivalry before catalog, or replace both with the active runner in place. */
export const GameHubPageBase = ({ standingSurface: Standing, catalogSurface: Catalog, runnerSurface: Runner }: GameHubPageProps) => {
    if (Runner !== undefined) { return <Grammar layout="game-active-session-page" render={layoutNode("game-active-session-page", { runner: layoutContent("game-runner-stack", () => <Runner />) })} /> }
    return <Grammar layout="game-hub-page" render={layoutNode("game-hub-page", { standing: layoutContent("standing-hero-card", () => <Standing />), catalog: layoutContent("game-catalog-section", () => <Catalog />) })} />
}
/** Declares the game hub arrangement as a pure page. */
