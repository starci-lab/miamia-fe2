import useSWR from "swr"
import { queryPapers } from "@/modules/api/graphql/queries/query-papers"
import type { PaperSummary } from "@/modules/api/graphql/queries/types/exam"

/** Loads the exam-paper catalogue for the signed-in learner. */
export const useQueryPapersSwr = () => useSWR<ReadonlyArray<PaperSummary> | null>("QUERY_PAPERS", async () => (await queryPapers()).data?.papers.data ?? null)
