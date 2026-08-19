"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GameClient, type GameConnection } from "@/modules/games/colyseus/client"
import type { GameAnswerResult, GameLaunchConfig, GameSnapshot, GameTransportError } from "@/modules/games/types"

/** Product-facing connection states for an active game. */
export type GameSessionState = "connecting" | "waiting" | "playing" | "finished" | "failed" | "disconnected"

/** Map a server-reported room phase onto the product-facing session state. */
const phaseToState = (phase: GameSnapshot["phase"]): "waiting" | "playing" | "finished" => {
    if (phase === "WAITING") return "waiting"
    if (phase === "PLAYING") return "playing"
    return "finished"
}

/** Own one Colyseus connection and expose server snapshots as React state. */
export const useGameSession = (config: GameLaunchConfig, token: string) => {
    const [state, setState] = useState<GameSessionState>("connecting")
    const [snapshot, setSnapshot] = useState<GameSnapshot>(); const [answerResult, setAnswerResult] = useState<GameAnswerResult>()
    const [error, setError] = useState<GameTransportError>(); const connection = useRef<GameConnection | undefined>(undefined); const pending = useRef<Promise<GameConnection> | undefined>(undefined)
    const connectionKey = useRef<string | undefined>(undefined); const owner = useRef(0); const listeners = useRef<Array<() => void>>([]); const [attempt, setAttempt] = useState(0)
    const { game, mode, character } = config; const roomCode = "roomCode" in config ? config.roomCode : undefined

    useEffect(() => {
        const run = owner.current + 1; owner.current = run
        setState("connecting"); setError(undefined)
        const launch = roomCode === undefined ? { game, mode, character } : { game, mode, character, roomCode }
        const key = `${game}:${mode}:${character}:${roomCode ?? "create"}:${token}:${attempt}`
        if (connectionKey.current !== key) {
            const abandoned = pending.current
            listeners.current.splice(0).forEach((stop) => stop())
            connection.current = undefined; pending.current = new GameClient().connect(launch as GameLaunchConfig, token); connectionKey.current = key
            if (abandoned !== undefined) void abandoned.then((joined) => joined.leave())
        }
        const joining = pending.current
        void joining?.then((joined) => {
            if (owner.current !== run) return
            connection.current = joined
            listeners.current = [
                joined.onSnapshot((next) => { setSnapshot(next); setState(phaseToState(next.phase)) }),
                joined.onAnswerResult(setAnswerResult), joined.onError((next) => { setError(next); setState("failed") }),
                joined.onLeave(() => { if (owner.current === run) setState("disconnected") }),
            ]
        }).catch((cause: unknown) => { if (owner.current === run) { setError(GameClient.classifyError(cause)); setState("failed") } })
        return () => { setTimeout(() => {
            if (owner.current !== run) return
            listeners.current.splice(0).forEach((stop) => stop()); connection.current = undefined; pending.current = undefined; connectionKey.current = undefined
            void joining?.then((joined) => joined.leave())
        }, 0) }
    }, [attempt, character, game, mode, roomCode, token])

    return { state, snapshot, answerResult, error,
        answer: useCallback((index: number) => connection.current?.answer(index), []), restart: useCallback(() => connection.current?.restart(), []),
        retry: useCallback(() => setAttempt((value) => value + 1), []), leave: useCallback(async () => { await connection.current?.leave() }, []) }
}
