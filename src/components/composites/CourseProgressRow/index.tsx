import { PressableSurface } from "@/components/branches/PressableSurface"
import { Badge } from "@/components/leaves/Badge"
import { IconTile } from "@/components/leaves/IconTile"
import { Progress } from "@/components/leaves/Progress"
import { StatusDot, type StatusDotTone } from "@/components/leaves/StatusDot"
import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"

/** One semantic course-progress dimension. */
export type CourseProgressDimension = {
    readonly id: string
    readonly label: string
    readonly completed: number
    readonly total: number
    readonly percent: number
    readonly tone: StatusDotTone
}

/** Resolved data drawn by a course progress row. */
export type CourseProgressRowData = {
    readonly id: string
    readonly title?: string
    /** The course artwork drawn on the mark, when the course has any. */
    readonly cover?: string | null
    readonly percent?: number
    readonly percentLabel?: string
    readonly trialLabel?: string
    readonly isTrial?: boolean
    readonly isPending?: boolean
    readonly isDisabled?: boolean
    readonly dimensions: ReadonlyArray<CourseProgressDimension>
}
/** Journey reported by a course progress row. */
export type CourseProgressRowActions = { readonly open?: () => void }
/** Closed props for one course progress row. */
export type CourseProgressRowProps = CompositeProps<CourseProgressRowData, CourseProgressRowActions>

/** Draw one whole-row course destination with three inspectable progress dimensions. */
export const CourseProgressRow = ({ props, on, isLoading = false }: CourseProgressRowProps) => {
    const heading = createGrammarNode("course-progress-heading", {
        title: createLeafNode("text", { size: "md", weight: "semibold" }, () => (
            <Text props={{ content: props.title, size: "md", weight: "semibold", isPressLabel: true }} isLoading={isLoading} />
        )),
        ...(props.isTrial === true && !isLoading ? {
            trial: createLeafNode("badge", {}, () => <Badge props={{ content: props.trialLabel, tone: "warning" }} />),
        } : {}),
        percent: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: props.percentLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
        )),
    })
    const progress = createGrammarNode("segmented-progress-track", {
        segment: props.dimensions.map((dimension) => createLeafNode("progress", {}, () => (
            <Progress props={{ value: dimension.percent, label: dimension.label }} isLoading={isLoading} />
        ))),
    })
    const legend = createGrammarNode("progress-dimension-legend", {
        dimension: props.dimensions.map((dimension) => createGrammarNode("status-dot-with-label", {
            mark: createLeafNode("status-dot", {}, () => (
                <StatusDot props={{ tone: dimension.tone, label: dimension.label }} isLoading={isLoading} />
            )),
            label: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                <Text props={{ content: `${dimension.label} · ${dimension.completed}/${dimension.total}`, size: "xs", tone: "muted" }} isLoading={isLoading} />
            )),
        })),
    })
    const body = createGrammarNode("course-progress-body", { heading, progress, legend })
    const content = createGrammarNode("course-progress-row", {
        mark: createLeafNode("icon-tile", {}, () => (
            <IconTile props={{ icon: "course", image: props.cover, tone: "accent", size: "md" }} isLoading={isLoading} />
        )),
        body,
    })
    return <PressableSurface contract="course-progress-row" hover="label" render={content} label={props.title ?? "Course"} press={on?.open} disabled={isLoading || props.isPending === true || props.isDisabled === true} />
}

/** Source-level tier marker. */
export const meta = { shape: "composite", world: "pure" } as const
