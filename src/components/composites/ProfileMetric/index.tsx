import { Grammar } from "@/components/branches/Grammar"
import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"

/** One public coding-standing figure and its qualifier. */
export type ProfileMetricData = { readonly value?: string, readonly label?: string }
/** Settled input for one profile metric. */
export type ProfileMetricProps = CompositeProps<ProfileMetricData>

/** Draw one fixed metric sentence. */
export const ProfileMetric = ({ props, isLoading = false }: ProfileMetricProps) => (
    <Grammar contract="profile-proof-metric" render={createGrammarNode("profile-proof-metric", {
        figure: createLeafNode("text", {}, () => <Text props={{ content: props.value, weight: "semibold" }} isLoading={isLoading} />),
        label: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.label, size: "xs", tone: "muted" }} isLoading={isLoading} />),
    })} />
)

/** Source-level tier marker. */
export const meta = { shape: "composite", world: "pure" } as const
