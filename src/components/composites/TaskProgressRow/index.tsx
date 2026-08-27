import { Text } from "@/components/leaves/Text"
import { Icon } from "@/components/leaves/Icon"
import type { CompositeProps } from "@/components/contracts/props"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

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
    const content = createGrammarNode("task-mark-title-fact-row", {
        mark: createLeafNode("icon", {}, () => <Icon props={{ name: props.isComplete === true ? "complete" : "pending", role: "leading" }} isLoading={isLoading} />),
        title: createLeafNode("text", {}, () => <Text props={{ content: props.title }} isLoading={isLoading} />),
        fact: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.fact, size: "xs" }} isLoading={isLoading} />),
    })
    return <Grammar contract="task-mark-title-fact-row" render={content} />
}

/** Source-level tier marker for the task row composition. */
export const meta = { shape: "composite", world: "pure" } as const
