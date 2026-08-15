"use client"

import useSWR from "swr"
import { queryContinueLearning } from "@/modules/api/graphql/queries/query-continue-learning"
import type { ContinueLearning } from "@/modules/api/graphql/queries/types/study"

/** Loads private resume pointers only when a session is available. */
export const useQueryContinueLearningSwr = (enabled: boolean) => useSWR<ContinueLearning | null>(enabled ? "QUERY_CONTINUE_LEARNING" : null, async () => (await queryContinueLearning()).data?.continueLearning.data ?? null)
