import { Grammar } from "@/components/layouts/Grammar"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** One public coding-standing figure and its qualifier. */
export type ProfileMetricData = { readonly value?: string, readonly label?: string }
/** Settled input for one profile metric. */
export type ProfileMetricProps = CompositeProps<ProfileMetricData>

/** Draw one fixed metric sentence. */
export const ProfileMetric = ({ props, isLoading = false }: ProfileMetricProps) => (
    <Grammar layout="profile-proof-metric" render={layoutNode("profile-proof-metric", {
        figure: renderLeaf("text", {}, () => <Text props={{ content: props.value, weight: "semibold" }} isLoading={isLoading} />),
        label: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.label, size: "xs", tone: "muted" }} isLoading={isLoading} />),
    })} />
)

/** Source-level tier marker. */
