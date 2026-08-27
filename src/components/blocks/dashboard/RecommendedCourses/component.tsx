import { CONTRACTS } from "@/components/contracts"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { RecommendedCourseRow, type RecommendedCourseRowData } from "@/components/composites/RecommendedCourseRow"
import { createCompositeNode, createGrammarNode, type ComponentProps } from "@/components/contracts/props"
/** Resolved frame and rows for course recommendations. */
export type RecommendedCoursesData = SurfaceListCardData & { readonly rows: ReadonlyArray<RecommendedCourseRowData>; readonly errorMessage?: string; readonly retryLabel?: string }
/** Retry and per-course navigation actions. */
export type RecommendedCoursesActions = { readonly [key: string]: (() => void) | undefined }
/** Situation-discriminated props for recommendations. */
export type RecommendedCoursesProps = { readonly state: "pending" | "hidden" | "failed" | "ready"; readonly props: RecommendedCoursesData; readonly on?: RecommendedCoursesActions }
const COUNT = CONTRACTS["recommended-course-list"].children.course.restingCount
const View = ({ props, on, isLoading = false }: ComponentProps<RecommendedCoursesData, RecommendedCoursesActions>) => { const rows = isLoading ? Array.from({ length: COUNT }, (_, i) => ({ id: `resting-${i}` })) : props.rows; return <Grammar contract="recommended-course-list" render={createGrammarNode("recommended-course-list", { course: rows.map((row) => createCompositeNode("recommended-course-row", {}, () => <RecommendedCourseRow props={row} on={{ open: on?.[`open:${row.id}`], openPriceDetail: on?.[`priceDetail:${row.id}`] }} isLoading={isLoading} />)) })} /> }
const List = createGrammarNode("recommended-course-list", View)
/** Draw recommendations and their local request outcomes. */
export const RecommendedCoursesBase = (input: RecommendedCoursesProps) => {
    if (input.state === "hidden") return null
    if (input.state === "failed") {
        return (
            <SurfaceCard
                props={{ label: input.props.label }}
                contract="empty-notice-card"
                render={createGrammarNode("empty-notice-card", {
                    notice: createCompositeNode("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{ icon: "course", message: input.props.errorMessage ?? "", actionLabel: input.props.retryLabel }}
                            on={{ act: input.on?.retry }}
                        />
                    )),
                })}
            />
        )
    }
    return <SurfaceListCard contract="recommended-course-list" render={List} props={input.props} on={input.on} isLoading={input.state === "pending"} />
}
/** Source-level ownership marker. */
export const meta = { world: "pure", domain: "courses" } as const
