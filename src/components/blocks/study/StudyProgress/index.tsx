"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryProgressSummarySwr } from "@/hooks"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { _StudyProgress } from "./component"

type StudyProgressConnectedProps = { readonly onBrowse: () => void; readonly onRequireSignIn: () => void }
/** Connects authenticated progress evidence to the Study landing surface. */
export const StudyProgress = ({ onBrowse, onRequireSignIn }: StudyProgressConnectedProps) => {
    const t = useTranslations("miamia.study.progress")
    const token = useSessionToken()
    // Match the server's first tree before revealing guest or authenticated evidence. A restored
    // browser token otherwise replaces one notice with four progress children during hydration.
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])
    const query = useQueryProgressSummarySwr(isMounted && token !== undefined)
    const data = query.data ?? undefined
    const state = !isMounted ? "pending" : !token ? "guest" : query.error || query.data === null ? "failed" : query.data === undefined ? "pending" : "ready"
    const levelPercent = data?.xpForNextLevel ? Math.min(100, Math.round(((data.xpIntoLevel ?? 0) / data.xpForNextLevel) * 100)) : 0
    return <_StudyProgress state={state} props={{ title: t("title"), stats: [{ icon: "streak", label: t("streak"), value: t("days", { count: data?.currentStreak ?? 0 }) }, { icon: "course", label: t("known"), value: t("phrases", { count: data?.phrasesKnown ?? 0 }) }, { icon: "review", label: t("practice"), value: String(data?.attemptsCount ?? 0) }], levelTitle: t("level", { level: data?.level ?? 1 }), levelPercent, levelFact: `${data?.xpIntoLevel ?? 0}/${data?.xpForNextLevel ?? 0} XP`, notice: state === "guest" ? t("guest") : t("failed"), actionLabel: state === "guest" ? t("signIn") : t("retry") }} on={{ browse: onBrowse, requireSignIn: onRequireSignIn, retry: () => { void query.mutate() } }} />
}
/** Declares the connected Study progress block. */
export const meta = { shape: "block", world: "connected", domain: "study" } as const
