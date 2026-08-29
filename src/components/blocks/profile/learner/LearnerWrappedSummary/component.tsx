import { Grammar } from "@/components/layouts/Grammar"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { ProfileMetric } from "@/components/composites/ProfileMetric"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { renderComposite, layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"

/** Stateful Wrapped layout consumed by the pure summary block. */
export type LearnerWrappedSummaryProps = {
    readonly state: "pending" | "locked" | "unlocked" | "failed"
    readonly props: {
        readonly title: string
        readonly metricLabels: readonly [string, string, string, string]
        readonly metricValues?: readonly [string, string, string, string]
        readonly notice: string
        readonly actionLabel?: string
    }
    readonly on?: { readonly action?: () => void }
}

/** Renders a verified Wrapped period or its explicit lock/failure state. */
export const LearnerWrappedSummary = (input: LearnerWrappedSummaryProps) => {
    const showMetrics = input.state === "pending" || input.state === "unlocked"
    return (
        <SurfaceCard layout="learner-wrapped-summary" render={layoutNode("learner-wrapped-summary", {
            heading: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
            ...(showMetrics ? { metrics: layoutNode("profile-metric-ribbon", { metric: input.props.metricLabels.map((label, index) => renderComposite("profile-metric", {}, () => <ProfileMetric props={{ label, value: input.props.metricValues?.[index] }} isLoading={input.state === "pending"} />)) }) } : {}),
            ...(showMetrics ? {} : { notice: layoutContent("centred-empty-notice", () => <Grammar layout="centred-empty-notice" render={layoutNode("centred-empty-notice", { notice: renderComposite("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.notice }} />) })} />) }),
            ...(input.props.actionLabel === undefined ? {} : { action: renderLeaf("button", {}, () => <Button props={{ label: input.props.actionLabel ?? "", variant: "secondary", size: "sm" }} on={{ press: input.on?.action }} />) }),
        })} />
    )
}

/** Source-level block marker. */
