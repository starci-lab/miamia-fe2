import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryPhrasePracticeResponse } from "./types/study"

const query = gql`query PhrasePractice($topicSlug: String!) { phrasePractice(topicSlug: $topicSlug) { success message error data { promptPhraseId meaningVi options { phraseId text } } } }`

/** Builds one public recall set for the selected topic. */
export const queryPhrasePractice = async (topicSlug: string) => createApolloClient({ withAuth: false }).query<QueryPhrasePracticeResponse>({ query, variables: { topicSlug } })
