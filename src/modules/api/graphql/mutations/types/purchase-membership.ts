import type { GraphQLResponse } from "../../types"

/** Provider return URLs required to begin membership checkout. */
export type PurchaseMembershipRequest = { readonly paymentType: "payos"; readonly payosReturnUrl?: string; readonly payOSCancelUrl?: string }
/** Provider checkout instructions returned by the backend. */
export type PurchaseMembershipData = { readonly checkoutUrl: string; readonly referenceId: string; readonly transactionId: string; readonly amount: number; readonly checkoutFields?: string | null }
/** GraphQL envelope for membership checkout. */
export type MutationPurchaseMembershipResponse = { readonly purchaseMembership: GraphQLResponse<PurchaseMembershipData> }
