import { LAYOUTS } from "@/resources/visual-layouts"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { SuggestedUserRow, type SuggestedUserRowData } from "@/components/composites/SuggestedUserRow"
import { renderComposite, layoutNode, type ComponentProps } from "@/modules/types/layout"

/** Label and suggested identities drawn by the block. */
export type WhoToFollowData = SurfaceListCardData & { readonly users: ReadonlyArray<SuggestedUserRowData> }
/** Profile and follow journeys reported by suggested identities. */
export type WhoToFollowActions = { readonly [key: string]: (() => void) | undefined }
/** Props for the pure follow-suggestion block. */
export type WhoToFollowProps = { readonly state: "pending" | "hidden" | "ready"; readonly props: WhoToFollowData; readonly on?: WhoToFollowActions }

const COUNT = LAYOUTS["suggested-user-list"].children.user.restingCount
const SuggestedListView = ({ props, on, isLoading = false }: ComponentProps<WhoToFollowData, WhoToFollowActions>) => {
    const users = isLoading ? Array.from({ length: COUNT }, (_, index) => ({
        id: `resting-${index}`,
        followLabel: "",
        followingLabel: "",
    })) : props.users
    return <Grammar layout="suggested-user-list" render={layoutNode("suggested-user-list", {
        user: users.map((user) => renderComposite("suggested-user-row", {}, () => (
            <SuggestedUserRow props={user} on={{ open: on?.[`open:${user.id}`], follow: on?.[`follow:${user.id}`] }} isLoading={isLoading} />
        ))),
    })} />
}
const SuggestedList = layoutNode("suggested-user-list", SuggestedListView)

/** Draw the joined suggestion list while hiding settled absence. */
export const WhoToFollowBase = (input: WhoToFollowProps) => input.state === "hidden" ? null : (
    <SurfaceListCard layout="suggested-user-list" render={SuggestedList} props={input.props} on={input.on} isLoading={input.state === "pending"} />
)
/** Source-level ownership marker for the pure social block. */
