import { LAYOUTS } from "@/resources/visual-layouts"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { UpcomingLivestreamRow, type UpcomingLivestreamRowData } from "@/components/composites/UpcomingLivestreamRow"
import { renderComposite, layoutNode, type ComponentProps } from "@/modules/types/layout"
/** Resolved frame and upcoming-session rows. */
export type UpcomingData = SurfaceListCardData & { readonly rows: ReadonlyArray<UpcomingLivestreamRowData>; readonly errorMessage?: string; readonly retryLabel?: string }
/** Retry and per-session navigation actions. */
export type UpcomingActions = { readonly [key: string]: (() => void) | undefined }
/** Situation-discriminated props for upcoming sessions. */
export type UpcomingProps = { readonly state: "pending" | "hidden" | "failed" | "ready"; readonly props: UpcomingData; readonly on?: UpcomingActions }
const COUNT = LAYOUTS["upcoming-livestream-list"].children.session.restingCount
const View = ({ props, on, isLoading = false }: ComponentProps<UpcomingData, UpcomingActions>) => { const rows = isLoading ? Array.from({ length: COUNT }, (_, i) => ({ id: `resting-${i}` })) : props.rows; return <Grammar layout="upcoming-livestream-list" render={layoutNode("upcoming-livestream-list", { session: rows.map((row) => renderComposite("upcoming-livestream-row", {}, () => <UpcomingLivestreamRow props={row} on={{ open: on?.[`open:${row.id}`] }} isLoading={isLoading} />)) })} /> }
const List = layoutNode("upcoming-livestream-list", View)
/** Draw upcoming sessions and their local request outcomes. */
export const UpcomingLivestreamCardBase = (input: UpcomingProps) => {
    if (input.state === "hidden") return null
    if (input.state === "failed") {
        return (
            <SurfaceCard
                props={{ label: input.props.label }}
                layout="empty-notice-card"
                render={layoutNode("empty-notice-card", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{ icon: "livestream", message: input.props.errorMessage ?? "", actionLabel: input.props.retryLabel }}
                            on={{ act: input.on?.retry }}
                        />
                    )),
                })}
            />
        )
    }
    return <SurfaceListCard layout="upcoming-livestream-list" render={List} props={input.props} on={input.on} isLoading={input.state === "pending"} />
}
/** Source-level ownership marker. */
