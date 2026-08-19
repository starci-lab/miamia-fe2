import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryWrappedResponse, WrappedPeriod } from "./types/profile-learning"

const query: TypedDocumentNode<QueryWrappedResponse, { period: WrappedPeriod }> = gql`query Wrapped($period: WrappedPeriod!) { wrapped(period: $period) { success message error data { isUnlocked daysUntilUnlock stats { studyDays phrasesLearned papersCompleted longestStreak xpEarned hardestPhrase { id text } friendRank topicsCompleted gamesWon } } } }`

/** Fetches the authenticated learner's Wrapped card for one period. */
export const queryWrapped = async (period: WrappedPeriod) => createApolloClient({ withAuth: true }).query({ query, variables: { period } })
