"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryContinueLearningSwr } from "@/hooks"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { _StudyContinue } from "./component"

type StudyContinueConnectedProps = { readonly onBrowse: () => void; readonly onResumeTopic: (slug: string) => void }
/** Connects private resume data to the Study landing surface. */
export const StudyContinue = ({ onBrowse, onResumeTopic }: StudyContinueConnectedProps) => {
    const t = useTranslations("miamia.study.continue")
    const token = useSessionToken()
    // The server cannot see the in-memory token. Keep the first client tree on the same pending
    // branch, otherwise a restored session adds the secondary CTA during hydration and shifts
    // every React-Aria id below it.
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])
    const query = useQueryContinueLearningSwr(isMounted && token !== undefined)
    const topic = query.data?.topic ?? null
    const state = !isMounted ? "pending" : !token ? "empty" : query.error || query.data === null ? "failed" : query.data === undefined ? "pending" : topic ? "ready" : "empty"
    return <_StudyContinue state={state} props={{ eyebrow: state === "ready" ? t("eyebrowReady") : t("eyebrow"), title: state === "ready" ? t("titleReady") : state === "failed" ? t("titleFailed") : t("title"), body: state === "ready" ? t("bodyReady") : state === "failed" ? t("bodyFailed") : t("body"), actionLabel: state === "ready" ? t("resume") : t("browse"), browseLabel: t("browse") }} on={{ resume: topic ? () => onResumeTopic(topic.slug) : undefined, browse: onBrowse }} />
}
/** Declares the connected Study resume block. */
export const meta = { shape: "block", world: "connected", domain: "study" } as const
