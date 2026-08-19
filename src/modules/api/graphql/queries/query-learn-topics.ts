import { gql, type OperationVariables, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryLearnTopicsResponse } from "./types/study"

const query: TypedDocumentNode<QueryLearnTopicsResponse, OperationVariables> = gql`query LearnTopics { learnTopics { success message error data { id slug level phraseCount nameVi nameEn blurbVi blurbEn } } }`

/** Fetches the public phrase-topic catalogue. */
export const queryLearnTopics = async () => createApolloClient({ withAuth: false }).query({ query })
