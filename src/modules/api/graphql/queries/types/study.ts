import type { GraphQLResponse } from "../../types"

/** Public topic summary used by the Study catalogue. */
export type LearnTopic = {
    readonly id: string
    readonly slug: string
    readonly level: string
    readonly phraseCount: number
    readonly nameVi: string
    readonly nameEn: string
    readonly blurbVi: string
    readonly blurbEn: string
}

/** One phrase in a topic detail response. */
export type StudyPhrase = {
    readonly id: string
    readonly text: string
    readonly example?: string | null
    readonly audioKey?: string | null
    readonly level: string
    readonly meaningVi: string
    readonly meaningEn: string
    readonly contextNoteVi: string
    readonly contextNoteEn: string
}

/** Public topic detail with its ordered phrases. */
export type StudyTopicDetail = Omit<LearnTopic, "phraseCount" | "blurbVi" | "blurbEn"> & { readonly phrases: ReadonlyArray<StudyPhrase> }

/** One answer option in phrase recall practice. */
export type PhrasePracticeOption = { readonly phraseId: string; readonly text: string }
/** One prompt in phrase recall practice. */
export type PhrasePracticeItem = { readonly promptPhraseId: string; readonly meaningVi: string; readonly options: ReadonlyArray<PhrasePracticeOption> }

/** Authenticated resume pointers owned by the backend. */
export type ContinueLearning = {
    readonly topic?: { readonly id: string; readonly slug: string } | null
    readonly paper?: { readonly id: string; readonly slug: string } | null
    readonly reviewPhrase?: { readonly id: string; readonly text: string } | null
}

/** GraphQL envelope for the public topic catalogue. */
export type QueryLearnTopicsResponse = { readonly learnTopics: GraphQLResponse<ReadonlyArray<LearnTopic>> }
/** GraphQL envelope for one public topic detail. */
export type QueryTopicDetailResponse = { readonly topicDetail: GraphQLResponse<StudyTopicDetail> }
/** GraphQL envelope for one public phrase-practice set. */
export type QueryPhrasePracticeResponse = { readonly phrasePractice: GraphQLResponse<ReadonlyArray<PhrasePracticeItem>> }
/** GraphQL envelope for private resume pointers. */
export type QueryContinueLearningResponse = { readonly continueLearning: GraphQLResponse<ContinueLearning> }
