import { gql, type OperationVariables, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryParams } from "../types"
import type { QueryMeResponse } from "./types/me"

/** The signed-in person's identity anchor. */
const query1: TypedDocumentNode<QueryMeResponse, OperationVariables> = gql`
    query Me {
        me {
            success
            message
            error
            data {
                id
                username
                email
                displayName
                avatar
            }
        }
    }
`

export enum QueryMe {
    Query1 = "query1",
}

/** Query variants available to the authenticated identity reader. */
export const queryMeMap: Record<QueryMe, TypedDocumentNode<QueryMeResponse, OperationVariables>> = {
    [QueryMe.Query1]: query1,
}

/** Fetch the authenticated person's identity with bearer and managed-session cookie. */
export const queryMe = async ({
    query = QueryMe.Query1,
    headers,
    signal,
    debug,
}: QueryParams<QueryMe> = {}) => {
    const apollo = createApolloClient({ withAuth: true, headers, signal, debug })
    return apollo.query({ query: queryMeMap[query] })
}
