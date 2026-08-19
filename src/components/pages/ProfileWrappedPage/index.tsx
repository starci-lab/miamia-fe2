"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQueryMeSwr, useQueryUserProfileSwr, useQueryWrappedSwr } from "@/hooks"
import type { WrappedPeriod, WrappedSummary } from "@/modules/api/graphql/queries/types/profile-learning"
import { _ProfileWrappedPage } from "./component"

type WrappedTreeState = "failed" | "pending" | "unlocked" | "locked"

/** Which tree the owner-only Wrapped summary draws, from the two independent reads that feed it. */
const resolveWrappedState = (
    isSelf: boolean,
    hasFailed: boolean,
    data: WrappedSummary | null | undefined,
): WrappedTreeState => {
    if (!isSelf) return "failed"
    if (hasFailed) return "failed"
    if (data === undefined) return "pending"
    return data?.isUnlocked ? "unlocked" : "locked"
}

/** The sentence under the metrics: who can't see this, or why it isn't unlocked yet. */
const resolveWrappedNotice = (
    t: ReturnType<typeof useTranslations>,
    isSelf: boolean,
    state: WrappedTreeState,
    daysUntilUnlock: number | null | undefined,
): string => {
    if (!isSelf) return t("public.description")
    if (state === "locked") return t("wrapped.locked", { count: daysUntilUnlock ?? 0 })
    return t("wrapped.failed")
}

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
    const state = resolveWrappedState(isSelf, wrapped.error !== undefined, data)
    return <_ProfileWrappedPage props={{
        period, periodLabel: t("wrapped.periodLabel"), periods: [{ id: "weekly", label: t("wrapped.weekly") }, { id: "monthly", label: t("wrapped.monthly") }, { id: "yearly", label: t("wrapped.yearly") }],
        summary: { state, props: { title: t(`wrapped.${period}Title`), metricLabels: [t("wrapped.xp"), t("wrapped.phrases"), t("wrapped.papers"), t("wrapped.streak")], metricValues: data?.stats ? [String(data.stats.xpEarned), String(data.stats.phrasesLearned), String(data.stats.papersCompleted), t("values.days", { count: data.stats.longestStreak })] : undefined, notice: resolveWrappedNotice(t, isSelf, state, data?.daysUntilUnlock) } },
    }} on={{ selectPeriod: setPeriod }} />
}

export * from "./component"
/** Source-level connected page marker. */
export const meta = { world: "connected", domain: "profile" } as const
