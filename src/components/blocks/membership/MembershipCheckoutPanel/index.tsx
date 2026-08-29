"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMutatePurchaseMembershipSwr } from "@/hooks/swr/useMutatePurchaseMembershipSwr"
import { useQueryMiaMiaPricingCatalogSwr } from "@/hooks/swr/useQueryMiaMiaPricingCatalogSwr"
import { submitCheckout } from "@/modules/payment/submit-checkout"
import { MembershipCheckoutPanelBase } from "./component"

/** Defines dismissal behavior for the connected checkout panel. */
export type MembershipCheckoutPanelConnectedProps = { readonly onDismiss: () => void; readonly returnUrl?: string; readonly cancelUrl?: string }

/** Which tree the checkout panel draws for the mutation, the failure flag and the pricing read. */
const resolveMembershipCheckoutState = (
    failed: boolean,
    isMutating: boolean,
    isCatalogLoading: boolean,
) => {
    if (failed) return "failed"
    if (isMutating) return "submitting"
    return isCatalogLoading ? "loading" : "idle"
}

/** Connects membership purchase state to the pure checkout panel. */
export const MembershipCheckoutPanel = ({ onDismiss, returnUrl, cancelUrl }: MembershipCheckoutPanelConnectedProps) => {
    const t = useTranslations("miamia.membership")
    const checkout = useMutatePurchaseMembershipSwr()
    const catalog = useQueryMiaMiaPricingCatalogSwr()
    const [failed, setFailed] = useState(false)
    const run = async () => {
        setFailed(false)
        try {
            const here = window.location.href
            const result = await checkout.trigger({ paymentType: "payos", payosReturnUrl: returnUrl ?? here, payOSCancelUrl: cancelUrl ?? here })
            const envelope = result.data?.purchaseMembership
            if (!envelope?.success || envelope.data === undefined) throw new Error(envelope?.message ?? "Checkout failed")
            submitCheckout(envelope.data)
        } catch {
            setFailed(true)
        }
    }
    const amount = catalog.data?.membership.monthlyPriceVnd
    const state = resolveMembershipCheckoutState(failed, checkout.isMutating, catalog.isLoading)
    return <MembershipCheckoutPanelBase state={state} props={{ title: t("title"), body: t("body"), price: amount === undefined ? "" : t("price", { price: new Intl.NumberFormat("vi-VN").format(amount) }), benefits: [t("benefitLibrary"), t("benefitResult"), t("benefitFuture")], checkoutLabel: t("checkout"), cancelLabel: t("cancel"), errorMessage: t("failed") }} on={{ checkout: run, retry: run, dismiss: onDismiss }} />
}

/** Declares the component architecture metadata. */
