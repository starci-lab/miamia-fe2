import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryProgressSummaryResponse } from "./types/profile-learning"

const query = gql`query ProgressSummary { progressSummary { success message error data { currentStreak studyDays phrasesKnown totalPhrases attemptsCount bestPercent xp level xpIntoLevel xpForNextLevel } } }`

/** Fetches private learning totals for the authenticated learner. */
export const queryProgressSummary = async () => createApolloClient({ withAuth: true }).query<QueryProgressSummaryResponse>({ query })
