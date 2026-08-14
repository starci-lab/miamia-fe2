import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { defineContractComponent, defineLeafComponent, type CompositeProps } from "@/components/contracts/props"

/** Holds catalogue content and entitlement state for one exam paper. */
export type ExamPaperCardData = {
    readonly id: string
    readonly title: string
    readonly description?: string
    readonly level?: string
    readonly questionCount: number
    readonly levelLabel: string
    readonly questionCountLabel: string
    readonly badgeLabel?: string
    readonly actionLabel: string
    readonly isLocked: boolean
}
/** Defines actions available from an exam-paper card. */
export type ExamPaperCardActions = { readonly open?: () => void }
/** Defines the pure exam-paper card contract. */
export type ExamPaperCardProps = CompositeProps<ExamPaperCardData, ExamPaperCardActions>

/** Renders an exam-paper catalogue card. */
export const ExamPaperCard = ({ props, on, isLoading = false }: ExamPaperCardProps) => (
    <SurfaceCard
        contract="exam-paper-card"
        render={defineContractComponent("exam-paper-card", {
            ...(props.badgeLabel === undefined ? {} : {
                badge: defineLeafComponent("badge", {}, () => <Badge props={{ content: props.badgeLabel, tone: props.isLocked ? "warning" : "success" }} isLoading={isLoading} />),
            }),
            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: props.title, level: 3 }} isLoading={isLoading} />),
            ...(props.description === undefined ? {} : {
                description: defineLeafComponent("text", {}, () => <Text props={{ content: props.description, size: "sm", tone: "muted" }} isLoading={isLoading} />),
            }),
            fact: [
                defineContractComponent("label-with-muted-fact-row", {
                    label: defineLeafComponent("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.levelLabel, size: "sm", weight: "semibold" }} />),
                    fact: defineLeafComponent("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.level ?? "—", size: "xs" }} isLoading={isLoading} />),
                }),
                defineContractComponent("label-with-muted-fact-row", {
                    label: defineLeafComponent("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.questionCountLabel, size: "sm", weight: "semibold" }} />),
                    fact: defineLeafComponent("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: String(props.questionCount), size: "xs" }} isLoading={isLoading} />),
                }),
            ],
            action: defineLeafComponent("button", {}, () => <Button props={{ label: props.actionLabel, variant: props.isLocked ? "secondary" : "primary", icon: props.isLocked ? "account" : "review" }} on={{ press: on?.open }} isLoading={isLoading} />),
        })}
        isLoading={isLoading}
    />
)

/** Declares the component architecture metadata. */
export const meta = { shape: "composite", world: "pure", domain: "exam" } as const
