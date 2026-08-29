import { Grammar } from "@/components/layouts/Grammar"
import { Badge } from "@/components/leaves/Badge"
import { LeagueTile } from "@/components/leaves/LeagueTile"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** Resolved viewer-standing summary. */
export type LeaderboardStandingRowData = {
    readonly rank?: number
    readonly rankLabel?: string
    readonly title?: string
    readonly subtitle?: string
    readonly fact?: string
}

/**
 * Draw the viewer standing above a ranked list.
 *
 * THE SENTENCE SITS AGAINST ITS MEDAL. The node used to distribute three slots with
 * `justify-between`, which reads correctly only while the optional trailing fact is present to
 * hold the far edge. With the fact absent the two survivors sprang apart and the standing line
 * drifted to the opposite margin from the rank it describes. The body now owns the spare width,
 * so the row reads the same whether or not a fact exists.
 */
export const LeaderboardStandingRow = ({ props, isLoading = false }: CompositeProps<LeaderboardStandingRowData>) => (
    <Grammar layout="leaderboard-standing-row" render={layoutNode("leaderboard-standing-row", {
        mark: renderLeaf("league-tile", {}, () => (
            <LeagueTile
                props={{ rank: props.rank, accessibleLabel: props.rankLabel }}
                isLoading={isLoading}
            />
        )),
        body: layoutNode("evidence-title-over-subtitle", {
            title: renderLeaf("text", { size: "sm", weight: "semibold" }, () => (
                <Text props={{ content: props.title, size: "sm", weight: "semibold" }} isLoading={isLoading} />
            )),
            subtitle: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                <Text props={{ content: props.subtitle, size: "xs", tone: "muted" }} isLoading={isLoading} />
            )),
        }),
        ...(props.fact === undefined ? {} : {
            fact: renderLeaf("badge", {}, () => <Badge props={{ content: props.fact, tone: "warning" }} />),
        }),
    })} />
)

/** Source-level tier marker. */
