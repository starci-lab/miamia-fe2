/** Server room name exposed to the Colyseus client. */
export type GameId = "vocab_race" | "match_pairs" | "couple_quiz" | "vocab_defense"
/** Server snapshot discriminator shared by all four game states. */
export type GameType = "VOCAB_RACE" | "MATCH_PAIRS" | "COUPLE_QUIZ" | "VOCAB_DEFENSE"
/** Supported server-authoritative match arrangements. */
export type GameMode = "SINGLE" | "COUPLE" | "TEAM2V2"
/** Games currently eligible for team matchmaking. */
export type TeamGameId = "match_pairs" | "vocab_defense"
/** Playable MiaMia mascot identity. */
export type GameCharacter = "MIA" | "MAX"

/** Complete immutable launch decision passed from setup to the runner. */
export type GameLaunchConfig =
    | { readonly game: GameId; readonly mode: "SINGLE" | "COUPLE"; readonly character: GameCharacter; readonly roomCode?: string }
    | { readonly game: TeamGameId; readonly mode: "TEAM2V2"; readonly character: GameCharacter }

/** Public state of one player in a room snapshot. */
export type GamePlayerSnapshot = {
    readonly id: string; readonly name: string; readonly character: GameCharacter; readonly team: string
    readonly score: number; readonly combo: number; readonly hp: number; readonly progress: number
    readonly action: string; readonly bot: boolean
}

/** Server-authoritative room state broadcast to every connected player. */
export type GameSnapshot = {
    readonly phase: "WAITING" | "PLAYING" | "FINISHED"; readonly gameType: GameType; readonly mode: GameMode
    readonly remainingMs: number; readonly round: number; readonly question: string; readonly options: ReadonlyArray<string>
    readonly players: ReadonlyArray<GamePlayerSnapshot>; readonly winner: string; readonly roomCode: string
    readonly cards?: ReadonlyArray<{ readonly id: string; readonly text: string; readonly claimedBy?: string }>
    readonly teamAHp?: number; readonly teamBHp?: number
}

/** Immediate answer feedback used only for canvas reactions. */
export type GameAnswerResult = { readonly correct: boolean; readonly character: GameCharacter }
/** Stable error categories exposed by the game transport. */
export type GameTransportErrorKind = "auth" | "membership" | "room-not-found" | "network" | "invalid-intent" | "unknown"
/** Classified transport failure safe for product-state branching. */
export type GameTransportError = { readonly kind: GameTransportErrorKind; readonly message: string }

/** Convert a room name into its snapshot discriminator. */
export const gameTypeFromId = (game: GameId): GameType => game.toUpperCase() as GameType
/** Narrow a game to the current team-matchmaking pair. */
export const isTeamGameId = (value: GameId): value is TeamGameId => value === "match_pairs" || value === "vocab_defense"
