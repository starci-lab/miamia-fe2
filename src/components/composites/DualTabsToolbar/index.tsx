import { Grammar } from "@/components/layouts/Grammar"
import { ChoiceTabs, type ChoiceTabsData } from "@/components/leaves/ChoiceTabs"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

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
    <Grammar layout="dual-tabs-toolbar" render={layoutNode("dual-tabs-toolbar", {
        leading: renderLeaf("choice-tabs", {}, () => (
            <ChoiceTabs props={{ ...props.leading, variant: "primary" }} on={{ select: on?.selectLeading }} />
        )),
        trailing: renderLeaf("choice-tabs", {}, () => (
            <ChoiceTabs props={{ ...props.trailing, variant: "primary" }} on={{ select: on?.selectTrailing }} />
        )),
    })} />
)

/** Source-level tier marker for the pure composite. */
