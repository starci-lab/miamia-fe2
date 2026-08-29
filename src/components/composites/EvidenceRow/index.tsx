import { PressableSurface } from "@/components/branches/PressableSurface"
import { Grammar } from "@/components/layouts/Grammar"
import { Badge } from "@/components/leaves/Badge"
import { Icon } from "@/components/leaves/Icon"
import { Text } from "@/components/leaves/Text"
import type { CompositeProps } from "@/modules/types/layout"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** One reusable evidence row after product meaning and copy are resolved by its block. */
export type EvidenceRowData = {
    readonly title?: string
    readonly subtitle?: string
    readonly fact?: string
    readonly factTone?: "neutral" | "accent" | "success" | "warning" | "danger"
    readonly isPressable?: boolean
}

/** Evidence-row interaction. */
export type EvidenceRowActions = { readonly press?: () => void }

/** Props for the closed evidence row. */
export type EvidenceRowProps = CompositeProps<EvidenceRowData, EvidenceRowActions>

/** Draw one proof title, qualifier and trailing fact with optional whole-row navigation. */
export const EvidenceRow = ({ props, on, isLoading = false }: EvidenceRowProps) => {
    const content = layoutNode("evidence-title-subtitle-fact-row", {
        identity: layoutNode("evidence-title-over-subtitle", {
            title: renderLeaf("text", { size: "sm", weight: "semibold" }, () => (
                <Text props={{ content: props.title, size: "sm", weight: "semibold" }} isLoading={isLoading} />
            )),
            ...(props.subtitle === undefined ? {} : {
                subtitle: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                    <Text props={{ content: props.subtitle, size: "xs" }} isLoading={isLoading} />
                )),
            }),
        }),
        ...(props.fact === undefined ? {} : {
            fact: renderLeaf("badge", {}, () => (
                <Badge props={{ content: props.fact, tone: props.factTone }} isLoading={isLoading} />
            )),
        }),
        ...(props.isPressable === true ? {
            disclosure: renderLeaf("icon", {}, () => <Icon props={{ name: "disclosure", role: "chip" }} />),
        } : {}),
    })
    return props.isPressable === true ? (
        <PressableSurface layout="evidence-title-subtitle-fact-row" render={content} label={props.title ?? ""} press={on?.press} />
    ) : (
        <Grammar layout="evidence-title-subtitle-fact-row" render={content} />
    )
}

/** Source-level marker for the pure evidence composite. */
