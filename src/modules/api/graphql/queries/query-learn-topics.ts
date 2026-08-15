import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryLearnTopicsResponse } from "./types/study"

const query = gql`query LearnTopics { learnTopics { success message error data { id slug level phraseCount nameVi nameEn blurbVi blurbEn } } }`

/** Fetches the public phrase-topic catalogue. */
export const queryLearnTopics = async () => createApolloClient({ withAuth: false }).query<QueryLearnTopicsResponse>({ query })
