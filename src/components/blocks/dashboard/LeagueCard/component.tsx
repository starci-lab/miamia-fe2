import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { LeaderboardStandingRow, type LeaderboardStandingRowData } from "@/components/composites/LeaderboardStandingRow"
import { RankedUserRow, type RankedUserRowData } from "@/components/composites/RankedUserRow"
import { LAYOUTS } from "@/resources/visual-layouts"
import {
    renderComposite,
    layoutNode,
    layoutContent,
    type ComponentProps,
} from "@/modules/types/layout"

/** Resolved weekly standing and cohort rows. */
export type LeagueCardData = {
    readonly label: string
    readonly seeMoreLabel?: string
    readonly standing: LeaderboardStandingRowData
    readonly rows: ReadonlyArray<RankedUserRowData>
    readonly emptyMessage?: string
    readonly errorMessage?: string
    readonly retryLabel?: string
}

/** Retry, leaderboard and profile actions. */
export type LeagueCardActions = {
    readonly [key: string]: (() => void) | undefined
}

/** Situation-discriminated weekly-league props. */
export type LeagueCardProps = {
    readonly state: "pending" | "empty" | "failed" | "ready"
    readonly props: LeagueCardData
    readonly on?: LeagueCardActions
}

type LeagueListData = SurfaceListCardData & {
    readonly rows: ReadonlyArray<RankedUserRowData>
}

type LeagueListActions = {
    readonly [key: string]: (() => void) | undefined
}

const ROW_COUNT = LAYOUTS["ranked-user-list"].children.user.restingCount

const LeagueListContentView = ({ props, on, isLoading = false }: ComponentProps<LeagueListData, LeagueListActions>) => (
    <Grammar layout="ranked-user-list" render={layoutNode("ranked-user-list", {
        user: props.rows.map((row) => renderComposite("ranked-user-row", {}, () => (
            <RankedUserRow
                props={row}
                on={{ open: on?.[`open:${row.id}`] }}
                isLoading={isLoading}
            />
        ))),
    })} />
)

const LeagueListContent = layoutNode("ranked-user-list", LeagueListContentView)

/** Draw weekly league standing and local request outcomes. */
export const LeagueCardBase = (input: LeagueCardProps) => {
    if (input.state === "empty" || input.state === "failed") {
        const message = input.state === "empty" ? input.props.emptyMessage : input.props.errorMessage
        return (
            <SurfaceCard
                props={{ label: input.props.label }}
                layout="empty-notice-card"
                render={layoutNode("empty-notice-card", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{
                                icon: "league",
                                message: message ?? "",
                                actionLabel: input.state === "failed" ? input.props.retryLabel : undefined,
                            }}
                            on={{ act: input.on?.retry }}
                        />
                    )),
                })}
            />
        )
    }

    const isLoading = input.state === "pending"
    const rows: ReadonlyArray<RankedUserRowData> = isLoading
        ? Array.from({ length: ROW_COUNT }, (_unused, index) => ({
            id: `resting-${index + 1}`,
            movementLabel: "",
        }))
        : input.props.rows
    const list = layoutContent("ranked-user-list", () => (
        <SurfaceListCard
            layout="ranked-user-list"
            render={LeagueListContent}
            props={{
                label: input.props.label,
                rows,
                isNested: true,
                isLabelHidden: true,
                // Derived, not asserted: a hand-passed flag outlives the data that justified it,
                // and the list would then keep square corners for bands nobody is drawing.
                isVerdict: rows.some((row) => row.verdict !== undefined),
            }}
            on={input.on}
            isLoading={isLoading}
        />
    ))
    return (
        <SurfaceCard
            props={{ label: input.props.label, seeMoreLabel: input.props.seeMoreLabel }}
            on={{ seeMore: input.on?.seeMore }}
            layout="leaderboard-card"
            render={layoutNode("leaderboard-card", {
                standing: renderComposite("leaderboard-standing-row", {}, () => (
                    <LeaderboardStandingRow props={input.props.standing} isLoading={isLoading} />
                )),
                list,
            })}
            isLoading={isLoading}
        />
    )
}

/** Source-level ownership marker. */
