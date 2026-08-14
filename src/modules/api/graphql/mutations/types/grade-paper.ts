import type { GraphQLResponse } from "../../types"

/** Answers submitted for one paper attempt. */
export type GradePaperRequest = { readonly paperSlug: string; readonly answers: ReadonlyArray<{ readonly questionId: string; readonly selected: string | null; readonly secondsSpent: number | null }> }
/** Server-graded evidence for one answer. */
export type GradedAnswer = { readonly questionId: string; readonly slug: string; readonly stem: string; readonly selected?: string | null; readonly correct: string; readonly isCorrect: boolean; readonly explanationVi?: string | null; readonly explanationEn?: string | null }
/** Result of the current submitted attempt. */
export type GradePaperData = { readonly attemptId: string; readonly score: number; readonly maxScore: number; readonly answers: ReadonlyArray<GradedAnswer> }
/** GraphQL envelope for grading one paper. */
export type MutationGradePaperResponse = { readonly gradePaper: GraphQLResponse<GradePaperData> }
