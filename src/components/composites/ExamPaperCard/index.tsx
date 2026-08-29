import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

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
/** Defines the pure exam-paper card layout. */
export type ExamPaperCardProps = CompositeProps<ExamPaperCardData, ExamPaperCardActions>

/** Renders an exam-paper catalogue card. */
export const ExamPaperCard = ({ props, on, isLoading = false }: ExamPaperCardProps) => (
    <SurfaceCard
        layout="exam-paper-card"
        render={layoutNode("exam-paper-card", {
            ...(props.badgeLabel === undefined ? {} : {
                badge: renderLeaf("badge", {}, () => <Badge props={{ content: props.badgeLabel, tone: props.isLocked ? "warning" : "success" }} isLoading={isLoading} />),
            }),
            title: renderLeaf("heading", {}, () => <Heading props={{ content: props.title, level: 3 }} isLoading={isLoading} />),
            ...(props.description === undefined ? {} : {
                description: renderLeaf("text", {}, () => <Text props={{ content: props.description, size: "sm", tone: "muted" }} isLoading={isLoading} />),
            }),
            fact: [
                layoutNode("label-with-muted-fact-row", {
                    label: renderLeaf("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.levelLabel, size: "sm", weight: "semibold" }} />),
                    fact: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.level ?? "—", size: "xs" }} isLoading={isLoading} />),
                }),
                layoutNode("label-with-muted-fact-row", {
                    label: renderLeaf("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.questionCountLabel, size: "sm", weight: "semibold" }} />),
                    fact: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: String(props.questionCount), size: "xs" }} isLoading={isLoading} />),
                }),
            ],
            action: renderLeaf("button", {}, () => <Button props={{ label: props.actionLabel, variant: props.isLocked ? "secondary" : "primary", icon: props.isLocked ? "account" : "review" }} on={{ press: on?.open }} isLoading={isLoading} />),
        })}
        isLoading={isLoading}
    />
)

/** Declares the component architecture metadata. */
