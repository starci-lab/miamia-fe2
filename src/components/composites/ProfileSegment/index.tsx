import { Grammar } from "@/components/branches/Grammar"
import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"

/** Resolved caption for one distribution segment. */
export type ProfileSegmentData = { readonly label?: string }
/** Settled input for one profile segment. */
export type ProfileSegmentProps = CompositeProps<ProfileSegmentData>

/** Draw one share inside a joined distribution run. */
export const ProfileSegment = ({ props, isLoading = false }: ProfileSegmentProps) => (
    <Grammar contract="profile-segment-piece" render={createGrammarNode("profile-segment-piece", {
        value: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.label, size: "xs", tone: "muted" }} isLoading={isLoading} />),
    })} />
)

/** Source-level tier marker. */
export const meta = { shape: "composite", world: "pure" } as const
