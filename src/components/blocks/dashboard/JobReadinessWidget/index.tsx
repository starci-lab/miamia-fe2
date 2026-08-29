"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useQueryMyJobReadinessSwr } from "@/hooks"
import { JobReadinessWidgetBase, type JobReadinessMetric } from "./component"

/** Widget load lifecycle: an error with no data fails, no data yet is pending, no track is empty. */
const resolveReadinessState = (hasError: boolean, dataLoaded: boolean, hasTrack: boolean) => {
    if (hasError && !dataLoaded) return "failed" as const
    if (!dataLoaded) return "pending" as const
    if (!hasTrack) return "empty" as const
    return "ready" as const
}

/** Connected half: resolves the strongest readiness track and product navigation. */
export const JobReadinessWidget = () => {
    const t = useTranslations("jobReadiness")
    const router = useRouter()
    const readiness = useQueryMyJobReadinessSwr()
    const track = readiness.data?.tracks[0]
    const state = resolveReadinessState(readiness.error !== undefined, readiness.data !== undefined, track !== undefined)
    const metrics: ReadonlyArray<JobReadinessMetric> | undefined = track === undefined ? undefined : [
        { id: "capstone", label: t("metric.capstone"), score: track.capstoneScore ?? undefined, scoreLabel: track.capstoneScore === null ? "—" : `${track.capstoneScore}%` },
        { id: "interview", label: t("metric.interview"), score: track.interviewScore ?? undefined, scoreLabel: track.interviewScore === null ? "—" : `${track.interviewScore}%` },
        { id: "cv", label: t("metric.cv"), score: track.cvScore ?? undefined, scoreLabel: track.cvScore === null ? "—" : `${track.cvScore}%` },
    ]
    const percentile = readiness.data?.foundation.codingPercentile

    return (
        <JobReadinessWidgetBase
            state={state}
            props={{
                label: t("title"),
                emptyMessage: t("empty"),
                errorMessage: t("error"),
                retryLabel: t("retry"),
                courseTitle: track?.courseTitle,
                depthScore: track?.depthScore ?? undefined,
                depthScoreLabel: track?.depthScore === null || track?.depthScore === undefined ? undefined : `${track.depthScore}% · ${track.courseTitle}`,
                band: track?.band,
                bandLabel: track === undefined ? undefined : t(`band.${track.band}`),
                percentileLabel: percentile === null || percentile === undefined ? undefined : t("foundationPercentile", { percent: percentile }),
                metrics,
                actionLabel: t("action"),
            }}
            on={{
                retry: () => { void readiness.mutate() },
                act: () => router.push(track === undefined ? "/courses" : `/courses/${track.courseSlug}`),
            }}
        />
    )
}

export * from "./component"

/** Source-level tier marker for the connected dashboard block. */
