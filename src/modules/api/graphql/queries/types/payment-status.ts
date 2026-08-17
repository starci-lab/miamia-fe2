import type { GraphQLResponse } from "../../types"
import type { ExamDownloadPackage } from "./miamia-pricing"

/** Persisted terminal and non-terminal transaction states. */
export type PaymentStatus = "pending" | "succeeded" | "cancelled" | "failed" | "unpaid"
/** Product family purchased by a transaction. */
export type PaymentPurchaseKind = "membership" | "examDownload"
/** Exactly one transaction lookup identity. */
export type MyPaymentStatusRequest = { readonly referenceId?: string; readonly transactionId?: string }
/** Persisted payment state owned by the backend. */
export type MyPaymentStatusData = {
    readonly transactionId: string
    readonly referenceId: string
    readonly status: PaymentStatus
    readonly purchaseKind: PaymentPurchaseKind
    readonly paymentType: "payos" | "sepay"
    readonly amount: number
    readonly examDownloadPackage?: ExamDownloadPackage | null
    readonly createdAt: string
    readonly updatedAt: string
}
/** GraphQL envelope returned by the owner-only status query. */
export type QueryMyPaymentStatusResponse = { readonly myPaymentStatus: GraphQLResponse<MyPaymentStatusData> }
