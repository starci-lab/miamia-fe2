"use client"

import useSWR from "swr"
import { queryProgressSummary } from "@/modules/api/graphql/queries/query-progress-summary"
import type { ProgressSummary } from "@/modules/api/graphql/queries/types/profile-learning"

/** Loads private progress only after the connected owner boundary enables it. */
export const useQueryProgressSummarySwr = (enabled: boolean) => useSWR<ProgressSummary | null>(enabled ? "QUERY_PROGRESS_SUMMARY" : null, async () => (await queryProgressSummary()).data?.progressSummary.data ?? null)
