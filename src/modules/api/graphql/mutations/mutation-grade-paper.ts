import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { GradePaperRequest, MutationGradePaperResponse } from "./types/grade-paper"

const mutation = gql`mutation GradePaper($request: GradePaperRequest!) { gradePaper(request: $request) { success message error data { attemptId score maxScore answers { questionId slug stem selected correct isCorrect explanationVi explanationEn } } } }`

/** Submits the learner's answers and returns the graded paper. */
export const mutationGradePaper = async (request: GradePaperRequest) => createApolloClient({ withAuth: true }).mutate<MutationGradePaperResponse>({ mutation, variables: { request } })
