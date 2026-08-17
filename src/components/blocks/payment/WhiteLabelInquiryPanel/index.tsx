"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useMutateSubmitContactSwr } from "@/hooks/swr/useMutateSubmitContactSwr"
import { _WhiteLabelInquiryPanel, type WhiteLabelInquiryErrors, type WhiteLabelInquiryValues } from "./component"

/** Dismissal and pending-state reporting for the inquiry overlay. */
export type WhiteLabelInquiryPanelConnectedProps = { readonly onDismiss: () => void; readonly onPendingChange?: (pending: boolean) => void }
const EMPTY_VALUES: WhiteLabelInquiryValues = { name: "", email: "", message: "" }

/** Connects validated partnership fields to the anonymous contact mutation. */
export const WhiteLabelInquiryPanel = ({ onDismiss, onPendingChange }: WhiteLabelInquiryPanelConnectedProps) => {
    const t = useTranslations("miamia.pricing.inquiry")
    const submit = useMutateSubmitContactSwr()
    const [values, setValues] = useState(EMPTY_VALUES)
    const [errors, setErrors] = useState<WhiteLabelInquiryErrors>({})
    const [outcome, setOutcome] = useState<"idle" | "succeeded" | "failed">("idle")
    const copy = useMemo(() => Object.fromEntries(["title", "body", "name", "namePlaceholder", "email", "emailPlaceholder", "message", "messagePlaceholder", "submit", "cancel", "succeeded", "failed", "retry"].map((key) => [key, t(key)])), [t])
    const change = (field: keyof WhiteLabelInquiryValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }))
        setErrors((current) => ({ ...current, [field]: undefined }))
    }
    const run = async () => {
        const next: WhiteLabelInquiryErrors = {}
        if (values.name.trim().length < 2) next.name = t("nameInvalid")
        if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = t("emailInvalid")
        if (values.message.trim().length < 10) next.message = t("messageInvalid")
        if (Object.keys(next).length > 0) { setErrors(next); return }
        setOutcome("idle")
        onPendingChange?.(true)
        try {
            const result = await submit.trigger({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() })
            if (result.data?.submitContact.success !== true) throw new Error(result.data?.submitContact.message ?? "Contact failed")
            setOutcome("succeeded")
        } catch { setOutcome("failed") } finally { onPendingChange?.(false) }
    }
    const state = submit.isMutating ? "submitting" : outcome === "succeeded" ? "succeeded" : outcome === "failed" ? "failed" : Object.keys(errors).length > 0 ? "invalid" : "idle"
    return <_WhiteLabelInquiryPanel state={state} values={values} errors={errors} copy={copy} onChange={change} onSubmit={run} onDismiss={onDismiss} />
}
/** Declares the connected inquiry block boundary. */
export const meta = { shape: "block", world: "connected", domain: "payment" } as const
