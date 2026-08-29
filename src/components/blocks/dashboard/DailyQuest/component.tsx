import { SurfaceCard } from "@/components/branches/SurfaceCard"
import {
    SurfaceListCard,
    type SurfaceListCardActions,
} from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { TaskProgressRow } from "@/components/composites/TaskProgressRow"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { LAYOUTS } from "@/resources/visual-layouts"
import type { LabelledProgressRowData } from "@/components/composites/LabelledProgressRow"
import {
    renderComposite,
    layoutNode,
    type ComponentProps,
} from "@/modules/types/layout"

/**
 * BLOCK - `DailyQuest`, presentational half.
 *
 * Today's tasks, and what finishing them is worth.
 *
 * THE STATE PICKS THE Grammar, AND THAT IS ALL A STATE IS. `claimable` grows a control that the other
 * situations do not have, and `claimed` replaces the offer with a fact - three different trees.
 * `pending` and `open` draw the same one, with `pending` resting. If a situation did not change
 * the Grammar it would be props.
 *
 * THE CONTROL IS ABSENT, NOT DISABLED, until the day is done. A greyed-out claim button invites a
 * reader to press it and learn nothing; the reward line above says what it is for, and the button
 * appears when there is something to take.
 */

/** What the card carries in EVERY state - its name does not change while it loads. */
export type DailyQuestFrame = {
    /** The already-resolved name of the region. */
    readonly label: string
}

/** The tasks, already turned into words and figures. */
export type DailyQuestBody = {
    /** One row per task, in the server's own order. */
    readonly tasks: ReadonlyArray<LabelledProgressRowData>
    /** What the day is worth, as a sentence. */
    readonly rewardLine: string
}

/** Props for {@link DailyQuestBase}, discriminated by the situation. */
export type DailyQuestProps =
    | { readonly state: "pending"; readonly props: DailyQuestFrame }
    | { readonly state: "empty"; readonly props: DailyQuestFrame & { readonly message: string } }
    | {
        readonly state: "failed"
        readonly props: DailyQuestFrame & { readonly message: string; readonly retryLabel: string }
    }
    | { readonly state: "open"; readonly props: DailyQuestFrame & DailyQuestBody }
    | {
        readonly state: "claimable"
        readonly props: DailyQuestFrame & DailyQuestBody & { readonly claimLabel: string }
    }
    | {
        readonly state: "claimed"
        readonly props: DailyQuestFrame & DailyQuestBody & { readonly claimedLine: string }
    }

/** What the block reports. */
export type DailyQuestActions = {
    /** Called when the reader asks for the day again after a failure. */
    readonly retry?: () => void
    /** Called when the reader collects the day's reward. */
    readonly claim?: () => void
}

/** Runtime props consumed by the named daily-quest layout component. */
export type DailyQuestContentData = {
    /** The already-resolved section name read by the surface host. */
    readonly label: string
    /** The whole-list result drawn below the joined surface. */
    readonly description?: string
    /** The whole-list action label drawn below the joined surface. */
    readonly actionLabel?: string
    /** Rows in server order; empty while the layout's resting count owns the shape. */
    readonly tasks: ReadonlyArray<LabelledProgressRowData>
}

/** Fixed component input for {@link DailyQuestContent}. */
export type DailyQuestContentProps = ComponentProps<DailyQuestContentData, SurfaceListCardActions>

/** How many copies the layout requires while the repeated slot is resting. */
const RESTING_COUNT = LAYOUTS["marked-row-list"].children.row.restingCount

/** Turn daily-quest props into the repeated leaf slot required by the layout. */
const DailyQuestContentView = ({ props, isLoading = false }: DailyQuestContentProps) => {
    const tasks: ReadonlyArray<LabelledProgressRowData> = isLoading
        ? Array.from({ length: RESTING_COUNT }, (_, index) => ({
            id: `resting-${index}`,
        }))
        : props.tasks

    return (
        <Grammar
            layout="marked-row-list"
            render={layoutNode("marked-row-list", {
                row: tasks.map((task) => renderComposite("task-progress-row", {}, () => (
                    <TaskProgressRow
                        props={{
                            id: task.id,
                            title: task.title,
                            fact: task.percentText,
                            isComplete: task.percent === 100,
                        }}
                        isLoading={isLoading}
                    />
                ))),
            })}
        />
    )
}

/** Stable component type branded for the exact list layout it implements. */
const DailyQuestContent = layoutNode("marked-row-list", DailyQuestContentView)

/** The situation this surface is in, plus the actions it exposes. */
type DailyQuestInput = DailyQuestProps & { readonly on?: DailyQuestActions }

/** The description line under the quest list: the reward, the claimed line, or nothing. */
const deriveDescription = (input: DailyQuestInput): string | undefined => {
    if (input.state === "open") return input.props.rewardLine
    if (input.state === "claimed") return input.props.claimedLine
    return undefined
}

/**
 * Render the day's quest.
 *
 * @param input - {@link DailyQuestInput}
 */
export const DailyQuestBase = (input: DailyQuestInput) => {
    if (input.state === "failed") {
        return (
            <SurfaceCard props={{ label: input.props.label }} layout="empty-notice-card"
                render={layoutNode("empty-notice-card", { notice: renderComposite("empty-notice", {}, () => <EmptyNotice
                    props={{ icon: "review", message: input.props.message, actionLabel: input.props.retryLabel }}
                    on={{ act: input.on?.retry }}
                />) })} />
        )
    }
    if (input.state === "empty") {
        return (
            <SurfaceCard props={{ label: input.props.label }} layout="empty-notice-card"
                render={layoutNode("empty-notice-card", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice props={{ icon: "review", message: input.props.message }} />
                    )),
                })} />
        )
    }

    const isLoading = input.state === "pending"
    return (
        <SurfaceListCard
            props={{
                label: input.props.label,
                description: deriveDescription(input),
                actionLabel: input.state === "claimable" ? input.props.claimLabel : undefined,
                tasks: input.state === "pending" ? [] : input.props.tasks,
            }}
            on={{ act: input.on?.claim }}
            layout="marked-row-list"
            render={DailyQuestContent}
            isLoading={isLoading}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
