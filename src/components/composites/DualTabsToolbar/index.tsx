import { Grammar } from "@/components/branches/Grammar"
import { ChoiceTabs, type ChoiceTabsData } from "@/components/leaves/ChoiceTabs"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"

/** Two controlled peer-choice axes sharing one toolbar row. */
export type DualTabsToolbarData = {
    readonly leading: ChoiceTabsData
    readonly trailing: ChoiceTabsData
}

/** Selection changes reported by the two axes. */
export type DualTabsToolbarActions = {
    readonly selectLeading?: (key: string) => void
    readonly selectTrailing?: (key: string) => void
}

/** Props for the closed two-axis toolbar arrangement. */
export type DualTabsToolbarProps = CompositeProps<DualTabsToolbarData, DualTabsToolbarActions>

/** Draw two primary peer-choice axes on the same toolbar. */
export const DualTabsToolbar = ({ props, on }: DualTabsToolbarProps) => (
    <Grammar contract="dual-tabs-toolbar" render={createGrammarNode("dual-tabs-toolbar", {
        leading: createLeafNode("choice-tabs", {}, () => (
            <ChoiceTabs props={{ ...props.leading, variant: "primary" }} on={{ select: on?.selectLeading }} />
        )),
        trailing: createLeafNode("choice-tabs", {}, () => (
            <ChoiceTabs props={{ ...props.trailing, variant: "primary" }} on={{ select: on?.selectTrailing }} />
        )),
    })} />
)

/** Source-level tier marker for the pure composite. */
export const meta = { shape: "composite", world: "pure" } as const
