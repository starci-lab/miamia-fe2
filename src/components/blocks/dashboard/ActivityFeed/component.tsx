import { LAYOUTS } from "@/resources/visual-layouts"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { ActivityRow, type ActivityRowData } from "@/components/composites/ActivityRow"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, layoutContent, renderLeaf, type ComponentProps } from "@/modules/types/layout"
import type { ReactionType } from "@/modules/api/graphql/queries/types/reactions"

/** One local-calendar group in the activity stream. */
export type ActivityDayData = { readonly id: string; readonly label: string; readonly rows: ReadonlyArray<ActivityRowData> }
/** Settled day groups and result-state copy. */
export type ActivityFeedData = {
    readonly days: ReadonlyArray<ActivityDayData>
    readonly message: string
    readonly description?: string
    readonly actionLabel?: string
}
/** Row journeys and retry reported by the activity stream. */
export type ActivityFeedActions = { readonly [key: string]: ((reaction?: ReactionType | null) => void) | undefined }
/** Props for the pure activity-feed block. */
export type ActivityFeedProps = { readonly state: "pending" | "filteredEmpty" | "platformEmpty" | "failed" | "ready"; readonly props: ActivityFeedData; readonly on?: ActivityFeedActions }
type ActivityListData = SurfaceListCardData & { readonly rows: ReadonlyArray<ActivityRowData> }

const ROW_COUNT = LAYOUTS["activity-feed-list"].children.activity.restingCount
const ActivityListView = ({ props, on, isLoading = false }: ComponentProps<ActivityListData, ActivityFeedActions>) => {
    const rows = isLoading ? Array.from({ length: ROW_COUNT }, (_, index) => ({ id: `resting-${index}` })) : props.rows
    return <Grammar layout="activity-feed-list" render={layoutNode("activity-feed-list", {
        activity: rows.map((row) => renderComposite("activity-row", {}, () => (
            <ActivityRow props={row} on={{
                openActor: on?.[`actor:${row.id}`],
                openTarget: on?.[`target:${row.id}`],
                react: (type) => on?.[`react:${row.id}`]?.(type),
            }} isLoading={isLoading} />
        ))),
    })} />
}
const ActivityList = layoutNode("activity-feed-list", ActivityListView)

/** Draw local-day joined activity lists or one explicit result notice. */
export const ActivityFeedBase = (input: ActivityFeedProps) => {
    if (input.state === "filteredEmpty" || input.state === "platformEmpty" || input.state === "failed") {
        return <Grammar layout="activity-feed-result" render={layoutNode("activity-feed-result", {
            notice: layoutContent("empty-notice-card", () => (
                <SurfaceCard props={{ label: "" }} layout="empty-notice-card" render={layoutNode("empty-notice-card", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice props={{
                            message: input.props.message,
                            description: input.props.description,
                            actionLabel: input.props.actionLabel,
                        }} on={{ act: input.on?.resultAction }} />
                    )),
                })} />
            )),
        })} />
    }
    const days = input.state === "pending"
        ? Array.from({ length: 2 }, (_, index) => ({ id: `resting-day-${index}`, label: "", rows: [] }))
        : input.props.days
    return <Grammar layout="activity-feed-result" render={layoutNode("activity-feed-result", {
        day: days.map((day) => layoutContent("activity-day-group", () => (
            <Grammar layout="activity-day-group" render={layoutNode("activity-day-group", {
                subtitle: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: day.label, size: "sm", tone: "muted" }} isLoading={input.state === "pending"} />
                )),
                list: layoutContent("activity-feed-list", () => (
                    <SurfaceListCard
                        layout="activity-feed-list"
                        render={ActivityList}
                        props={{ label: day.label, rows: day.rows, isLabelHidden: true }}
                        on={input.on}
                        isLoading={input.state === "pending"}
                    />
                )),
            })} />
        ))),
    })} />
}
/** Source-level ownership marker for the pure social block. */
