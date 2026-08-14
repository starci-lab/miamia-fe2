"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMutatePurchaseMembershipSwr } from "@/hooks/swr/useMutatePurchaseMembershipSwr"
import { submitCheckout } from "@/modules/payment/submit-checkout"
import { _MembershipCheckoutPanel } from "./component"

/** Defines dismissal behavior for the connected checkout panel. */
export type MembershipCheckoutPanelConnectedProps = { readonly onDismiss: () => void }

/** Connects membership purchase state to the pure checkout panel. */
export const MembershipCheckoutPanel = ({ onDismiss }: MembershipCheckoutPanelConnectedProps) => {
    const t = useTranslations("miamia.membership")
    const checkout = useMutatePurchaseMembershipSwr()
    const [failed, setFailed] = useState(false)
    const run = async () => {
        setFailed(false)
        try {
            const result = await checkout.trigger({ paymentType: "payos", payosReturnUrl: window.location.href, payOSCancelUrl: window.location.href })
            const envelope = result.data?.purchaseMembership
            if (!envelope?.success || envelope.data === undefined) throw new Error(envelope?.message ?? "Checkout failed")
            submitCheckout(envelope.data)
        } catch {
            setFailed(true)
        }
    }
    return <_MembershipCheckoutPanel state={failed ? "failed" : checkout.isMutating ? "submitting" : "idle"} props={{ title: t("title"), body: t("body"), benefits: [t("benefitLibrary"), t("benefitResult"), t("benefitFuture")], checkoutLabel: t("checkout"), cancelLabel: t("cancel"), errorMessage: t("failed") }} on={{ checkout: run, retry: run, dismiss: onDismiss }} />
}

/** Declares the component architecture metadata. */
export const meta = { shape: "block", world: "connected", domain: "membership" } as const
