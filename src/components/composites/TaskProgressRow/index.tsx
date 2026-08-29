import { Text } from "@/components/leaves/Text"
import { Icon } from "@/components/leaves/Icon"
import type { CompositeProps } from "@/modules/types/layout"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** One read-only task row in a joined progress list. */
export type TaskProgressRowData = {
    readonly id: string
    readonly title?: string
    readonly fact?: string
    readonly isComplete?: boolean
}

/** Fixed leaf props for a task progress row. */
export type TaskProgressRowProps = CompositeProps<TaskProgressRowData>

/** Draw the fixed mark-title-fact row used by a SurfaceListCard task list. */
export const TaskProgressRow = ({ props, isLoading = false }: TaskProgressRowProps) => {
    const content = layoutNode("task-mark-title-fact-row", {
        mark: renderLeaf("icon", {}, () => <Icon props={{ name: props.isComplete === true ? "complete" : "pending", role: "leading" }} isLoading={isLoading} />),
        title: renderLeaf("text", {}, () => <Text props={{ content: props.title }} isLoading={isLoading} />),
        fact: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.fact, size: "xs" }} isLoading={isLoading} />),
    })
    return <Grammar layout="task-mark-title-fact-row" render={content} />
}

/** Source-level tier marker for the task row composition. */
