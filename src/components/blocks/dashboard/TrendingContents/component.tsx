import { LAYOUTS } from "@/resources/visual-layouts"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { TrendingContentRow, type TrendingContentRowData } from "@/components/composites/TrendingContentRow"
import { renderComposite, layoutNode, type ComponentProps } from "@/modules/types/layout"

/** Label and ranked content rows drawn by the trending block. */
export type TrendingContentsData = SurfaceListCardData & { readonly items: ReadonlyArray<TrendingContentRowData> }
/** Per-content navigation reported by the trending block. */
export type TrendingContentsActions = { readonly [key: string]: (() => void) | undefined }
/** Props for the pure trending-content block. */
export type TrendingContentsProps = { readonly state: "pending" | "hidden" | "ready"; readonly props: TrendingContentsData; readonly on?: TrendingContentsActions }

const COUNT = LAYOUTS["trending-content-list"].children.item.restingCount
const TrendingListView = ({ props, on, isLoading = false }: ComponentProps<TrendingContentsData, TrendingContentsActions>) => {
    const items = isLoading ? Array.from({ length: COUNT }, (_, index) => ({ id: `resting-${index}` })) : props.items
    return <Grammar layout="trending-content-list" render={layoutNode("trending-content-list", {
        item: items.map((item) => renderComposite("trending-content-row", {}, () => (
            <TrendingContentRow props={item} on={{ open: on?.[item.id] }} isLoading={isLoading} />
        ))),
    })} />
}
const TrendingList = layoutNode("trending-content-list", TrendingListView)

/** Draw the ranked joined list while hiding settled absence. */
export const TrendingContentsBase = (input: TrendingContentsProps) => input.state === "hidden" ? null : (
    <SurfaceListCard layout="trending-content-list" render={TrendingList} props={input.props} on={input.on} isLoading={input.state === "pending"} />
)
/** Source-level ownership marker for the pure discovery block. */
