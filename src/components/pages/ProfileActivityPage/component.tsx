import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { ActivityFeedBase, type ActivityFeedProps } from "@/components/blocks/dashboard/ActivityFeed/component"
import { ProfileAchievement } from "@/components/composites/ProfileAchievement"
import { renderComposite, layoutNode, layoutContent } from "@/modules/types/layout"
import type { ProfileAchievement as ProfileAchievementData } from "@/modules/api/graphql/queries/types/profile-evidence"

/** Independently settled achievement and timeline states. */
export type ProfileActivityPageProps = {
    readonly achievementState: "pending" | "ready" | "error"
    readonly achievements: ReadonlyArray<ProfileAchievementData>
    readonly feed: ActivityFeedProps
}

const Achievements = ({ achievementState, achievements }: Pick<ProfileActivityPageProps, "achievementState" | "achievements">) => {
    const items = achievementState === "pending" ? Array.from({ length: 3 }, (_, index): ProfileAchievementData => ({ slug: String(index), name: "", earned: true, currentValue: 0, threshold: 0 })) : achievements.filter((item) => item.earned)
    return <SurfaceCard props={{ label: "Earned achievements", isFrameless: true }} layout="profile-achievement-grid" render={layoutNode("profile-achievement-grid", {
        achievement: items.map((item) => renderComposite("profile-achievement", {}, () => <ProfileAchievement props={{ name: item.name, rarity: item.rarityPercent == null ? item.tierReached ?? "Earned" : `${item.tierReached ?? "Earned"} · ${item.rarityPercent}%` }} isLoading={achievementState === "pending"} />)),
    })} />
}

const Activity = ({ feed }: Pick<ProfileActivityPageProps, "feed">) => <SurfaceCard props={{ label: "Activity", isFrameless: true }} layout="activity-feed-result" render={layoutContent("activity-feed-result", () => <ActivityFeedBase {...feed} />)} />

/** Preserve legacy order: earned achievement proof before day-grouped chronological activity. */
export const ProfileActivityPageBase = (input: ProfileActivityPageProps) => <Grammar layout="profile-main" render={layoutNode("profile-main", {
    section: [
        layoutContent("label-row-over-card", () => <Achievements {...input} />),
        layoutContent("label-row-over-card", () => <Activity {...input} />),
    ],
})} />

/** Source-level tier marker. */
