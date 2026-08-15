import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryContinueLearningResponse } from "./types/study"

const query = gql`query ContinueLearning { continueLearning { success message error data { topic { id slug } paper { id slug } reviewPhrase { id text } } } }`

/** Fetches authenticated resume pointers for the Study landing page. */
export const queryContinueLearning = async () => createApolloClient({ withAuth: true }).query<QueryContinueLearningResponse>({ query })
