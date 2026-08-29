import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Avatar } from "@/components/leaves/Avatar"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Icon } from "@/components/leaves/Icon"
import { Text } from "@/components/leaves/Text"
import { LAYOUTS } from "@/resources/visual-layouts"
import {
    renderComposite,
    layoutNode,
    layoutContent,
    renderLeaf,
    type ComponentProps,
} from "@/modules/types/layout"

/** One learner shown in the weekly challenge's compact finisher list. */
export type WeeklyChallengeFinisher = {
    readonly id: string
    readonly label: string
    readonly passedAtLabel: string
}

/** Resolved challenge copy, status and finishers drawn by the block. */
export type WeeklyChallengeCardData = {
    readonly label: string
    readonly emptyMessage: string
    readonly errorMessage: string
    readonly retryLabel: string
    readonly title?: string
    readonly endsInLabel?: string
    readonly passedCountLabel?: string
    readonly claimedLabel?: string
    readonly viewerPassed?: boolean
    readonly claimed?: boolean
    readonly actionLabel?: string
    readonly isClaiming?: boolean
    readonly finishers?: ReadonlyArray<WeeklyChallengeFinisher>
}

/** Product outcomes reported by the weekly-challenge block. */
export type WeeklyChallengeCardActions = {
    readonly act?: () => void
    readonly retry?: () => void
}

/** State, data and actions accepted by the pure weekly-challenge block. */
export type WeeklyChallengeCardProps = {
    readonly state: "pending" | "empty" | "failed" | "ready"
    readonly props: WeeklyChallengeCardData
    readonly on?: WeeklyChallengeCardActions
}

const FINISHER_COUNT = LAYOUTS["weekly-challenge-finishers"].children.finisher.restingCount
type FinisherRowProps = ComponentProps<WeeklyChallengeFinisher>

type WeeklyChallengeFinisherListData = SurfaceListCardData & {
    readonly finishers: ReadonlyArray<WeeklyChallengeFinisher>
}

/** Draw only the repeated rows; SurfaceListCard owns their shared bounded surface. */
const WeeklyChallengeFinisherListContent = ({ props, isLoading = false }: ComponentProps<WeeklyChallengeFinisherListData>) => (
    <Grammar layout="weekly-challenge-finishers" render={layoutNode("weekly-challenge-finishers", {
        finisher: props.finishers.map((finisher) => renderComposite("weekly-challenge-finisher-row", {}, () => (
            <WeeklyChallengeFinisherRow props={finisher} isLoading={isLoading} />
        ))),
    })} />
)

const WeeklyChallengeFinisherList = layoutNode(
    "weekly-challenge-finishers",
    WeeklyChallengeFinisherListContent,
)

/** Legacy row: avatar, username and relative time. It is not a feature StatRow. */
const WeeklyChallengeFinisherRow = ({ props, isLoading = false }: FinisherRowProps) => (
    <Grammar layout="weekly-challenge-finisher-row" render={layoutNode("weekly-challenge-finisher-row", {
        avatar: renderLeaf("avatar", {}, () => <Avatar props={{ name: props.label, size: "sm" }} isLoading={isLoading} />),
        name: renderLeaf("text", {}, () => <Text props={{ content: props.label, size: "sm" }} isLoading={isLoading} />),
        passedAt: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.passedAtLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />),
    })} />
)

/** Draw the featured weekly challenge without owning its query or routes. */
export const WeeklyChallengeCardBase = (input: WeeklyChallengeCardProps) => {
    const isLoading = input.state === "pending"
    if (input.state === "failed" || input.state === "empty") {
        const failed = input.state === "failed"
        return (
            <SurfaceCard
                props={{ label: input.props.label }}
                layout="empty-notice-card"
                render={layoutNode("empty-notice-card", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{
                                icon: "practice",
                                message: failed ? input.props.errorMessage : input.props.emptyMessage,
                                actionLabel: failed ? input.props.retryLabel : input.props.actionLabel,
                            }}
                            on={{ act: failed ? input.on?.retry : input.on?.act }}
                        />
                    )),
                })}
            />
        )
    }

    const finishers = input.state === "pending"
        ? Array.from({ length: FINISHER_COUNT }, (_unused, index) => ({ id: `resting-${index + 1}`, label: "", passedAtLabel: "" }))
        : (input.props.finishers ?? [])

    const title = renderComposite("weekly-challenge-title", {}, () => (
        <Grammar layout="weekly-challenge-title" render={layoutNode("weekly-challenge-title", {
            ...(isLoading ? {} : { glyph: renderLeaf("icon", {}, () => <Icon props={{ name: "practice", role: "leading" }} />) }),
            title: renderLeaf("text", {}, () => <Text props={{ content: input.props.title, size: "sm" }} isLoading={isLoading} />),
        })} />
    ))
    const renderAction = () => {
        if (isLoading) {
            return renderLeaf("button", {}, () => <Button props={{ label: input.props.actionLabel ?? "", size: "sm", variant: "primary" }} isLoading />)
        }
        if (input.props.claimed === true) {
            return renderLeaf("badge", {}, () => <Badge props={{ content: input.props.claimedLabel ?? "", tone: "success" }} />)
        }
        return renderLeaf("button", {}, () => <Button
            props={{ label: input.props.actionLabel ?? "", size: "sm", variant: "primary", isPending: input.props.isClaiming === true }}
            on={{ press: input.on?.act }}
        />)
    }
    const status = renderComposite("weekly-challenge-status", {}, () => (
        <Grammar layout="weekly-challenge-status" render={layoutNode("weekly-challenge-status", {
            endsIn: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: input.props.endsInLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />),
            action: renderAction(),
        })} />
    ))
    const finisherList = finishers.length === 0 ? undefined : layoutContent(
        "weekly-challenge-finishers",
        () => (
            <SurfaceListCard
                layout="weekly-challenge-finishers"
                render={WeeklyChallengeFinisherList}
                props={{
                    label: input.props.passedCountLabel ?? "",
                    finishers,
                    isNested: true,
                }}
                isLoading={isLoading}
            />
        ),
    )

    return (
        <SurfaceCard
            props={{ label: input.props.label }}
            layout="weekly-challenge-card"
            isLoading={isLoading}
            render={layoutNode("weekly-challenge-card", {
                title,
                status,
                ...(finisherList === undefined ? {
                    passed: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                        <Text props={{ content: input.props.passedCountLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
                    )),
                } : {}),
                ...(finisherList === undefined ? {} : { finishers: finisherList }),
            })}
        />
    )
}

/** Source-level tier marker for the pure dashboard block. */
