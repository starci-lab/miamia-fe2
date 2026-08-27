import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { LabelledProgressRow, type LabelledProgressRowData } from "@/components/composites/LabelledProgressRow"
import { StatRow } from "@/components/composites/StatRow"
import { createCompositeNode, createGrammarNode } from "@/components/contracts/props"

/** Settled facts for one challenge/practice skill snapshot. */
export type SkillSnapshotProps = { readonly label: string, readonly totalLabel: string, readonly totalValue?: string, readonly rows: ReadonlyArray<LabelledProgressRowData>, readonly stateMessage?: string, readonly isLoading?: boolean }

/** Shared anatomy only: one headline fact followed by difficulty/language progress peers. */
export const SkillSnapshot = ({ label, totalLabel, totalValue, rows, stateMessage, isLoading = false }: SkillSnapshotProps) => (
    <SurfaceCard props={{ label }} contract="stacked-peer-controls" render={createGrammarNode("stacked-peer-controls", {
        control: stateMessage && !isLoading
            ? [createCompositeNode("stat-row", {}, () => <StatRow props={{ icon: "practice", label: stateMessage }} />)]
            : [
                createCompositeNode("stat-row", {}, () => <StatRow isLoading={isLoading} props={{ icon: "practice", label: totalLabel, value: totalValue }} />),
                ...rows.map((row) => createCompositeNode("labelled-progress-row", {}, () => <LabelledProgressRow isLoading={isLoading} props={row} />)),
            ],
    })} />
)
