"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMutatePurchaseExamDownloadPackageSwr } from "@/hooks/swr/useMutatePurchaseExamDownloadPackageSwr"
import { submitCheckout } from "@/modules/payment/submit-checkout"
import type { ExamDownloadPackage } from "@/modules/api/graphql/queries/types/miamia-pricing"
import { _ExamDownloadCheckoutPanel } from "./component"

/** Server-owned package facts and return destinations for checkout. */
export type ExamDownloadCheckoutPanelConnectedProps = { readonly packageId: ExamDownloadPackage; readonly returnUrl: string; readonly cancelUrl: string; readonly onDismiss: () => void; readonly amount: number }

/** Panel lifecycle: a failed attempt beats an in-flight submission beats the idle default. */
const resolveCheckoutState = (failed: boolean, isMutating: boolean) => {
    if (failed) return "failed" as const
    if (isMutating) return "submitting" as const
    return "idle" as const
}
/** Connects a selected download package to its authenticated checkout mutation. */
export const ExamDownloadCheckoutPanel = ({ packageId, returnUrl, cancelUrl, onDismiss, amount }: ExamDownloadCheckoutPanelConnectedProps) => {
    const t = useTranslations("miamia.pricing.checkout")
    const checkout = useMutatePurchaseExamDownloadPackageSwr()
    const [failed, setFailed] = useState(false)
    const run = async () => {
        setFailed(false)
        try {
            const result = await checkout.trigger({ packageId, paymentType: "payos", payosReturnUrl: returnUrl, payosCancelUrl: cancelUrl })
            const envelope = result.data?.purchaseExamDownloadPackage
            if (!envelope?.success || envelope.data === undefined) throw new Error(envelope?.message ?? "Checkout failed")
            submitCheckout(envelope.data)
        } catch { setFailed(true) }
    }
    const state = resolveCheckoutState(failed, checkout.isMutating)
    return <_ExamDownloadCheckoutPanel state={state} props={{ title: t(`${packageId}.title`), body: t(`${packageId}.body`), price: t("price", { price: new Intl.NumberFormat("vi-VN").format(amount) }), benefits: [t(`${packageId}.benefitOne`), t(`${packageId}.benefitTwo`), t(`${packageId}.benefitThree`)], checkoutLabel: t("pay"), cancelLabel: t("cancel"), errorMessage: t("failed") }} on={{ checkout: run, retry: run, dismiss: onDismiss }} />
}
/** Declares the connected payment block boundary. */
export const meta = { shape: "block", world: "connected", domain: "payment" } as const
