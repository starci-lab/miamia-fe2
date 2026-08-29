import { LAYOUTS } from "@/resources/visual-layouts"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { CourseProgressRow, type CourseProgressRowData } from "@/components/composites/CourseProgressRow"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { renderComposite, layoutNode, type ComponentProps } from "@/modules/types/layout"

/** Resolved frame and rows for enrolled-course progress. */
export type MyCoursesProgressData = SurfaceListCardData & {
    readonly rows: ReadonlyArray<CourseProgressRowData>
    readonly emptyMessage?: string
    readonly errorMessage?: string
    readonly retryLabel?: string
}
/** Retry and per-course navigation actions. */
export type MyCoursesProgressActions = { readonly [key: string]: (() => void) | undefined }
/** Situation-discriminated props for enrolled-course progress. */
export type MyCoursesProgressProps = {
    readonly state: "pending" | "empty" | "failed" | "ready"
    readonly props: MyCoursesProgressData
    readonly on?: MyCoursesProgressActions
}

const COUNT = LAYOUTS["course-progress-list"].children.course.restingCount
const CourseListView = ({ props, on, isLoading = false }: ComponentProps<MyCoursesProgressData, MyCoursesProgressActions>) => {
    const rows = isLoading ? Array.from({ length: COUNT }, (_, index): CourseProgressRowData => ({
        id: `resting-${index}`,
        dimensions: [
            { id: "content", label: "", completed: 0, total: 0, percent: 0, tone: "accent" },
            { id: "challenge", label: "", completed: 0, total: 0, percent: 0, tone: "success" },
            { id: "milestone", label: "", completed: 0, total: 0, percent: 0, tone: "warning" },
        ],
    })) : props.rows
    return <Grammar layout="course-progress-list" render={layoutNode("course-progress-list", {
        course: rows.map((row) => renderComposite("course-progress-row", {}, () => (
            <CourseProgressRow props={row} on={{ open: on?.[`open:${row.id}`] }} isLoading={isLoading} />
        ))),
    })} />
}
const CourseList = layoutNode("course-progress-list", CourseListView)

/** Draw enrolled-course progress, keeping every request outcome local to the block. */
export const MyCoursesProgressBase = (input: MyCoursesProgressProps) => {
    if (input.state === "empty" || input.state === "failed") {
        const message = input.state === "empty" ? input.props.emptyMessage : input.props.errorMessage
        return <SurfaceCard props={{ label: input.props.label }} layout="empty-notice-card" render={layoutNode("empty-notice-card", {
            notice: renderComposite("empty-notice", {}, () => <EmptyNotice
                props={{ icon: "course", message: message ?? "", actionLabel: input.props.retryLabel }}
                on={{ act: input.on?.retry }}
            />),
        })} />
    }
    return <SurfaceListCard
        layout="course-progress-list"
        render={CourseList}
        props={input.props}
        on={input.on}
        isLoading={input.state === "pending"}
    />
}

/** Source-level ownership marker. */
