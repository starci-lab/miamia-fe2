"use client"
import { useCallback, useEffect, useState } from "react"; import { GameCatalog } from "@/components/blocks/games/GameCatalog"; import { GameFriendStanding } from "@/components/blocks/games/GameFriendStanding"; import { GameRunner } from "@/components/blocks/games/GameRunner"; import { GameSetupOverlay } from "@/components/overlays/games/GameSetupOverlay"; import { SignInOverlay } from "@/components/overlays/auth/SignInOverlay"; import { useSessionToken } from "@/hooks/auth/useSessionToken"; import type { GameId, GameLaunchConfig } from "@/modules/games/types"; import { GameHubPageBase as GameHubPageView } from "./component"
/** Orchestrate selection, sign-in continuation, setup and active game state. */
export const GameHubPage = () => {
    const token = useSessionToken(); const [selected, setSelected] = useState<GameId>(); const [active, setActive] = useState<GameLaunchConfig>(); const [pending, setPending] = useState<GameLaunchConfig>(); const [signIn, setSignIn] = useState(false)
    useEffect(() => { if (token !== undefined && pending !== undefined) { setActive(pending); setPending(undefined) } }, [pending, token])
    const chooseCatalog = useCallback(() => document.querySelector(".layout-name-game-catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), [])
    const Standing = useCallback(() => <GameFriendStanding onChooseGame={chooseCatalog} onRequireSignIn={() => setSignIn(true)} />, [chooseCatalog])
    const Catalog = useCallback(() => <GameCatalog onPickGame={setSelected} />, [])
    const Runner = useCallback(() => active === undefined || token === undefined ? null : <GameRunner config={active} token={token} onExit={() => setActive(undefined)} />, [active, token])
    const resolve = (config: GameLaunchConfig) => { setSelected(undefined); if (token === undefined) { setPending(config); setSignIn(true) } else setActive(config) }
    return <><GameHubPageView standingSurface={Standing} catalogSurface={Catalog} runnerSurface={active === undefined ? undefined : Runner} /><GameSetupOverlay game={selected} isOpen={selected !== undefined} onResolved={resolve} onCancelled={() => setSelected(undefined)} /><SignInOverlay isOpen={signIn} onDismiss={() => setSignIn(false)} /></>
}
/** Declares the game hub orchestrator as a connected page. */
