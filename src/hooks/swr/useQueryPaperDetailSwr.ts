import useSWR from "swr"
import { queryPaperDetail } from "@/modules/api/graphql/queries/query-paper-detail"
import type { PaperDetail } from "@/modules/api/graphql/queries/types/exam"

/** Loads one exam paper when its slug is available. */
export const useQueryPaperDetailSwr = (slug?: string) => useSWR<PaperDetail | null>(slug ? ["QUERY_PAPER_DETAIL", slug] : null, async () => (await queryPaperDetail(slug ?? "")).data?.paperDetail.data ?? null)
