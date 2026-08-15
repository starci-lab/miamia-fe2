"use client"

import useSWR from "swr"
import { queryWrapped } from "@/modules/api/graphql/queries/query-wrapped"
import type { WrappedPeriod, WrappedSummary } from "@/modules/api/graphql/queries/types/profile-learning"

/** Loads private Wrapped data only after the connected owner boundary enables it. */
export const useQueryWrappedSwr = (period: WrappedPeriod, enabled: boolean) => useSWR<WrappedSummary | null>(enabled ? ["QUERY_WRAPPED", period] : null, async () => (await queryWrapped(period)).data?.wrapped.data ?? null)
