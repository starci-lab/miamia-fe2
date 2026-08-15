import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MutationRecordPracticeResponse, RecordPracticeRequest } from "./types/record-practice"

const mutation = gql`mutation RecordPractice($request: RecordPracticeRequest!) { recordPractice(request: $request) { success message error data { phrasesStudied phrasesKnown } } }`

/** Records one topic-linked practice batch through the authenticated client. */
export const mutationRecordPractice = async (request: RecordPracticeRequest) => createApolloClient({ withAuth: true }).mutate<MutationRecordPracticeResponse>({ mutation, variables: { request } })
