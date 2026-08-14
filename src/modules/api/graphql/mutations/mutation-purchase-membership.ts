import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MutationPurchaseMembershipResponse, PurchaseMembershipRequest } from "./types/purchase-membership"

const mutation = gql`mutation PurchaseMembership($request: PurchaseMembershipRequest!) { purchaseMembership(request: $request) { success message error data { checkoutUrl referenceId transactionId amount checkoutFields } } }`

/** Creates a membership purchase and returns its checkout details. */
export const mutationPurchaseMembership = async (request: PurchaseMembershipRequest) => createApolloClient({ withAuth: true }).mutate<MutationPurchaseMembershipResponse>({ mutation, variables: { request } })
