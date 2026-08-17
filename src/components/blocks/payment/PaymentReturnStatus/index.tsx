"use client"

import { useTranslations } from "next-intl"
import { useQueryMyPaymentStatusSwr } from "@/hooks/swr/useQueryMyPaymentStatusSwr"
import { _PaymentReturnStatus } from "./component"

/** Lookup identity and continuation behavior for a returned payment. */
export type PaymentReturnStatusConnectedProps = { readonly referenceId: string; readonly onContinue: () => void }
/** Connects a return reference to bounded persisted-status polling. */
export const PaymentReturnStatus = ({ referenceId, onContinue }: PaymentReturnStatusConnectedProps) => {
    const t = useTranslations("miamia.pricing.return")
    const status = useQueryMyPaymentStatusSwr(referenceId)
    if (status.error) return <_PaymentReturnStatus badge={t("failedBadge")} title={t("failedTitle")} body={t("failedBody")} tone="danger" action={t("retry")} onAction={() => void status.mutate()} />
    const value = status.data?.status ?? "pending"
    if (value === "pending") return <_PaymentReturnStatus badge={t("pendingBadge")} title={t("pendingTitle")} body={t("pendingBody")} tone="warning" action={t("checkAgain")} onAction={() => void status.mutate()} />
    if (value === "succeeded") return <_PaymentReturnStatus badge={t("successBadge")} title={t("successTitle")} body={t(status.data?.purchaseKind === "membership" ? "successMembership" : "successDownload")} tone="success" action={t("continue")} onAction={onContinue} />
    return <_PaymentReturnStatus badge={t("failedBadge")} title={t(`${value}Title`)} body={t(`${value}Body`)} tone={value === "cancelled" ? "neutral" : "danger"} action={t("back")} onAction={onContinue} />
}
/** Declares the connected payment status boundary. */
export const meta = { shape: "block", world: "connected", domain: "payment" } as const
