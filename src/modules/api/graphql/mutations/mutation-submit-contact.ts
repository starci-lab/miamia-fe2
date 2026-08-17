import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MutationSubmitContactResponse, SubmitPartnershipContactRequest } from "./types/submit-contact"

const mutation = gql`mutation SubmitContact($request: SubmitContactRequest!) { submitContact(request: $request) { success message error } }`
/** Sends an anonymous inquiry with a fixed partnership category. */
export const mutationSubmitContact = async (input: SubmitPartnershipContactRequest) => createApolloClient({ withAuth: false }).mutate<MutationSubmitContactResponse>({ mutation, variables: { request: { ...input, category: "partnership" } } })
