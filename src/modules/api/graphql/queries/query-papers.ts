import { gql, type OperationVariables, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryPapersResponse } from "./types/exam"

const query: TypedDocumentNode<QueryPapersResponse, OperationVariables> = gql`query Papers { papers { success message error data { id slug kind level durationMinutes questionCount titleVi titleEn descriptionVi descriptionEn isDemo isLocked programSlug } } }`

/** Fetches the exam-paper catalogue visible to the authenticated learner. */
export const queryPapers = async () => createApolloClient({ withAuth: true }).query({ query })
