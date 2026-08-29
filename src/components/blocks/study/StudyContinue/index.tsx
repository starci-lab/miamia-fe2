"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryContinueLearningSwr } from "@/hooks"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { StudyContinueBase } from "./component"

type StudyContinueConnectedProps = { readonly onBrowse: () => void; readonly onResumeTopic: (slug: string) => void }
type StudyContinueState = "pending" | "empty" | "failed" | "ready"
type Translate = ReturnType<typeof useTranslations>

/** Which of the four states the resume surface is in. */
const deriveStudyContinueState = (
    isMounted: boolean,
    hasToken: boolean,
    hasFailed: boolean,
    isPending: boolean,
    hasTopic: boolean,
): StudyContinueState => {
    if (!isMounted) return "pending"
    if (!hasToken) return "empty"
    if (hasFailed) return "failed"
    if (isPending) return "pending"
    if (hasTopic) return "ready"
    return "empty"
}

/** The eyebrow, title and body copy for the given state. */
const resolveStudyContinueCopy = (
    state: StudyContinueState,
    t: Translate,
): { readonly eyebrow: string, readonly title: string, readonly body: string } => {
    if (state === "ready") return { eyebrow: t("eyebrowReady"), title: t("titleReady"), body: t("bodyReady") }
    if (state === "failed") return { eyebrow: t("eyebrow"), title: t("titleFailed"), body: t("bodyFailed") }
    return { eyebrow: t("eyebrow"), title: t("title"), body: t("body") }
}

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
    const state = deriveStudyContinueState(
        isMounted,
        Boolean(token),
        Boolean(query.error) || query.data === null,
        query.data === undefined,
        Boolean(topic),
    )
    const copy = resolveStudyContinueCopy(state, t)
    return (
        <StudyContinueBase
            state={state}
            props={{
                eyebrow: copy.eyebrow,
                title: copy.title,
                body: copy.body,
                actionLabel: state === "ready" ? t("resume") : t("browse"),
                browseLabel: t("browse"),
            }}
            on={{ resume: topic ? () => onResumeTopic(topic.slug) : undefined, browse: onBrowse }}
        />
    )
}
/** Declares the connected Study resume block. */
