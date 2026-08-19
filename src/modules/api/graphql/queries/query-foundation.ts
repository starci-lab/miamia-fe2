import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { GraphQLResponse, LookupQueryParams } from "../types"
import type { Foundation } from "./query-foundations"

/** Primary or display identity used to resolve one foundation resource. */
export type FoundationRequest = { readonly id?: string; readonly displayId?: string }
type QueryFoundationResponse = { readonly foundation: GraphQLResponse<Foundation> }

const document: TypedDocumentNode<QueryFoundationResponse, { request: FoundationRequest }> = gql`
    query Foundation($request: FoundationRequest!) {
        foundation(request: $request) {
            success
            message
            error
            data {
                id
                displayId
                title
                description
                kind
                value
                sortIndex
                isRecommended
                author
                thumbnailUrl
                categoryId
                tags { id value sortIndex }
            }
        }
    }
`

export enum QueryFoundation { Query1 = "query1" }

/** Resolve one foundation resource by its route identity. */
export const queryFoundation = async ({ request, headers, signal, debug }: LookupQueryParams<QueryFoundation, FoundationRequest>) =>
    createApolloClient({ headers, signal, debug }).query({
        query: document,
        variables: { request },
    })
