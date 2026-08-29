import { Grammar } from "@/components/layouts/Grammar"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** Resolved caption for one distribution segment. */
export type ProfileSegmentData = { readonly label?: string }
/** Settled input for one profile segment. */
export type ProfileSegmentProps = CompositeProps<ProfileSegmentData>

/** Draw one share inside a joined distribution run. */
export const ProfileSegment = ({ props, isLoading = false }: ProfileSegmentProps) => (
    <Grammar layout="profile-segment-piece" render={layoutNode("profile-segment-piece", {
        value: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.label, size: "xs", tone: "muted" }} isLoading={isLoading} />),
    })} />
)

/** Source-level tier marker. */
