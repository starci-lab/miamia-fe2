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

/** Resolved global standing and ranked rows. */
export type TopLearnersData = {
    readonly label: string
    readonly seeMoreLabel?: string
    readonly standing: LeaderboardStandingRowData
    readonly rows: ReadonlyArray<RankedUserRowData>
    readonly emptyMessage?: string
    readonly errorMessage?: string
    readonly retryLabel?: string
}

/** Retry, navigation and follow actions. */
export type TopLearnersActions = {
    readonly [key: string]: (() => void) | undefined
}

/** Situation-discriminated global-leaderboard props. */
export type TopLearnersProps = {
    readonly state: "pending" | "empty" | "failed" | "ready"
    readonly props: TopLearnersData
    readonly on?: TopLearnersActions
}

type TopLearnersListData = SurfaceListCardData & {
    readonly rows: ReadonlyArray<RankedUserRowData>
}

type TopLearnersListActions = {
    readonly [key: string]: (() => void) | undefined
}

const ROW_COUNT = LAYOUTS["ranked-user-list"].children.user.restingCount

const TopLearnersListContentView = ({ props, on, isLoading = false }: ComponentProps<TopLearnersListData, TopLearnersListActions>) => (
    <Grammar layout="ranked-user-list" render={layoutNode("ranked-user-list", {
        user: props.rows.map((row) => renderComposite("ranked-user-row", {}, () => (
            <RankedUserRow
                props={row}
                on={{ open: on?.[`open:${row.id}`], follow: on?.[`follow:${row.id}`] }}
                isLoading={isLoading}
            />
        ))),
    })} />
)

const TopLearnersListContent = layoutNode("ranked-user-list", TopLearnersListContentView)

/** Draw the global leaderboard and local follow outcomes. */
export const TopLearnersBase = (input: TopLearnersProps) => {
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
            followLabel: "",
        }))
        : input.props.rows
    const list = layoutContent("ranked-user-list", () => (
        <SurfaceListCard
            layout="ranked-user-list"
            render={TopLearnersListContent}
            props={{
                label: input.props.label,
                rows,
                isNested: true,
                isLabelHidden: true,
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
