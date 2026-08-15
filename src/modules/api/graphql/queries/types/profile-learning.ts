import type { GraphQLResponse } from "../../types"

/** Authenticated learning totals for the current learner. */
export type ProgressSummary = {
    readonly currentStreak: number
    readonly studyDays: number
    readonly phrasesKnown: number
    readonly totalPhrases: number
    readonly attemptsCount: number
    readonly bestPercent?: number | null
    readonly xp: number
    readonly level: number
    readonly xpIntoLevel: number
    readonly xpForNextLevel: number
}

/** Period accepted by the Wrapped contract. */
export type WrappedPeriod = "weekly" | "monthly" | "yearly"
/** One optional hardest phrase in a Wrapped result. */
export type WrappedPhrase = { readonly id: string; readonly text: string }
/** Unlocked Wrapped facts for the current learner. */
export type WrappedStats = {
    readonly studyDays: number
    readonly phrasesLearned: number
    readonly papersCompleted: number
    readonly longestStreak: number
    readonly xpEarned: number
    readonly hardestPhrase?: WrappedPhrase | null
    readonly friendRank?: number | null
    readonly topicsCompleted: number
    readonly gamesWon: number
}
/** Lock state and optional statistics for one period. */
export type WrappedSummary = { readonly isUnlocked: boolean; readonly daysUntilUnlock?: number | null; readonly stats?: WrappedStats | null }
/** GraphQL envelope returned by progressSummary. */
export type QueryProgressSummaryResponse = { readonly progressSummary: GraphQLResponse<ProgressSummary> }
/** GraphQL envelope returned by wrapped. */
export type QueryWrappedResponse = { readonly wrapped: GraphQLResponse<WrappedSummary> }
