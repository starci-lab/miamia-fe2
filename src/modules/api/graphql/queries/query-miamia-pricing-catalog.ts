import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryMiaMiaPricingCatalogResponse } from "./types/miamia-pricing"

const query = gql`query PricingCatalog { pricingCatalog { success message error data { membership { enabled monthlyPriceVnd yearlyPriceVnd demoPaperLimit aiCreditsPerDay entitlements { learnPhrases gamesSolo examDemo examFull chatbot ragLookup gamesMultiplayer weaknessReport } } examDownloads { enabled packages { packageId priceVnd continuousUpdates zaloSupport commercialTeaching brandPromotionMonths } } } } }`

/** Reads the public, server-owned MiaMia offer catalog. */
export const queryMiaMiaPricingCatalog = async () => createApolloClient({ withAuth: false }).query<QueryMiaMiaPricingCatalogResponse>({ query })

