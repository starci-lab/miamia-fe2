import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Avatar } from "@/components/leaves/Avatar"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Icon } from "@/components/leaves/Icon"
import { Text } from "@/components/leaves/Text"
import { CONTRACTS } from "@/components/contracts"
import {
    createCompositeNode,
    createGrammarNode,
    createGrammarProjection,
    createLeafNode,
    type ComponentProps,
} from "@/components/contracts/props"

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

const FINISHER_COUNT = CONTRACTS["weekly-challenge-finishers"].children.finisher.restingCount
type FinisherRowProps = ComponentProps<WeeklyChallengeFinisher>

type WeeklyChallengeFinisherListData = SurfaceListCardData & {
    readonly finishers: ReadonlyArray<WeeklyChallengeFinisher>
}

/** Draw only the repeated rows; SurfaceListCard owns their shared bounded surface. */
const WeeklyChallengeFinisherListContent = ({ props, isLoading = false }: ComponentProps<WeeklyChallengeFinisherListData>) => (
    <Grammar contract="weekly-challenge-finishers" render={createGrammarNode("weekly-challenge-finishers", {
        finisher: props.finishers.map((finisher) => createCompositeNode("weekly-challenge-finisher-row", {}, () => (
            <WeeklyChallengeFinisherRow props={finisher} isLoading={isLoading} />
        ))),
    })} />
)

const WeeklyChallengeFinisherList = createGrammarNode(
    "weekly-challenge-finishers",
    WeeklyChallengeFinisherListContent,
)

/** Legacy row: avatar, username and relative time. It is not a feature StatRow. */
const WeeklyChallengeFinisherRow = ({ props, isLoading = false }: FinisherRowProps) => (
    <Grammar contract="weekly-challenge-finisher-row" render={createGrammarNode("weekly-challenge-finisher-row", {
        avatar: createLeafNode("avatar", {}, () => <Avatar props={{ name: props.label, size: "sm" }} isLoading={isLoading} />),
        name: createLeafNode("text", {}, () => <Text props={{ content: props.label, size: "sm" }} isLoading={isLoading} />),
        passedAt: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.passedAtLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />),
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
                contract="empty-notice-card"
                render={createGrammarNode("empty-notice-card", {
                    notice: createCompositeNode("empty-notice", {}, () => (
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

    const title = createCompositeNode("weekly-challenge-title", {}, () => (
        <Grammar contract="weekly-challenge-title" render={createGrammarNode("weekly-challenge-title", {
            ...(isLoading ? {} : { glyph: createLeafNode("icon", {}, () => <Icon props={{ name: "practice", role: "leading" }} />) }),
            title: createLeafNode("text", {}, () => <Text props={{ content: input.props.title, size: "sm" }} isLoading={isLoading} />),
        })} />
    ))
    const renderAction = () => {
        if (isLoading) {
            return createLeafNode("button", {}, () => <Button props={{ label: input.props.actionLabel ?? "", size: "sm", variant: "primary" }} isLoading />)
        }
        if (input.props.claimed === true) {
            return createLeafNode("badge", {}, () => <Badge props={{ content: input.props.claimedLabel ?? "", tone: "success" }} />)
        }
        return createLeafNode("button", {}, () => <Button
            props={{ label: input.props.actionLabel ?? "", size: "sm", variant: "primary", isPending: input.props.isClaiming === true }}
            on={{ press: input.on?.act }}
        />)
    }
    const status = createCompositeNode("weekly-challenge-status", {}, () => (
        <Grammar contract="weekly-challenge-status" render={createGrammarNode("weekly-challenge-status", {
            endsIn: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: input.props.endsInLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />),
            action: renderAction(),
        })} />
    ))
    const finisherList = finishers.length === 0 ? undefined : createGrammarProjection(
        "weekly-challenge-finishers",
        () => (
            <SurfaceListCard
                contract="weekly-challenge-finishers"
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
            contract="weekly-challenge-card"
            isLoading={isLoading}
            render={createGrammarNode("weekly-challenge-card", {
                title,
                status,
                ...(finisherList === undefined ? {
                    passed: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                        <Text props={{ content: input.props.passedCountLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
                    )),
                } : {}),
                ...(finisherList === undefined ? {} : { finishers: finisherList }),
            })}
        />
    )
}

/** Source-level tier marker for the pure dashboard block. */
export const meta = { world: "pure", domain: "dashboard" } as const
