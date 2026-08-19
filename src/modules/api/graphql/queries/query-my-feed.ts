import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { LookupQueryParams, QueryVariables } from "../types"
import type { MyFeedRequest, QueryMyFeedResponse } from "./types/my-feed"

const query1: TypedDocumentNode<QueryMyFeedResponse, QueryVariables<MyFeedRequest>> = gql`
    query MyFeed($request: MyFeedRequest!) {
        myFeed(request: $request) {
            success
            message
            error
            data {
                items {
                    id
                    actorGlobalId
                    actorUsername
                    actorAvatar
                    type
                    targetGlobalId
                    targetLabel
                    at
                    reactionCount
                    myReaction
                    isMine
                }
                nextCursor
            }
        }
    }
`

export enum QueryMyFeed { Query1 = "query1" }

/** Every supported dashboard-feed document keyed by its public variant. */
export const queryMyFeedMap: Record<QueryMyFeed, TypedDocumentNode<QueryMyFeedResponse, QueryVariables<MyFeedRequest>>> = {
    [QueryMyFeed.Query1]: query1,
}

/** Fetches one cursor page of dashboard activity for the authenticated viewer. */
export const queryMyFeed = async ({
    query = QueryMyFeed.Query1,
    request,
    headers,
    signal,
    debug,
}: LookupQueryParams<QueryMyFeed, MyFeedRequest>) => {
    const apollo = createApolloClient({ withAuth: true, headers, signal, debug })
    return apollo.query({
        query: queryMyFeedMap[query],
        variables: { request },
        fetchPolicy: "no-cache",
    })
}

