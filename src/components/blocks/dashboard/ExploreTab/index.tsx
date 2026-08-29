import { Grammar } from "@/components/layouts/Grammar"
import { FeedExplorer } from "@/components/blocks/dashboard/FeedExplorer"
import { WhoToFollow } from "@/components/blocks/dashboard/WhoToFollow"
import { layoutNode, layoutContent } from "@/modules/types/layout"

/** Explore preserves legacy order and independent connected-block lifetimes. */
export const ExploreTab = () => (
    <Grammar layout="explore-main" render={layoutNode("explore-main", {
        feed: layoutContent("feed-explorer", () => <FeedExplorer />),
        suggestions: layoutContent("suggested-user-list", () => <WhoToFollow />),
    })} />
)

/** Source-level ownership marker for the pure dashboard block. */
