import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { LabelledProgressRow, type LabelledProgressRowData } from "@/components/composites/LabelledProgressRow"
import { StatRow } from "@/components/composites/StatRow"
import { renderComposite, layoutNode } from "@/modules/types/layout"

/** Settled facts for one challenge/practice skill snapshot. */
export type SkillSnapshotProps = { readonly label: string, readonly totalLabel: string, readonly totalValue?: string, readonly rows: ReadonlyArray<LabelledProgressRowData>, readonly stateMessage?: string, readonly isLoading?: boolean }

/** Shared anatomy only: one headline fact followed by difficulty/language progress peers. */
export const SkillSnapshot = ({ label, totalLabel, totalValue, rows, stateMessage, isLoading = false }: SkillSnapshotProps) => (
    <SurfaceCard props={{ label }} layout="stacked-peer-controls" render={layoutNode("stacked-peer-controls", {
        control: stateMessage && !isLoading
            ? [renderComposite("stat-row", {}, () => <StatRow props={{ icon: "practice", label: stateMessage }} />)]
            : [
                renderComposite("stat-row", {}, () => <StatRow isLoading={isLoading} props={{ icon: "practice", label: totalLabel, value: totalValue }} />),
                ...rows.map((row) => renderComposite("labelled-progress-row", {}, () => <LabelledProgressRow isLoading={isLoading} props={row} />)),
            ],
    })} />
)
