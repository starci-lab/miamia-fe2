import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { GraphQLResponse } from "../types"
import type { FlashcardQuizAnswer, FlashcardReviewKind } from "../queries/query-my-in-progress-flashcard-session"

/** Progress snapshot shared by deck and due-review session stores. */
export type SyncFlashcardReviewSessionRequest = {
    readonly mode: "review"
    readonly kind: FlashcardReviewKind
    readonly sessionId: string
    readonly currentIndex: number
    readonly reviewedCount: number
    readonly gradedIndexes: ReadonlyArray<number>
    readonly xpEarned: number
}

/** Progress snapshot for one resumable quick quiz. */
export type SyncFlashcardQuizSessionRequest = {
    readonly mode: "quiz"
    readonly sessionId: string
    readonly currentIndex: number
    readonly results: ReadonlyArray<FlashcardQuizAnswer>
}

/** Backend-proven progress snapshots supported by the live page. */
export type SyncFlashcardSessionRequest = SyncFlashcardReviewSessionRequest | SyncFlashcardQuizSessionRequest

/** SM-2 grade request attributed to one persisted review session. */
export type RateFlashcardRequest = {
    readonly cardId: string
    readonly sessionId: string
    readonly grade: 0 | 1 | 2 | 3
}

/** Scheduling and XP outcome returned by one SM-2 grade. */
export type RateFlashcardData = { readonly dueAt: string; readonly xpEarned: number }

type SyncReviewLikeVariables = {
    readonly request: {
        readonly sessionId: string
        readonly currentIndex: number
        readonly reviewedCount: number
        readonly gradedIndexes: ReadonlyArray<number>
        readonly xpEarned: number
    }
}

type SyncQuizVariables = {
    readonly request: {
        readonly sessionId: string
        readonly currentIndex: number
        readonly results: ReadonlyArray<FlashcardQuizAnswer>
    }
}

type RateFlashcardVariables = { readonly request: RateFlashcardRequest }

const syncReviewDocument: TypedDocumentNode<
    { readonly syncFlashcardReviewSessionProgress: GraphQLResponse<{ readonly success: boolean }> },
    SyncReviewLikeVariables
> = gql`
    mutation SyncFlashcardReviewSessionProgress($request: SyncFlashcardReviewSessionProgressRequest!) {
        syncFlashcardReviewSessionProgress(request: $request) {
            success message error
            data { success }
        }
    }
`

const syncDueDocument: TypedDocumentNode<
    { readonly syncFlashcardDueReviewSessionProgress: GraphQLResponse<{ readonly success: boolean }> },
    SyncReviewLikeVariables
> = gql`
    mutation SyncFlashcardDueReviewSessionProgress($request: SyncFlashcardDueReviewSessionProgressRequest!) {
        syncFlashcardDueReviewSessionProgress(request: $request) {
            success message error
            data { success }
        }
    }
`

const syncQuizDocument: TypedDocumentNode<
    { readonly syncFlashcardQuizSessionProgress: GraphQLResponse<{ readonly success: boolean }> },
    SyncQuizVariables
> = gql`
    mutation SyncFlashcardQuizSessionProgress($request: SyncFlashcardQuizSessionProgressRequest!) {
        syncFlashcardQuizSessionProgress(request: $request) {
            success message error
            data { success }
        }
    }
`

const rateDocument: TypedDocumentNode<
    { readonly reviewFlashcard: GraphQLResponse<RateFlashcardData> },
    RateFlashcardVariables
> = gql`
    mutation ReviewFlashcard($request: ReviewFlashcardRequest!) {
        reviewFlashcard(request: $request) {
            success message error
            data { dueAt xpEarned }
        }
    }
`

/** Dispatches a resumable progress snapshot to its exact backend session family. */
export const mutationSyncFlashcardSession = async (request: SyncFlashcardSessionRequest): Promise<boolean> => {
    const apollo = createApolloClient({ withAuth: true })
    if (request.mode === "review") {
        const variables = {
            request: {
                sessionId: request.sessionId,
                currentIndex: request.currentIndex,
                reviewedCount: request.reviewedCount,
                gradedIndexes: request.gradedIndexes,
                xpEarned: request.xpEarned,
            },
        }
        if (request.kind === "due") {
            const response = await apollo.mutate({ mutation: syncDueDocument, variables })
            return response.data?.syncFlashcardDueReviewSessionProgress.data?.success === true
        }
        const response = await apollo.mutate({ mutation: syncReviewDocument, variables })
        return response.data?.syncFlashcardReviewSessionProgress.data?.success === true
    }
    const response = await apollo.mutate({
        mutation: syncQuizDocument,
        variables: {
            request: {
                sessionId: request.sessionId,
                currentIndex: request.currentIndex,
                results: request.results,
            },
        },
    })
    return response.data?.syncFlashcardQuizSessionProgress.data?.success === true
}

/** Grades one review card and returns its backend-computed scheduling outcome. */
export const mutationRateFlashcard = async (request: RateFlashcardRequest): Promise<RateFlashcardData | null> => {
    const apollo = createApolloClient({ withAuth: true })
    const response = await apollo.mutate({ mutation: rateDocument, variables: { request } })
    return response.data?.reviewFlashcard.data ?? null
}
