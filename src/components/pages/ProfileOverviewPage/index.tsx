"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useQueryMeSwr, useQueryProgressSummarySwr, useQueryUserProfileSwr, useQueryWrappedSwr } from "@/hooks"
import { _ProfileOverviewPage } from "./component"
import type { ProfileView } from "@/components/blocks/profile/learner/ProfileViewSwitch/component"

/** Connects the selected profile audience to owner-only learning contracts. */
export const ProfileOverviewPage = () => {
    const t = useTranslations("profile.learning")
    const params = useParams<{ username?: string }>()
    const router = useRouter()
    const username = params?.username ? String(params.username) : undefined
    const viewer = useQueryMeSwr()
    const profile = useQueryUserProfileSwr(username)
    const isSelf = profile.data !== null && profile.data !== undefined && viewer.data?.id === profile.data.id
    const [selectedView, setSelectedView] = useState<ProfileView>("private")
    const progress = useQueryProgressSummarySwr(isSelf)
    const wrapped = useQueryWrappedSwr("weekly", isSelf)
    const progressData = progress.data
    const wrappedData = wrapped.data
    const levelPercent = progressData === undefined || progressData === null || progressData.xpForNextLevel === 0 ? undefined : Math.min(100, Math.round((progressData.xpIntoLevel / progressData.xpForNextLevel) * 100))
    const progressState = progress.error !== undefined ? "failed" : progress.data === undefined ? "pending" : "ready"
    const wrappedState = wrapped.error !== undefined ? "failed" : wrapped.data === undefined ? "pending" : wrappedData?.isUnlocked ? "unlocked" : "locked"

    return <_ProfileOverviewPage
        state={isSelf ? "owner" : "visitor"}
        props={{
            selectedView,
            switchLabels: { label: t("view.label"), privateLabel: t("view.private"), publicLabel: t("view.public") },
            progress: {
                state: progressState,
                props: {
                    title: t("progress.title"),
                    metricLabels: [t("progress.streak"), t("progress.studyDays"), t("progress.phrases"), t("progress.bestScore")],
                    metricValues: progressData ? [t("values.days", { count: progressData.currentStreak }), String(progressData.studyDays), `${progressData.phrasesKnown}/${progressData.totalPhrases}`, progressData.bestPercent === null || progressData.bestPercent === undefined ? t("values.none") : `${progressData.bestPercent}%`] : undefined,
                    levelLabel: progressData ? t("progress.level", { level: progressData.level }) : t("progress.levelPending"),
                    levelPercent,
                    levelFact: progressData ? `${progressData.xpIntoLevel}/${progressData.xpForNextLevel} XP` : undefined,
                    failedMessage: t("progress.failed"), retryLabel: t("retry"),
                },
            },
            wrapped: {
                state: wrappedState,
                props: {
                    title: t("wrapped.weeklyTitle"),
                    metricLabels: [t("wrapped.xp"), t("wrapped.phrases"), t("wrapped.papers"), t("wrapped.streak")],
                    metricValues: wrappedData?.stats ? [String(wrappedData.stats.xpEarned), String(wrappedData.stats.phrasesLearned), String(wrappedData.stats.papersCompleted), t("values.days", { count: wrappedData.stats.longestStreak })] : undefined,
                    notice: wrappedState === "locked" ? t("wrapped.locked", { count: wrappedData?.daysUntilUnlock ?? 0 }) : t("wrapped.failed"),
                    actionLabel: wrappedState === "unlocked" ? t("wrapped.open") : undefined,
                },
            },
            publicMessage: t("public.title"), publicDescription: t("public.description"),
        }}
        on={{ selectView: setSelectedView, retryProgress: () => void progress.mutate(), openWrapped: () => router.push(`/profile/${username}/wrapped`) }}
    />
}

export * from "./component"
/** Source-level connected page marker. */
export const meta = { world: "connected", domain: "profile" } as const
