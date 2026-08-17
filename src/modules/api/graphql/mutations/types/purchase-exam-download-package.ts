import type { GraphQLResponse } from "../../types"
import type { ExamDownloadPackage } from "../../queries/types/miamia-pricing"

/** Input required to create one download-license checkout intent. */
export type PurchaseExamDownloadPackageRequest = {
    readonly packageId: ExamDownloadPackage
    readonly paymentType: "payos"
    readonly payosReturnUrl?: string
    readonly payosCancelUrl?: string
}

/** Provider handoff returned for a download-license checkout. */
export type PurchaseExamDownloadPackageData = {
    readonly checkoutUrl: string
    readonly referenceId: string
    readonly transactionId: string
    readonly amount: string
    readonly packageId: ExamDownloadPackage
}

/** GraphQL envelope for download-license checkout. */
export type MutationPurchaseExamDownloadPackageResponse = { readonly purchaseExamDownloadPackage: GraphQLResponse<PurchaseExamDownloadPackageData> }
