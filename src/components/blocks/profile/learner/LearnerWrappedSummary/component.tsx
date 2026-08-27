import { Grammar } from "@/components/branches/Grammar"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { ProfileMetric } from "@/components/composites/ProfileMetric"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { createCompositeNode, createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"

/** Stateful Wrapped contract consumed by the pure summary block. */
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
        <SurfaceCard contract="learner-wrapped-summary" render={createGrammarNode("learner-wrapped-summary", {
            heading: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
            ...(showMetrics ? { metrics: createGrammarNode("profile-metric-ribbon", { metric: input.props.metricLabels.map((label, index) => createCompositeNode("profile-metric", {}, () => <ProfileMetric props={{ label, value: input.props.metricValues?.[index] }} isLoading={input.state === "pending"} />)) }) } : {}),
            ...(showMetrics ? {} : { notice: createGrammarProjection("centred-empty-notice", () => <Grammar contract="centred-empty-notice" render={createGrammarNode("centred-empty-notice", { notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.notice }} />) })} />) }),
            ...(input.props.actionLabel === undefined ? {} : { action: createLeafNode("button", {}, () => <Button props={{ label: input.props.actionLabel ?? "", variant: "secondary", size: "sm" }} on={{ press: input.on?.action }} />) }),
        })} />
    )
}

/** Source-level block marker. */
export const meta = { shape: "block", world: "pure", domain: "profile" } as const
