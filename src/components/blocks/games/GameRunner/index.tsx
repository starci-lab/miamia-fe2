"use client"
import { useGameSession } from "@/hooks/games/useGameSession"; import { gameTypeFromId, type GameLaunchConfig } from "@/modules/games/types"; import { _GameRunner } from "./component"
/** Immutable launch configuration, session token and exit action for the runner. */
export type GameRunnerConnectedProps = { readonly config: GameLaunchConfig; readonly token: string; readonly onExit: () => void }
/** Connect one approved launch configuration to the separate Colyseus server. */
export const GameRunner = ({ config, token, onExit }: GameRunnerConnectedProps) => {
    const session = useGameSession(config, token)
    const exit = () => { void session.leave().finally(onExit) }
    return <_GameRunner state={session.state} props={{ gameType: gameTypeFromId(config.game), character: config.character, snapshot: session.snapshot, answerResult: session.answerResult, errorMessage: session.error?.message }} on={{ copyCode: () => { const code = session.snapshot?.roomCode; if (code !== undefined && code.length > 0) void navigator.clipboard.writeText(code) }, restart: session.restart, retry: session.retry, exit, answer: session.answer }} />
}
/** Declares the Colyseus binder as a connected game block. */
export const meta = { shape: "block", world: "connected", domain: "games" } as const
