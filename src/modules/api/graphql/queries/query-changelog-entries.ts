import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import { type QueryParams } from "../types"
import { type QueryChangelogEntriesResponse } from "./types/changelog-entries"

const query1: TypedDocumentNode<QueryChangelogEntriesResponse> = gql`
    query ChangelogEntries {
        changelogEntries(limit: 4) {
            success
            message
            error
            data { id title body category publishedAt linkUrl }
        }
    }
`

export enum QueryChangelogEntries { Query1 = "query1" }
/** Every supported changelog document keyed by its public variant. */
export const queryChangelogEntriesMap: Record<QueryChangelogEntries, TypedDocumentNode<QueryChangelogEntriesResponse>> = {
    [QueryChangelogEntries.Query1]: query1,
}

/** Fetches the four newest published changelog entries. */
export const queryChangelogEntries = async ({
    query = QueryChangelogEntries.Query1,
    headers,
    signal,
    debug,
}: QueryParams<QueryChangelogEntries> = {}) => {
    const apollo = createApolloClient({ withAuth: true, headers, signal, debug })
    return apollo.query({ query: queryChangelogEntriesMap[query] })
}
