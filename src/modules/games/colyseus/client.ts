import { Client, type Room, type SeatReservation } from "colyseus.js"
import { getColyseusUrl } from "../env"
import type { GameAnswerResult, GameLaunchConfig, GameSnapshot, GameTransportError } from "../types"

type Listener<T> = (value: T) => void
/** Transport-neutral controls and subscriptions for one joined room. */
export type GameConnection = {
    readonly roomId: string; readonly onSnapshot: (listener: Listener<GameSnapshot>) => () => void
    readonly onAnswerResult: (listener: Listener<GameAnswerResult>) => () => void
    readonly onError: (listener: Listener<GameTransportError>) => () => void; readonly onLeave: (listener: () => void) => () => void
    readonly answer: (index: number) => void; readonly restart: () => void; readonly leave: () => Promise<void>
}

const classifyError = (error: unknown): GameTransportError => {
    const message = error instanceof Error ? error.message : String(error)
    const lower = message.toLowerCase()
    const kind = lower.includes("membership") || lower.includes("entitlement") ? "membership"
        : lower.includes("token") || lower.includes("auth") ? "auth"
            : lower.includes("room") && (lower.includes("not") || lower.includes("404")) ? "room-not-found"
                : lower.includes("network") || lower.includes("websocket") || lower.includes("connect") ? "network" : "unknown"
    return { kind, message }
}

const wrapRoom = (room: Room): GameConnection => {
    let leavePromise: Promise<void> | undefined
    return {
        roomId: room.roomId,
        onSnapshot: (listener) => room.onMessage<GameSnapshot>("snapshot", listener),
        onAnswerResult: (listener) => room.onMessage<GameAnswerResult>("answer_result", listener),
        onError: (listener) => { const callback = (_code: number, message?: string) => listener(classifyError(message ?? "Colyseus error")); room.onError(callback); return () => room.onError.remove(callback) },
        onLeave: (listener) => { room.onLeave(listener); return () => room.onLeave.remove(listener) }, answer: (index) => room.send("answer", { index }),
        restart: () => room.send("restart"), leave: () => { const pending = leavePromise ?? room.leave(true).then(() => undefined); leavePromise = pending; return pending },
    }
}

export class GameClient {
    private readonly client: Client
    constructor(endpoint = getColyseusUrl()) { this.client = new Client(endpoint) }

    async connect(config: GameLaunchConfig, token: string): Promise<GameConnection> {
        const options = { token, mode: config.mode, character: config.character }
        if (config.mode === "TEAM2V2") return this.matchmake(config.game, { token, mode: "TEAM2V2", character: config.character })
        if (config.roomCode !== undefined) return wrapRoom(await this.client.joinById(config.roomCode, { ...options, roomCode: config.roomCode }))
        return wrapRoom(await this.client.create(config.game, options))
    }

    private async matchmake(game: "match_pairs" | "vocab_defense", options: TeamMatchOptions): Promise<GameConnection> {
        const lobby = await this.client.joinOrCreate("team_matchmaking", { ...options, game })
        try {
            const reservation = await new Promise<SeatReservation>((resolve, reject) => {
                const offMessage = lobby.onMessage<{ reservation: SeatReservation }>("matched", (message) => { offMessage(); resolve(message.reservation) })
                lobby.onError((_code, message) => reject(new Error(message ?? "Matchmaking failed")))
            })
            return wrapRoom(await this.client.consumeSeatReservation(reservation))
        } finally { await lobby.leave(true) }
    }

    static classifyError = classifyError
}

type TeamMatchOptions = { readonly token: string; readonly mode: "TEAM2V2"; readonly character: "MIA" | "MAX" }
