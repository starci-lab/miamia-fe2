import { Tree } from "@/components/branches/Tree"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { ProfileMetric } from "@/components/composites/ProfileMetric"
import { LabelledProgressRow } from "@/components/composites/LabelledProgressRow"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { defineCompositeComponent, defineContractComponent, defineContractProjection } from "@/components/contracts/props"

/** Stateful private-progress contract consumed by the pure snapshot block. */
export type LearnerProgressSnapshotProps = {
    readonly state: "pending" | "ready" | "failed"
    readonly props: {
        readonly title: string
        readonly metricLabels: readonly [string, string, string, string]
        readonly metricValues?: readonly [string, string, string, string]
        readonly levelLabel: string
        readonly levelPercent?: number
        readonly levelFact?: string
        readonly failedMessage: string
        readonly retryLabel: string
    }
    readonly on?: { readonly retry?: () => void }
}

/** Renders authenticated totals without exposing them to a visitor route. */
export const LearnerProgressSnapshot = (input: LearnerProgressSnapshotProps) => {
    const loading = input.state === "pending"
    const metrics = defineContractComponent("profile-metric-ribbon", {
        metric: input.props.metricLabels.map((label, index) => defineCompositeComponent("profile-metric", {}, () => (
            <ProfileMetric props={{ label, value: input.props.metricValues?.[index] }} isLoading={loading} />
        ))),
    })
    return (
        <SurfaceCard
            props={{ label: input.props.title }}
            contract="learner-progress-snapshot"
            render={defineContractComponent("learner-progress-snapshot", {
                metrics,
                level: defineCompositeComponent("labelled-progress-row", {}, () => (
                    <LabelledProgressRow props={{ id: "level", title: input.props.levelLabel, percent: input.props.levelPercent, percentText: input.props.levelFact }} isLoading={loading} />
                )),
                ...(input.state === "failed" ? { notice: defineContractProjection("centred-empty-notice", () => (
                    <Tree contract="centred-empty-notice" render={defineContractComponent("centred-empty-notice", { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.failedMessage, actionLabel: input.props.retryLabel }} on={{ act: input.on?.retry }} />) })} />
                )) } : {}),
            })}
        />
    )
}

/** Source-level block marker. */
export const meta = { shape: "block", world: "pure", domain: "profile" } as const
