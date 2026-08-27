import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Podium, type PodiumEntryData } from "@/components/composites/Podium"
import { RankedUserRow, type RankedUserRowData } from "@/components/composites/RankedUserRow"
import { StandingHeroCard } from "@/components/composites/StandingHeroCard"
import { Breadcrumbs, type BreadcrumbStep } from "@/components/leaves/Breadcrumbs"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import {
    createGrammarNode,
    createGrammarProjection,
    createLeafNode,
    type BlockProps,
    type ComponentProps,
} from "@/components/contracts/props"

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
    <Grammar contract="ranked-user-list" render={createGrammarProjection("ranked-user-list", () => (
        <>
            {props.rows.map((row) => <RankedUserRow key={row.id} props={row} isLoading={isLoading} />)}
            {props.ellipsisLabel === undefined ? null : (
                <Grammar contract="ranked-user-ellipsis-row" render={createGrammarNode("ranked-user-ellipsis-row", {
                    label: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                        <Text props={{ content: props.ellipsisLabel, size: "xs", tone: "muted" }} />
                    )),
                })} />
            )}
            {props.selfRow === undefined ? null : <RankedUserRow props={props.selfRow} />}
        </>
    ))} />
)

const CourseLeaderboardListContent = createGrammarNode("ranked-user-list", CourseLeaderboardList)

/** Pure course leaderboard with category, viewer standing, snapshot time and honest data states. */
export const CourseLeaderboardPageBase = (input: CourseLeaderboardPageProps) => {
    const isLoading = input.state === "pending"
    const board = input.props.board
    const header = createGrammarNode("page-header-stack", {
        trail: createLeafNode("breadcrumbs", {}, () => (
            <Breadcrumbs props={{ steps: input.props.trail, label: input.props.title }} on={{ course: input.on?.course }} />
        )),
        title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
    })
    const category = createGrammarNode("scope-switch-row", {
        tabs: createLeafNode("choice-tabs", {}, () => (
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
            <Grammar contract="league-page-column" render={createGrammarNode("league-page-column", {
                header,
                scope: category,
                board: createGrammarProjection("league-board-stack", () => (
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
        <Grammar contract="league-page-column" render={createGrammarNode("league-page-column", {
            header,
            scope: category,
            board: createGrammarNode("league-board-stack", {
                hero: createGrammarProjection("standing-hero-card", () => (
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
                podium: createGrammarProjection("podium", () => (
                    <Podium
                        props={{
                            entries: board.podium,
                            meLabel: input.props.meLabel,
                            anonymousLabel: input.props.anonymousLabel,
                        }}
                        isLoading={isLoading}
                    />
                )),
                list: createGrammarProjection("ranked-user-followable-list", () => (
                    <SurfaceListCard
                        contract="ranked-user-list"
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
export const meta = { world: "pure", domain: "learn" } as const
