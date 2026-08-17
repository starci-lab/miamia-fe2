import useSWRMutation from "swr/mutation"
import { mutationSubmitContact } from "@/modules/api/graphql/mutations/mutation-submit-contact"
import type { SubmitPartnershipContactRequest } from "@/modules/api/graphql/mutations/types/submit-contact"

type Options = { readonly arg: SubmitPartnershipContactRequest }
/** Owns one anonymous partnership inquiry request. */
export const useMutateSubmitContactSwr = () => useSWRMutation("MUTATE_SUBMIT_PARTNERSHIP_CONTACT", async (_key: string, { arg }: Options) => mutationSubmitContact(arg))
