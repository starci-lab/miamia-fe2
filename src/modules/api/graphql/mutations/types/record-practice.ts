import type { GraphQLResponse } from "../../types"

/** One locally graded phrase sent to the mastery writer. */
export type RecordPracticeResultInput = { readonly phraseId: string; readonly correct: boolean }
/** Topic-linked practice batch. */
export type RecordPracticeRequest = { readonly topicSlug: string; readonly results: ReadonlyArray<RecordPracticeResultInput> }
/** Verified counters returned after one practice submission. */
export type RecordPracticeData = { readonly phrasesStudied: number; readonly phrasesKnown: number }
/** GraphQL envelope for one recorded practice sitting. */
export type MutationRecordPracticeResponse = { readonly recordPractice: GraphQLResponse<RecordPracticeData> }
