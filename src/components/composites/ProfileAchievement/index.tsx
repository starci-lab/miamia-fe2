import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { IconTile } from "@/components/leaves/IconTile"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** One earned achievement name and rarity fact. */
export type ProfileAchievementData = { readonly name?: string, readonly rarity?: string }
/** Settled input for one achievement tile. */
export type ProfileAchievementProps = CompositeProps<ProfileAchievementData>

/** Draw one earned-proof tile. */
export const ProfileAchievement = ({ props, isLoading = false }: ProfileAchievementProps) => (
    <SurfaceCard layout="profile-achievement-card" render={layoutNode("profile-achievement-card", {
        mark: renderLeaf("icon-tile", {}, () => <IconTile props={{ icon: "reward", tone: "accent", size: "md" }} isLoading={isLoading} />),
        name: renderLeaf("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.name, size: "sm", weight: "semibold" }} isLoading={isLoading} />),
        rarity: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.rarity, size: "xs", tone: "muted" }} isLoading={isLoading} />),
    })} />
)

/** Source-level tier marker. */
