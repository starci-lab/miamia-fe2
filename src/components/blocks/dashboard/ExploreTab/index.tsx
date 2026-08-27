import { Grammar } from "@/components/branches/Grammar"
import { FeedExplorer } from "@/components/blocks/dashboard/FeedExplorer"
import { WhoToFollow } from "@/components/blocks/dashboard/WhoToFollow"
import { createGrammarNode, createGrammarProjection } from "@/components/contracts/props"

/** Explore preserves legacy order and independent connected-block lifetimes. */
export const ExploreTab = () => (
    <Grammar contract="explore-main" render={createGrammarNode("explore-main", {
        feed: createGrammarProjection("feed-explorer", () => <FeedExplorer />),
        suggestions: createGrammarProjection("suggested-user-list", () => <WhoToFollow />),
    })} />
)

/** Source-level ownership marker for the pure dashboard block. */
export const meta = { world: "pure", domain: "dashboard" } as const
