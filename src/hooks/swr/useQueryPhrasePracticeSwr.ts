"use client"

import useSWR from "swr"
import { queryPhrasePractice } from "@/modules/api/graphql/queries/query-phrase-practice"
import type { PhrasePracticeItem } from "@/modules/api/graphql/queries/types/study"

/** Loads one public phrase-practice set. */
export const useQueryPhrasePracticeSwr = (slug: string) => useSWR<ReadonlyArray<PhrasePracticeItem> | null>(slug ? ["QUERY_PHRASE_PRACTICE", slug] : null, async () => (await queryPhrasePractice(slug)).data?.phrasePractice.data ?? null)
