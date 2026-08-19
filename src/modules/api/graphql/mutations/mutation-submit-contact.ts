import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MutationSubmitContactResponse, SubmitPartnershipContactRequest } from "./types/submit-contact"

type SubmitContactVariables = { readonly request: SubmitPartnershipContactRequest & { readonly category: "partnership" } }

const mutation: TypedDocumentNode<MutationSubmitContactResponse, SubmitContactVariables> = gql`mutation SubmitContact($request: SubmitContactRequest!) { submitContact(request: $request) { success message error } }`
/** Sends an anonymous inquiry with a fixed partnership category. */
export const mutationSubmitContact = async (input: SubmitPartnershipContactRequest) => createApolloClient({ withAuth: false }).mutate({ mutation, variables: { request: { ...input, category: "partnership" } } })
