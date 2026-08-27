import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { QuickActionsList } from "@/components/leaves/QuickActionsList"
import type { QuickActionItem } from "@/components/leaves/QuickActionsList"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

/** Resolved quick-action data for the pure block half. */
export type QuickActionsData = {
    readonly label: string
    readonly items: ReadonlyArray<QuickActionItem>
}

/** Actions reported by the pure quick-action block half. */
export type QuickActionsActions = {
    readonly activate?: (id: string) => void
}

/** Props for the pure quick-action block half. */
export type QuickActionsProps = {
    readonly props: QuickActionsData
    readonly on?: QuickActionsActions
}

/** Render the quick-action rail from resolved copy and destinations. */
export const QuickActionsBase = (input: QuickActionsProps) => (
    <SurfaceCard
        props={{ label: input.props.label, isFrameless: true }}
        contract="stacked-peer-controls"
        render={createGrammarNode("stacked-peer-controls", {
            control: [createLeafNode("quick-actions-list", {}, () => (
                <QuickActionsList
                    props={{ label: input.props.label, items: input.props.items }}
                    on={input.on}
                />
            ))],
        })}
    />
)

/** Source-level tier marker for the presentational block half. */
export const meta = { world: "pure", domain: "shell" } as const
