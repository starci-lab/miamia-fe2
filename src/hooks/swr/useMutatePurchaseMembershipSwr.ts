import useSWRMutation from "swr/mutation"
import { mutationPurchaseMembership } from "@/modules/api/graphql/mutations/mutation-purchase-membership"
import type { PurchaseMembershipRequest } from "@/modules/api/graphql/mutations/types/purchase-membership"

type PurchaseMembershipMutationOptions = { readonly arg: PurchaseMembershipRequest }

/** Starts a MiaMia membership checkout through the authenticated mutation. */
export const useMutatePurchaseMembershipSwr = () => useSWRMutation("MUTATE_PURCHASE_MEMBERSHIP", async (_key: string, { arg }: PurchaseMembershipMutationOptions) => mutationPurchaseMembership(arg))
