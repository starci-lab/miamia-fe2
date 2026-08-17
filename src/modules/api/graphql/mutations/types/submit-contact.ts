import type { GraphQLResponse } from "../../types"

/** User-entered fields for a partnership inquiry. */
export type SubmitPartnershipContactRequest = { readonly name: string; readonly email: string; readonly message: string }
/** GraphQL envelope returned after queuing a contact request. */
export type MutationSubmitContactResponse = { readonly submitContact: GraphQLResponse }
