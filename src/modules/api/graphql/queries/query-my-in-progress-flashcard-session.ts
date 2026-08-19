import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { GraphQLResponse } from "../types"

/** Route-level flashcard modes shared by the overview, session, and result owners. */
export type FlashcardSessionMode = "review" | "quiz"

/** Backend review storage family selected by a review session. */
export type FlashcardReviewKind = "deck" | "due"

/** One hydrated card in a persisted flashcard session. */
export type FlashcardSessionCard = {
    readonly cardId: string
    readonly deckTitle: string
    readonly front: string
    readonly back: string
    readonly level?: string | null
    readonly tags: ReadonlyArray<string>
    readonly nextIntervals?: {
        readonly again: number
        readonly hard: number
        readonly good: number
        readonly easy: number
    }
}

/** Persisted objective outcome for one quiz card. */
export type FlashcardQuizAnswer = {
    readonly cardId: string
    readonly correctBlanks: number
    readonly totalBlanks: number
}

/** Hydrated resumable session consumed by the canonical live page. */
export type FlashcardSession = {
    readonly sessionId: string
    readonly mode: FlashcardSessionMode
    readonly kind?: FlashcardReviewKind
    readonly status: "in_progress"
    readonly cardIds: ReadonlyArray<string>
    readonly cards: ReadonlyArray<FlashcardSessionCard>
    readonly currentIndex: number
    readonly reviewedCount: number
    readonly gradedIndexes: ReadonlyArray<number>
    readonly results: ReadonlyArray<FlashcardQuizAnswer>
    readonly xpEarned: number
    readonly updatedAt?: string
    readonly deadlineAt?: string | null
    readonly name?: string | null
}

/** Lookup parameters for a review session, including deck and due-review families. */
export type QueryFlashcardReviewSessionRequest = {
    readonly mode: "review"
    readonly courseId?: string
    readonly deckId?: string
    readonly deckIds?: ReadonlyArray<string>
    readonly sessionId?: string
    readonly reviewKind?: FlashcardReviewKind
}

/** Lookup parameters for a course-scoped quiz session. */
export type QueryFlashcardQuizSessionRequest = {
    readonly mode: "quiz"
    readonly courseId: string
    readonly sessionId?: string
}

/** Supported lookup parameters for one resumable flashcard session. */
export type QueryFlashcardSessionRequest = QueryFlashcardReviewSessionRequest | QueryFlashcardQuizSessionRequest

type ReviewSessionData = {
    readonly sessionId: string
    readonly kind?: FlashcardReviewKind
    readonly deckId?: string | null
    readonly deckTitle?: string | null
    readonly cardIds: ReadonlyArray<string>
    readonly currentIndex: number
    readonly reviewedCount: number
    readonly gradedIndexes: ReadonlyArray<number>
    readonly xpEarned: number
    readonly updatedAt?: string
}

type QuizSessionData = {
    readonly sessionId: string
    readonly cardIds: ReadonlyArray<string>
    readonly currentIndex: number
    readonly results: ReadonlyArray<FlashcardQuizAnswer>
    readonly updatedAt?: string
    readonly deadlineAt?: string | null
    readonly name?: string | null
}

type CardsResponse = {
    readonly flashcardCardsByIds: GraphQLResponse<{ readonly cards: Array<FlashcardSessionCard> }>
}

type ReviewBySessionResponse = {
    readonly myFlashcardReviewSessionBySessionId: GraphQLResponse<ReviewSessionData>
}

type ReviewByDeckResponse = {
    readonly myInProgressFlashcardReviewSession: GraphQLResponse<ReviewSessionData>
}

type DueByCourseResponse = {
    readonly myInProgressFlashcardDueReviewSession: GraphQLResponse<ReviewSessionData>
}

type QuizByCourseResponse = {
    readonly myInProgressFlashcardQuizSession: GraphQLResponse<QuizSessionData>
}

const reviewBySessionQuery: TypedDocumentNode<ReviewBySessionResponse, { sessionId: string }> = gql`
    query MyFlashcardReviewSessionBySessionId($sessionId: ID!) {
        myFlashcardReviewSessionBySessionId(sessionId: $sessionId) {
            success message error
            data {
                sessionId kind deckId deckTitle cardIds currentIndex reviewedCount
                gradedIndexes xpEarned updatedAt
            }
        }
    }
`

const reviewByDeckQuery: TypedDocumentNode<ReviewByDeckResponse, { deckId: string }> = gql`
    query MyInProgressFlashcardReviewSession($deckId: ID!) {
        myInProgressFlashcardReviewSession(deckId: $deckId) {
            success message error
            data { sessionId cardIds currentIndex reviewedCount gradedIndexes xpEarned updatedAt }
        }
    }
`

const dueByCourseQuery: TypedDocumentNode<DueByCourseResponse, { courseId: string }> = gql`
    query MyInProgressFlashcardDueReviewSession($courseId: ID!) {
        myInProgressFlashcardDueReviewSession(courseId: $courseId) {
            success message error
            data { sessionId cardIds currentIndex reviewedCount gradedIndexes xpEarned updatedAt }
        }
    }
`

const quizByCourseQuery: TypedDocumentNode<QuizByCourseResponse, { courseId: string }> = gql`
    query MyInProgressFlashcardQuizSession($courseId: ID!) {
        myInProgressFlashcardQuizSession(courseId: $courseId) {
            success message error
            data { sessionId cardIds currentIndex results { cardId correctBlanks totalBlanks } updatedAt deadlineAt name }
        }
    }
`

const cardsQuery: TypedDocumentNode<CardsResponse, { courseId?: string; cardIds: ReadonlyArray<string> }> = gql`
    query FlashcardCardsByIds($courseId: String, $cardIds: [String!]!) {
        flashcardCardsByIds(courseId: $courseId, cardIds: $cardIds) {
            success message error
            data {
                cards {
                    cardId deckTitle front back level tags
                    nextIntervals { again hard good easy }
                }
            }
        }
    }
`

const hydrate = async (
    data: ReviewSessionData | QuizSessionData,
    mode: FlashcardSessionMode,
    courseId?: string,
    kind?: FlashcardReviewKind,
): Promise<FlashcardSession> => {
    const apollo = createApolloClient({ withAuth: true })
    const cardsResponse = await apollo.query({
        query: cardsQuery,
        variables: { courseId, cardIds: data.cardIds },
    })
    const review = mode === "review" ? data as ReviewSessionData : undefined
    const quiz = mode === "quiz" ? data as QuizSessionData : undefined
    return {
        sessionId: data.sessionId,
        mode,
        kind: mode === "review" ? kind ?? review?.kind ?? "deck" : undefined,
        status: "in_progress",
        cardIds: data.cardIds,
        cards: cardsResponse.data?.flashcardCardsByIds.data?.cards ?? [],
        currentIndex: data.currentIndex,
        reviewedCount: review?.reviewedCount ?? quiz?.results.length ?? 0,
        gradedIndexes: review?.gradedIndexes ?? [],
        results: quiz?.results ?? [],
        xpEarned: review?.xpEarned ?? 0,
        updatedAt: data.updatedAt,
        deadlineAt: quiz?.deadlineAt,
        name: quiz?.name,
    }
}

const queryReviewByDeck = async (deckId: string): Promise<ReviewSessionData | null> => {
    const apollo = createApolloClient({ withAuth: true })
    const response = await apollo.query({ query: reviewByDeckQuery, variables: { deckId } })
    return response.data?.myInProgressFlashcardReviewSession.data ?? null
}

const queryReviewBySession = async (sessionId: string): Promise<ReviewSessionData | null> => {
    const apollo = createApolloClient({ withAuth: true })
    const response = await apollo.query({ query: reviewBySessionQuery, variables: { sessionId } })
    return response.data?.myFlashcardReviewSessionBySessionId.data ?? null
}

const queryDueByCourse = async (courseId: string): Promise<ReviewSessionData | null> => {
    const apollo = createApolloClient({ withAuth: true })
    const response = await apollo.query({ query: dueByCourseQuery, variables: { courseId } })
    return response.data?.myInProgressFlashcardDueReviewSession.data ?? null
}

/** Resolves the backend review session named by one review request, without hydrating cards. */
const resolveReviewSession = async (
    request: QueryFlashcardReviewSessionRequest,
): Promise<{ data: ReviewSessionData; kind: FlashcardReviewKind } | null> => {
    if (request.sessionId !== undefined) {
        const data = await queryReviewBySession(request.sessionId)
        return data == null ? null : { data, kind: data.kind ?? "deck" }
    }
    if (request.reviewKind === "due") {
        if (request.courseId === undefined) return null
        const data = await queryDueByCourse(request.courseId)
        return data == null ? null : { data, kind: "due" }
    }
    const deckIds = request.deckIds ?? (request.deckId === undefined ? [] : [request.deckId])
    if (deckIds.length === 0) return null
    const sessions = await Promise.all(deckIds.map(queryReviewByDeck))
    const data = sessions.find((session) => session !== null)
    return data == null ? null : { data, kind: "deck" }
}

/** Resolves and hydrates the backend-proven resumable session for one route or overview. */
export const queryMyInProgressFlashcardSession = async (
    request: QueryFlashcardSessionRequest,
): Promise<FlashcardSession | null> => {
    if (request.mode === "review") {
        const resolved = await resolveReviewSession(request)
        return resolved == null ? null : hydrate(resolved.data, "review", request.courseId, resolved.kind)
    }
    const apollo = createApolloClient({ withAuth: true })
    const response = await apollo.query({ query: quizByCourseQuery, variables: { courseId: request.courseId } })
    const data = response.data?.myInProgressFlashcardQuizSession.data
    if (data == null || (request.sessionId !== undefined && data.sessionId !== request.sessionId)) return null
    return hydrate(data, "quiz", request.courseId)
}
