import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { ContinueLearning } from "@/components/blocks/dashboard/ContinueLearning"
import { QuickActions } from "@/components/blocks/dashboard/QuickActions"
import { IdentityRail } from "@/components/blocks/dashboard/IdentityRail"
import { DailyQuest } from "@/components/blocks/dashboard/DailyQuest"
import { StreakStrip } from "@/components/blocks/dashboard/StreakStrip"
import { WeeklyGoals } from "@/components/blocks/dashboard/WeeklyGoals"
import { JobReadinessWidget } from "@/components/blocks/dashboard/JobReadinessWidget"
import { WeeklyChallengeCard } from "@/components/blocks/dashboard/WeeklyChallengeCard"
import { OverviewContributions } from "@/components/blocks/dashboard/OverviewContributions"
import { ChangelogList } from "@/components/blocks/dashboard/ChangelogList"
import { ExploreTab } from "@/components/blocks/dashboard/ExploreTab"
import { CoursesTab } from "@/components/blocks/dashboard/CoursesTab"
import { CommunityTab } from "@/components/blocks/dashboard/CommunityTab"
import { createCompositeNode, createGrammarNode, createGrammarProjection } from "@/components/contracts/props"

/**
 * PAGE - `DashboardPage`, presentational half.
 *
 * IT OWNS NO REQUEST. Every figure on screen belongs to a block that fetches it. What it owns is
 * its block reading order. Session access is settled by the connected half before this Grammar is
 * mounted, so no signed-out dashboard arrangement exists here.
 *
 * THE LEGACY OVERVIEW IS THE PRODUCT CONTRACT. Refactoring may change who fetches, who assembles,
 * and how the Grammar is type-checked; it may not silently remove a product section. Each overview
 * block therefore keeps the legacy reading order and owns its own settled loading, empty, failed,
 * and ready shapes.
 */

/** Data required by the dashboard Grammar. */
export type DashboardPageData = {
    /** The panel selected by the navbar's original `?tab=` contract. */
    readonly selectedTab: string
    readonly unavailableMessage: string
}

/** Props for {@link DashboardPageBase}. */
export type DashboardPageProps = {
    readonly props: DashboardPageData
}

/**
 * Render the dashboard.
 *
 * @param input - {@link DashboardPageProps}
 */
export const DashboardPageBase = (input: DashboardPageProps) => {
    /**
     * WHO THE READER IS COMES FIRST, WHERE THEY MIGHT GO COMES LAST. The rail is read top-down on
     * arrival, and standing is the thing a reader checks every visit; the shortcuts are the thing
     * they reach for once they have decided to move. Putting the destinations above the standing
     * makes the column answer a question nobody asked yet.
     */
    const rail = createGrammarNode("dashboard-rail", {
        section: [
            createGrammarProjection("stacked-stat-rows", () => <IdentityRail />),
            createGrammarProjection("label-row-over-card", () => <QuickActions />),
        ],
    })

    const resolveMain = () => {
        if (input.props.selectedTab === "explore") {
            return createGrammarNode("dashboard-main", {
                section: [createGrammarProjection("explore-main", () => <ExploreTab />)],
            })
        }
        if (input.props.selectedTab === "courses") {
            return createGrammarProjection("dashboard-tab-main", () => <CoursesTab />)
        }
        if (input.props.selectedTab === "community") {
            return createGrammarProjection("dashboard-tab-main", () => <CommunityTab />)
        }
        if (input.props.selectedTab === "overview") {
            return createGrammarNode("dashboard-main", {
                section: [
                    createGrammarProjection("label-row-over-card", () => <ContinueLearning />),
                    createGrammarProjection("label-row-over-card", () => <DailyQuest />),
                    createGrammarProjection("label-row-over-card", () => <StreakStrip />),
                    createGrammarProjection("label-row-over-card", () => <WeeklyGoals />),
                    createGrammarProjection("label-row-over-card", () => <JobReadinessWidget />),
                    createGrammarProjection("label-row-over-card", () => <WeeklyChallengeCard />),
                    createGrammarProjection("label-row-over-card", () => <OverviewContributions />),
                    createGrammarProjection("label-row-over-card", () => <ChangelogList />),
                ],
            })
        }
        return createGrammarProjection("centred-empty-notice", () => (
            <SurfaceCard contract="centred-empty-notice" render={createGrammarNode("centred-empty-notice", {
                notice: createCompositeNode("empty-notice", {}, () => (
                    <EmptyNotice props={{ icon: input.props.selectedTab === "community" ? "community" : "explore", message: input.props.unavailableMessage }} />
                )),
            })} />
        ))
    }
    const main = resolveMain()

    return (
        <Grammar
            contract="dashboard-rail-then-main"
            render={createGrammarNode("dashboard-rail-then-main", {
                rail,
                main,
            })}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { world: "pure", domain: "dashboard" } as const
