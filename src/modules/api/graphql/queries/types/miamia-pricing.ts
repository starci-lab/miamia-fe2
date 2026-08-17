import type { GraphQLResponse } from "../../types"

/** Offers addressable from the public pricing route. */
export type MiaMiaOfferId = "pro" | "personal" | "commercial" | "white-label"
/** Download-license packages accepted by checkout. */
export type ExamDownloadPackage = "personal" | "commercial"
/** Access level published for one membership capability. */
export type PricingAccessTier = "free" | "pro"

/** Capability tiers included in the membership catalog. */
export type PricingMembershipEntitlements = {
    readonly learnPhrases: PricingAccessTier
    readonly gamesSolo: PricingAccessTier
    readonly examDemo: PricingAccessTier
    readonly examFull: PricingAccessTier
    readonly chatbot: PricingAccessTier
    readonly ragLookup: PricingAccessTier
    readonly gamesMultiplayer: PricingAccessTier
    readonly weaknessReport: PricingAccessTier
}

/** Server-owned membership prices and access facts. */
export type PricingMembershipCatalog = {
    readonly enabled: boolean
    readonly monthlyPriceVnd: number
    readonly yearlyPriceVnd?: number | null
    readonly demoPaperLimit?: number | null
    readonly aiCreditsPerDay?: number | null
    readonly entitlements?: PricingMembershipEntitlements | null
}

/** One server-owned downloadable exam package. */
export type PricingExamDownloadPackage = {
    readonly packageId: ExamDownloadPackage
    readonly priceVnd: number
    readonly continuousUpdates: boolean
    readonly zaloSupport: boolean
    readonly commercialTeaching: boolean
    readonly brandPromotionMonths: number
}

/** Public catalog spanning recurring and lifetime offers. */
export type MiaMiaPricingCatalog = {
    readonly membership: PricingMembershipCatalog
    readonly examDownloads?: {
        readonly enabled: boolean
        readonly packages: ReadonlyArray<PricingExamDownloadPackage>
    } | null
}

/** GraphQL envelope returned by the public pricing query. */
export type QueryMiaMiaPricingCatalogResponse = { readonly pricingCatalog: GraphQLResponse<MiaMiaPricingCatalog> }
