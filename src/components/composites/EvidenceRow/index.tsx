import { PressableSurface } from "@/components/branches/PressableSurface"
import { Grammar } from "@/components/branches/Grammar"
import { Badge } from "@/components/leaves/Badge"
import { Icon } from "@/components/leaves/Icon"
import { Text } from "@/components/leaves/Text"
import type { CompositeProps } from "@/components/contracts/props"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

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
    const content = createGrammarNode("evidence-title-subtitle-fact-row", {
        identity: createGrammarNode("evidence-title-over-subtitle", {
            title: createLeafNode("text", { size: "sm", weight: "semibold" }, () => (
                <Text props={{ content: props.title, size: "sm", weight: "semibold" }} isLoading={isLoading} />
            )),
            ...(props.subtitle === undefined ? {} : {
                subtitle: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                    <Text props={{ content: props.subtitle, size: "xs" }} isLoading={isLoading} />
                )),
            }),
        }),
        ...(props.fact === undefined ? {} : {
            fact: createLeafNode("badge", {}, () => (
                <Badge props={{ content: props.fact, tone: props.factTone }} isLoading={isLoading} />
            )),
        }),
        ...(props.isPressable === true ? {
            disclosure: createLeafNode("icon", {}, () => <Icon props={{ name: "disclosure", role: "chip" }} />),
        } : {}),
    })
    return props.isPressable === true ? (
        <PressableSurface contract="evidence-title-subtitle-fact-row" render={content} label={props.title ?? ""} press={on?.press} />
    ) : (
        <Grammar contract="evidence-title-subtitle-fact-row" render={content} />
    )
}

/** Source-level marker for the pure evidence composite. */
export const meta = { shape: "composite", world: "pure" } as const
