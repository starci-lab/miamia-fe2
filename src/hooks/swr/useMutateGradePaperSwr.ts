import useSWRMutation from "swr/mutation"
import { mutationGradePaper } from "@/modules/api/graphql/mutations/mutation-grade-paper"
import type { GradePaperRequest } from "@/modules/api/graphql/mutations/types/grade-paper"

type GradePaperMutationOptions = { readonly arg: GradePaperRequest }

/** Grades one completed paper through the authenticated mutation. */
export const useMutateGradePaperSwr = () => useSWRMutation("MUTATE_GRADE_PAPER", async (_key: string, { arg }: GradePaperMutationOptions) => mutationGradePaper(arg))
