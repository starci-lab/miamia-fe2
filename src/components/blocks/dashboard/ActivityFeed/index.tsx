"use client"

import { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import type { QueryMyFeedItemData } from "@/modules/api/graphql/queries/types/my-feed"
import { ActivityType } from "@/modules/api/graphql/queries/types/my-feed"
import { ReactionType } from "@/modules/api/graphql/queries/types/reactions"
import type { ActivityDayData, ActivityFeedActions } from "./component"
import { _ActivityFeed } from "./component"

type ActivityTranslate = ReturnType<typeof useTranslations>
type ActivityRow = ActivityDayData["rows"][number]

/** Remote activity rows and state resolved by the feed controller. */
export type ActivityFeedConnectedProps = {
    readonly state: "pending" | "filteredEmpty" | "platformEmpty" | "failed" | "ready"
    readonly items: ReadonlyArray<QueryMyFeedItemData>
    readonly on?: ActivityFeedActions
    readonly message: string
    readonly description?: string
    readonly actionLabel?: string
    readonly reactingId?: string
}

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()

type ActivityRollup = {
    readonly head: QueryMyFeedItemData
    readonly count: number
}

/** Preserve legacy's one-row summary for consecutive milestones by the same actor. */
const rollUpMilestones = (items: ReadonlyArray<QueryMyFeedItemData>): ReadonlyArray<ActivityRollup> => {
    const rolled: Array<ActivityRollup> = []
    for (const item of items) {
        const previous = rolled.at(-1)
        if (
            item.type === ActivityType.MilestonePassed
            && previous?.head.type === ActivityType.MilestonePassed
            && previous.head.actorGlobalId === item.actorGlobalId
        ) {
            rolled[rolled.length - 1] = { head: previous.head, count: previous.count + 1 }
        } else {
            rolled.push({ head: item, count: 1 })
        }
    }
    return rolled
}

/** "Xm ago" below an hour, otherwise the resolved hour count. */
const relativeTime = (t: ActivityTranslate, deltaMinutes: number): string =>
    deltaMinutes < 60
        ? t("minutesAgo", { count: deltaMinutes })
        : t("hoursAgo", { count: Math.floor(deltaMinutes / 60) })

/** The activity line's copy: the milestone rollup summary, or the per-type sentence. */
const activityActionLabel = (t: ActivityTranslate, item: QueryMyFeedItemData, count: number, isGroupedMilestone: boolean): string => {
    if (isGroupedMilestone) return t("activity.milestonePassedGrouped", { count })
    const key = item.type === ActivityType.LessonRead ? "contentRead" : item.type
    return t(`activity.${key}`)
}

/** One resolved row: copy, relative time and the viewer's reaction state. */
const buildActivityRow = (t: ActivityTranslate, item: QueryMyFeedItemData, count: number, reactingId: string | undefined): ActivityRow => {
    const isGroupedMilestone = item.type === ActivityType.MilestonePassed && count > 1
    const delta = Math.max(0, Math.floor((Date.now() - new Date(item.at).getTime()) / 60_000))
    return {
        id: item.id,
        actor: item.actorUsername,
        avatar: item.actorAvatar ?? undefined,
        action: activityActionLabel(t, item, count, isGroupedMilestone),
        target: isGroupedMilestone ? undefined : item.targetLabel ?? undefined,
        time: relativeTime(t, delta),
        reactionLabel: t("react"),
        reactionCount: item.reactionCount,
        selectedReaction: item.myReaction,
        reactionLabels: {
            [ReactionType.Like]: t("reactions.like"),
            [ReactionType.Love]: t("reactions.love"),
            [ReactionType.Haha]: t("reactions.haha"),
            [ReactionType.Wow]: t("reactions.wow"),
            [ReactionType.Sad]: t("reactions.sad"),
            [ReactionType.Angry]: t("reactions.angry"),
        },
        isMine: item.isMine,
        isReacting: item.id === reactingId,
    }
}

/** "Today"/"Yesterday" against the local calendar, else the localized long date. */
const dayLabel = (t: ActivityTranslate, locale: string, key: number, today: number, at: Date): string => {
    if (key === today) return t("today")
    if (key === today - 86_400_000) return t("yesterday")
    return at.toLocaleDateString(locale, { dateStyle: "long" })
}

/** Resolve activity copy, relative time and local-day grouping. */
export const ActivityFeed = (input: ActivityFeedConnectedProps) => {
    const t = useTranslations("dashboard.explore")
    const locale = useLocale()
    const days = useMemo(() => {
        const today = startOfDay(new Date())
        const groups = new Map<number, ActivityDayData>()
        for (const { head: item, count } of rollUpMilestones(input.items)) {
            const at = new Date(item.at)
            const key = startOfDay(at)
            const row = buildActivityRow(t, item, count, input.reactingId)
            const existing = groups.get(key)
            if (existing !== undefined) groups.set(key, { ...existing, rows: [...existing.rows, row] })
            else groups.set(key, { id: String(key), label: dayLabel(t, locale, key, today, at), rows: [row] })
        }
        return [...groups.values()]
    }, [input.items, input.reactingId, locale, t])
    return <_ActivityFeed state={input.state} props={{
        days,
        message: input.message,
        description: input.description,
        actionLabel: input.actionLabel,
    }} on={input.on} />
}
/** Source-level ownership marker for the connected social block. */
export const meta = { world: "connected", domain: "social" } as const
