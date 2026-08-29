"use client"

import { useEffect, useState } from "react"
import { GAME_CATALOG } from "@/modules/games/catalog"; import { isTeamGameId, type GameCharacter, type GameId, type GameLaunchConfig, type GameMode } from "@/modules/games/types"
import { GameSetupOverlayBase as GameSetupOverlayView, type GameSetupState } from "./component"

/** Controlled game choice and resolved launch callback owned by the page. */
export type GameSetupOverlayConnectedProps = { readonly game?: GameId; readonly isOpen: boolean; readonly onResolved: (config: GameLaunchConfig) => void; readonly onCancelled: () => void }
// vn-ok: Connected setup titles are localized Vietnamese runtime copy.
const SETUP_TITLE_BY_STATE: Record<GameSetupState, string> = {
    mode: "Thiết lập ván", // vn-ok: localized runtime copy
    room: "Chơi cùng bạn", // vn-ok: localized runtime copy
    character: "Chọn nhân vật", // vn-ok: localized runtime copy
}

/** Own the finite setup state and emit one complete launch configuration. */
export const GameSetupOverlay = ({ game, isOpen, onResolved, onCancelled }: GameSetupOverlayConnectedProps) => {
    const [state, setState] = useState<GameSetupState>("mode"); const [mode, setMode] = useState<GameMode>(); const [roomCode, setRoomCode] = useState<string>(); const [typedCode, setTypedCode] = useState("")
    useEffect(() => { if (isOpen) { setState("mode"); setMode(undefined); setRoomCode(undefined); setTypedCode("") } }, [isOpen])
    if (game === undefined) return null
    const chooseMode = (next: GameMode) => { setMode(next); setState(next === "COUPLE" ? "room" : "character") }
    const chooseCharacter = (character: GameCharacter) => {
        if (mode === undefined) return
        if (mode === "TEAM2V2" && isTeamGameId(game)) onResolved({ game, mode, character })
        else if (mode !== "TEAM2V2") onResolved(roomCode === undefined ? { game, mode, character } : { game, mode, character, roomCode })
    }
    return <GameSetupOverlayView isOpen={isOpen} state={state} props={{ title: SETUP_TITLE_BY_STATE[state], gameTitle: GAME_CATALOG.find((item) => item.id === game)?.title ?? game, supportsTeam: isTeamGameId(game), roomCode: typedCode, pendingMode: mode }} on={{
        back: () => setState(state === "character" && mode === "COUPLE" ? "room" : "mode"), chooseMode,
        createRoom: () => { setRoomCode(undefined); setState("character") }, changeCode: setTypedCode,
        joinRoom: () => { const code = typedCode.trim(); if (code.length > 0) { setRoomCode(code); setState("character") } }, chooseCharacter,
    }} onDismiss={onCancelled} />
}
/** Declares the setup state machine as a connected game overlay. */
