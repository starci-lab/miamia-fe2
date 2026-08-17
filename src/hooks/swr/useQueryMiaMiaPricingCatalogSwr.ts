import useSWR from "swr"
import { queryMiaMiaPricingCatalog } from "@/modules/api/graphql/queries/query-miamia-pricing-catalog"
import type { MiaMiaPricingCatalog } from "@/modules/api/graphql/queries/types/miamia-pricing"

/** Shares the public pricing catalog across page and checkout surfaces. */
export const useQueryMiaMiaPricingCatalogSwr = () => useSWR<MiaMiaPricingCatalog | null>("QUERY_MIAMIA_PRICING_CATALOG", async () => (await queryMiaMiaPricingCatalog()).data?.pricingCatalog.data ?? null)
