import type { GraphQLResponse } from "../../types"

/** Public collection metadata returned by the exam catalogue. */
export type ExamProgram = {
    readonly id: string
    readonly slug: string
    readonly sortIndex: number
    readonly bankCount: number
    readonly nameVi?: string | null
    readonly nameEn?: string | null
    readonly descriptionVi?: string | null
    readonly descriptionEn?: string | null
}

/** Public paper facts used by catalogue cards. */
export type PaperSummary = {
    readonly id: string
    readonly slug: string
    readonly kind: string
    readonly level: string
    readonly durationMinutes: number | null
    readonly questionCount: number
    readonly titleVi?: string | null
    readonly titleEn?: string | null
    readonly descriptionVi?: string | null
    readonly descriptionEn?: string | null
    readonly isDemo: boolean
    readonly isLocked: boolean
    readonly programSlug?: string | null
}

/** Reading passage attached to one or more questions. */
export type PaperPassage = { readonly slug: string; readonly title?: string | null; readonly body: string }
/** Answerable question without any answer key. */
export type PaperQuestion = {
    readonly questionId: string
    readonly position: number
    readonly marks: number
    readonly slug: string
    readonly stem: string
    readonly skill: string
    readonly optionA: string
    readonly optionB: string
    readonly optionC: string
    readonly optionD: string
    readonly passage?: PaperPassage | null
}
/** Authenticated paper payload used by the runner. */
export type PaperDetail = Omit<PaperSummary, "questionCount" | "isDemo" | "isLocked" | "programSlug"> & { readonly questions: ReadonlyArray<PaperQuestion> }

/** GraphQL envelope for exam programs. */
export type QueryExamProgramsResponse = { readonly examPrograms: GraphQLResponse<ReadonlyArray<ExamProgram>> }
/** GraphQL envelope for public paper summaries. */
export type QueryPapersResponse = { readonly papers: GraphQLResponse<ReadonlyArray<PaperSummary>> }
/** GraphQL envelope for authenticated paper detail. */
export type QueryPaperDetailResponse = { readonly paperDetail: GraphQLResponse<PaperDetail> }
