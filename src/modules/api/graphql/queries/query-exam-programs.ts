import { gql, type OperationVariables, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryExamProgramsResponse } from "./types/exam"

const query: TypedDocumentNode<QueryExamProgramsResponse, OperationVariables> = gql`query ExamPrograms { examPrograms { success message error data { id slug sortIndex bankCount nameVi nameEn descriptionVi descriptionEn } } }`

/** Fetches all exam programs visible to the authenticated learner. */
export const queryExamPrograms = async () => createApolloClient({ withAuth: true }).query({ query })
