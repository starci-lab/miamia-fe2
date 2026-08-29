import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { StreakWeekRun } from "@/components/composites/StreakWeekRun"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Text } from "@/components/leaves/Text"
import type { DayCellData } from "@/components/leaves/DayCell"
import {
    renderComposite,
    layoutNode,
    renderLeaf,
} from "@/modules/types/layout"

/**
 * BLOCK - `StreakStrip`, presentational half.
 *
 * The last seven days as a run of columns, beside the production prompt or compact streak result.
 *
 * THE STATE PICKS THE Grammar, AND THAT IS ALL A STATE IS. `failed` draws a notice; `pending` and
 * `ready` draw the same card, one of them resting. Zero activity is DATA for that same week, not a
 * reason to replace seven days and their readout with a giant empty notice.
 *
 * `isLoading` IS WRITTEN HERE AND NOWHERE ABOVE. This is the seam: the block decides which Grammar a
 * situation deserves, and when the situation is "not settled yet" it picks the Grammar it would have
 * shown and hands it the flag.
 */

/** What the card carries in EVERY state - its name does not change while it loads. */
export type StreakStripFrame = {
    /** The already-resolved name of the region. */
    readonly label: string
}

/** The figure the week adds up to. */
/**
 * Props for {@link StreakStripBase}, discriminated by the situation.
 *
 * `state="empty"` carrying a week does not compile, and `state="ready"` without one does not
 * either - which is what "the data of the state it is in" means when the compiler holds it rather
 * than a comment.
 */
export type StreakStripProps =
    | {
        readonly state: "pending"
        readonly props: StreakStripFrame & { readonly message: string; readonly actionLabel: string }
    }
    | { readonly state: "failed"; readonly props: StreakStripFrame & { readonly message: string; readonly retryLabel: string } }
    | {
        readonly state: "ready"
        readonly props: StreakStripFrame & {
            readonly streak: number
            readonly record: string
            readonly days: ReadonlyArray<DayCellData>
            readonly current: string
            readonly emptyMessage: string
            readonly actionLabel: string
            readonly nudge: string
        }
    }

/** What the block reports. */
export type StreakStripActions = {
    /** Called when the reader asks for the week again after a failure. */
    readonly retry?: () => void
    /** Called when the reader starts content from the quiet-week prompt or today's nudge. */
    readonly learn?: () => void
}

/** The situation this surface is in, plus the actions it exposes. */
type StreakStripInput = StreakStripProps & { readonly on?: StreakStripActions }

/**
 * Render the strip.
 *
 * @param input - {@link StreakStripInput}
 */
export const StreakStripBase = (input: StreakStripInput) => {
    if (input.state === "failed") {
        return (
            <SurfaceCard props={{ label: input.props.label }} layout="empty-notice-card"
                render={layoutNode("empty-notice-card", { notice: renderComposite("empty-notice", {}, () => <EmptyNotice
                    props={{ icon: "streak", message: input.props.message, actionLabel: input.props.retryLabel }}
                    on={{ act: input.on?.retry }}
                />) })} />
        )
    }
    const isLoading = input.state === "pending"
    const days = input.state === "ready" ? input.props.days : undefined
    const hasActivity = input.state === "ready"
        && (input.props.streak > 0 || input.props.days.some((day) => day.active === true))
    const activeToday = input.state === "ready" && input.props.days.at(-1)?.active === true
    // Legacy keeps the settled Grammar's active-side skeleton while the weekly stats are pending.
    const showActiveCluster = isLoading || hasActivity
    const promptMessage = input.state === "ready" ? input.props.emptyMessage : input.props.message

    const outcome = showActiveCluster
        ? layoutNode("streak-active-summary", {
            current: renderLeaf("text", { size: "sm", weight: "medium" }, () => (
                <Text props={{ content: input.state === "ready" ? input.props.current : undefined, size: "sm", weight: "medium" }} isLoading={isLoading} />
            )),
            record: renderLeaf("badge", {}, () => (
                <Badge props={{ content: input.state === "ready" ? input.props.record : "", tone: "accent" }} isLoading={isLoading} />
            )),
        })
        : layoutNode("streak-empty-prompt", {
            message: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                <Text
                    props={{
                        content: promptMessage,
                        size: "sm",
                        tone: "muted",
                    }}
                    isLoading={isLoading}
                />
            )),
            action: renderLeaf("button", { size: "sm", variant: "primary" }, () => (
                <Button
                    props={{ label: input.props.actionLabel, size: "sm", variant: "primary" }}
                    on={{ press: input.on?.learn }}
                    isLoading={isLoading}
                />
            )),
        })

    return (
        <SurfaceCard
            props={{ label: input.props.label }}
            layout="streak-summary-card"
            render={layoutNode("streak-summary-card", {
                summary: layoutNode("streak-week-with-outcome", {
                    week: renderComposite("streak-week-run", {}, () => (
                        <StreakWeekRun
                            props={{ days }}
                            isLoading={isLoading}
                        />
                    )),
                    outcome,
                }),
                ...(hasActivity && !activeToday && input.state === "ready" ? {
                    nudge: layoutNode("streak-daily-nudge", {
                        message: renderLeaf("text", { size: "sm", weight: "medium" }, () => (
                            <Text props={{ content: input.props.nudge, size: "sm", weight: "medium" }} />
                        )),
                        action: renderLeaf("button", { size: "sm", variant: "primary" }, () => (
                            <Button
                                props={{ label: input.props.actionLabel, size: "sm", variant: "primary" }}
                                on={{ press: input.on?.learn }}
                            />
                        )),
                    }),
                } : {}),
            })}
            isLoading={isLoading}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
