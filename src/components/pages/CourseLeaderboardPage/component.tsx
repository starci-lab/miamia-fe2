import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Podium, type PodiumEntryData } from "@/components/composites/Podium"
import { RankedUserRow, type RankedUserRowData } from "@/components/composites/RankedUserRow"
import { StandingHeroCard } from "@/components/composites/StandingHeroCard"
import { Breadcrumbs, type BreadcrumbStep } from "@/components/leaves/Breadcrumbs"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import {
    layoutNode,
    layoutContent,
    renderLeaf,
    type BlockProps,
    type ComponentProps,
} from "@/modules/types/layout"

/** The four backend-derived score lenses supported by the course board. */
export type CourseLeaderboardCategory = "total" | "challenge" | "reading" | "milestone"

type CourseLeaderboardCategoryOption = {
    readonly id: CourseLeaderboardCategory
    readonly label: string
}

type CourseLeaderboardBoard = {
    readonly standing: {
        readonly rank?: number
        readonly rankLabel?: string
        readonly title: string
        readonly subtitle: string
        readonly fact?: string
    }
    readonly podium: ReadonlyArray<PodiumEntryData>
    readonly rows: ReadonlyArray<RankedUserRowData>
    readonly selfRow?: RankedUserRowData
    readonly ellipsisLabel?: string
}

/** Resolved course-board copy, categories and ranked rows consumed by the pure page. */
export type CourseLeaderboardPageData = {
    readonly title: string
    readonly trail: ReadonlyArray<BreadcrumbStep>
    readonly categoryLabel: string
    readonly selectedCategory: CourseLeaderboardCategory
    readonly categories: ReadonlyArray<CourseLeaderboardCategoryOption>
    readonly board: CourseLeaderboardBoard
    readonly listLabel: string
    readonly meLabel: string
    readonly anonymousLabel: string
    readonly climbLabel: string
    readonly updatedAtLabel?: string
    readonly emptyMessage: string
    readonly errorMessage: string
    readonly retryLabel: string
}

type CourseLeaderboardPageActions = {
    readonly selectCategory?: (category: string) => void
    readonly climb?: () => void
    readonly retry?: () => void
    readonly course?: () => void
}

type CourseLeaderboardPageProps = BlockProps<
    "pending" | "ready" | "empty" | "failed",
    CourseLeaderboardPageData
> & { readonly on?: CourseLeaderboardPageActions }

type CourseLeaderboardListData = SurfaceListCardData & {
    readonly rows: ReadonlyArray<RankedUserRowData>
    readonly selfRow?: RankedUserRowData
    readonly ellipsisLabel?: string
}

const CourseLeaderboardList = ({ props, isLoading = false }: ComponentProps<CourseLeaderboardListData>) => (
    <Grammar layout="ranked-user-list" render={layoutContent("ranked-user-list", () => (
        <>
            {props.rows.map((row) => <RankedUserRow key={row.id} props={row} isLoading={isLoading} />)}
            {props.ellipsisLabel === undefined ? null : (
                <Grammar layout="ranked-user-ellipsis-row" render={layoutNode("ranked-user-ellipsis-row", {
                    label: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                        <Text props={{ content: props.ellipsisLabel, size: "xs", tone: "muted" }} />
                    )),
                })} />
            )}
            {props.selfRow === undefined ? null : <RankedUserRow props={props.selfRow} />}
        </>
    ))} />
)

const CourseLeaderboardListContent = layoutNode("ranked-user-list", CourseLeaderboardList)

/** Pure course leaderboard with category, viewer standing, snapshot time and honest data states. */
export const CourseLeaderboardPageBase = (input: CourseLeaderboardPageProps) => {
    const isLoading = input.state === "pending"
    const board = input.props.board
    const header = layoutNode("page-header-stack", {
        trail: renderLeaf("breadcrumbs", {}, () => (
            <Breadcrumbs props={{ steps: input.props.trail, label: input.props.title }} on={{ course: input.on?.course }} />
        )),
        title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
    })
    const category = layoutNode("scope-switch-row", {
        tabs: renderLeaf("choice-tabs", {}, () => (
            <ChoiceTabs
                props={{
                    label: input.props.categoryLabel,
                    selectedKey: input.props.selectedCategory,
                    variant: "primary",
                    tabs: input.props.categories,
                }}
                on={{ select: input.on?.selectCategory }}
            />
        )),
    })

    if (input.state === "empty" || input.state === "failed") {
        return (
            <Grammar layout="league-page-column" render={layoutNode("league-page-column", {
                header,
                scope: category,
                board: layoutContent("league-board-stack", () => (
                    <EmptyNotice
                        props={{
                            icon: "league",
                            message: input.state === "empty" ? input.props.emptyMessage : input.props.errorMessage,
                            actionLabel: input.state === "failed" ? input.props.retryLabel : input.props.climbLabel,
                        }}
                        on={{ act: input.state === "failed" ? input.on?.retry : input.on?.climb }}
                    />
                )),
            })} />
        )
    }

    return (
        <Grammar layout="league-page-column" render={layoutNode("league-page-column", {
            header,
            scope: category,
            board: layoutNode("league-board-stack", {
                hero: layoutContent("standing-hero-card", () => (
                    <StandingHeroCard
                        props={{
                            standing: board.standing,
                            ctaLabel: input.props.climbLabel,
                            progressAccessibleLabel: input.props.title,
                        }}
                        on={{ cta: input.on?.climb }}
                        isLoading={isLoading}
                    />
                )),
                podium: layoutContent("podium", () => (
                    <Podium
                        props={{
                            entries: board.podium,
                            meLabel: input.props.meLabel,
                            anonymousLabel: input.props.anonymousLabel,
                        }}
                        isLoading={isLoading}
                    />
                )),
                list: layoutContent("ranked-user-followable-list", () => (
                    <SurfaceListCard
                        layout="ranked-user-list"
                        render={CourseLeaderboardListContent}
                        props={{
                            label: input.props.listLabel,
                            fact: input.props.updatedAtLabel,
                            rows: board.rows,
                            selfRow: board.selfRow,
                            ellipsisLabel: board.ellipsisLabel,
                        }}
                        isLoading={isLoading}
                    />
                )),
            }),
        })} />
    )
}

/** Source-level ownership marker. */
