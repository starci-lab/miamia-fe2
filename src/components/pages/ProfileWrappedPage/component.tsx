import { Grammar } from "@/components/branches/Grammar"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { LearnerWrappedSummary, type LearnerWrappedSummaryProps } from "@/components/blocks/profile/learner/LearnerWrappedSummary/component"
import { createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"
import type { WrappedPeriod } from "@/modules/api/graphql/queries/types/profile-learning"

/** Period selection and summary consumed by the pure Wrapped page. */
export type ProfileWrappedPageProps = {
    readonly props: { readonly period: WrappedPeriod; readonly periodLabel: string; readonly periods: ReadonlyArray<{ readonly id: WrappedPeriod; readonly label: string }>; readonly summary: LearnerWrappedSummaryProps }
    readonly on?: { readonly selectPeriod?: (period: WrappedPeriod) => void }
}

/** Pure full-page Wrapped period explorer. */
export const ProfileWrappedPageBase = (input: ProfileWrappedPageProps) => <Grammar contract="learner-wrapped-page" render={createGrammarNode("learner-wrapped-page", {
    period: createLeafNode("choice-tabs", {}, () => <ChoiceTabs props={{ label: input.props.periodLabel, selectedKey: input.props.period, variant: "primary", tabs: input.props.periods }} on={{ select: (key) => input.on?.selectPeriod?.(key as WrappedPeriod) }} />),
    summary: createGrammarProjection("learner-wrapped-summary", () => <LearnerWrappedSummary {...input.props.summary} />),
})} />

/** Source-level page marker. */
export const meta = { world: "pure", domain: "profile" } as const
