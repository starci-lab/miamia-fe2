"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryMeSwr, useQueryUserProfileSwr, useQueryWrappedSwr } from "@/hooks"
import type { WrappedPeriod } from "@/modules/api/graphql/queries/types/profile-learning"
import { _ProfileWrappedPage } from "./component"

/** Connects the owner-only Wrapped route to one selected backend period. */
export const ProfileWrappedPage = () => {
    const t = useTranslations("profile.learning")
    const params = useParams<{ username?: string }>()
    const username = params?.username ? String(params.username) : undefined
    const viewer = useQueryMeSwr()
    const profile = useQueryUserProfileSwr(username)
    const isSelf = profile.data !== null && profile.data !== undefined && viewer.data?.id === profile.data.id
    const [period, setPeriod] = useState<WrappedPeriod>("weekly")
    const wrapped = useQueryWrappedSwr(period, isSelf)
    const data = wrapped.data
    const state = !isSelf ? "failed" : wrapped.error !== undefined ? "failed" : data === undefined ? "pending" : data?.isUnlocked ? "unlocked" : "locked"
    return <_ProfileWrappedPage props={{
        period, periodLabel: t("wrapped.periodLabel"), periods: [{ id: "weekly", label: t("wrapped.weekly") }, { id: "monthly", label: t("wrapped.monthly") }, { id: "yearly", label: t("wrapped.yearly") }],
        summary: { state, props: { title: t(`wrapped.${period}Title`), metricLabels: [t("wrapped.xp"), t("wrapped.phrases"), t("wrapped.papers"), t("wrapped.streak")], metricValues: data?.stats ? [String(data.stats.xpEarned), String(data.stats.phrasesLearned), String(data.stats.papersCompleted), t("values.days", { count: data.stats.longestStreak })] : undefined, notice: !isSelf ? t("public.description") : state === "locked" ? t("wrapped.locked", { count: data?.daysUntilUnlock ?? 0 }) : t("wrapped.failed") } },
    }} on={{ selectPeriod: setPeriod }} />
}

export * from "./component"
/** Source-level connected page marker. */
export const meta = { world: "connected", domain: "profile" } as const
