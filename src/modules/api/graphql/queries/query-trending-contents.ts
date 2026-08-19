import { gql, type OperationVariables, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryParams } from "../types"
import type { QueryTrendingContentsResponse } from "./types/trending-contents"

const query1 = gql`
    query TrendingContents {
        trendingContents {
            success
            message
            error
            data { globalId title readCount }
        }
    }
`

export enum QueryTrendingContents { Query1 = "query1" }

/** Every supported trending-content document keyed by its public variant. */
export const queryTrendingContentsMap: Record<QueryTrendingContents, TypedDocumentNode<QueryTrendingContentsResponse, OperationVariables>> = {
    [QueryTrendingContents.Query1]: query1,
}

/** Fetches content ranked by reads over the backend's current trend window. */
export const queryTrendingContents = async ({
    query = QueryTrendingContents.Query1,
    headers,
    signal,
    debug,
}: QueryParams<QueryTrendingContents> = {}) => {
    const apollo = createApolloClient({ withAuth: true, headers, signal, debug })
    return apollo.query({
        query: queryTrendingContentsMap[query],
        fetchPolicy: "no-cache",
    })
}

