import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MutationParams } from "./types/params"
import type { MutationSetFollowResponse, SetFollowRequest } from "./types/set-follow"

type SetFollowVariables = { readonly request: SetFollowRequest }

const mutation1: TypedDocumentNode<MutationSetFollowResponse, SetFollowVariables> = gql`
    mutation SetFollow($request: SetFollowRequest!) {
        setFollow(request: $request) { success message error }
    }
`

export enum MutationSetFollow { Mutation1 = "mutation1" }

/** Every supported follow document keyed by its public variant. */
export const mutationSetFollowMap: Record<MutationSetFollow, TypedDocumentNode<MutationSetFollowResponse, SetFollowVariables>> = {
    [MutationSetFollow.Mutation1]: mutation1,
}

/** Sets the authenticated viewer's follow state for one user. */
export const mutationSetFollow = async ({
    mutation = MutationSetFollow.Mutation1,
    request,
    headers,
    signal,
    debug,
}: MutationParams<MutationSetFollow, SetFollowRequest>) => {
    const apollo = createApolloClient({ withAuth: true, headers, signal, debug })
    return apollo.mutate({
        mutation: mutationSetFollowMap[mutation],
        variables: { request },
    })
}

