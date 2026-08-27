import { PressableSurface } from "@/components/branches/PressableSurface"
import { Badge } from "@/components/leaves/Badge"
import { IconTile } from "@/components/leaves/IconTile"
import { Text } from "@/components/leaves/Text"
import { TextLink } from "@/components/leaves/TextLink"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"

/**
 * COMPOSITE - `RecommendedCourseRow`: one suggested course, priced.
 *
 * IT CARRIES NO DESCRIPTION. A paragraph inside a row somebody is scanning is the part they skip,
 * and it pushed the price, the saving and the reason for the suggestion below the depth a reader
 * gives one row. The title says which course; the artwork says it faster.
 *
 * THE SAVING AND THE QUESTION ABOUT IT SHARE A LINE, the same `price-note-row` the catalog card
 * uses, so the two surfaces answer "why does it cost this" the same way rather than each inventing
 * an answer.
 */

/** Resolved commerce facts for one recommendation. */
export type RecommendedCourseRowData = {
    readonly id: string
    readonly title?: string
    /** The course artwork drawn on the mark, when the course has any. */
    readonly cover?: string | null
    readonly price?: string
    readonly originalPrice?: string
    readonly discount?: string
    /** What this price saves against the list price, already phrased. */
    readonly savings?: string
    /** The already-resolved label of the action that explains the price. */
    readonly priceDetailLabel?: string
    /** Why this course is being suggested at all. */
    readonly reason?: string
}

/** Journeys reported by a recommendation row. */
export type RecommendedCourseRowActions = {
    readonly open?: () => void
    /** Called when the reader asks why this course costs what it costs. */
    readonly openPriceDetail?: () => void
}

/**
 * Draw one whole-row recommended-course destination.
 *
 * @param input - {@link CompositeProps}
 */
export const RecommendedCourseRow = ({ props, on, isLoading = false }: CompositeProps<RecommendedCourseRowData, RecommendedCourseRowActions>) => {
    const price = createGrammarNode("price-discount-line", {
        price: createLeafNode("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.price, size: "sm", weight: "semibold" }} isLoading={isLoading} />),
        ...(props.originalPrice === undefined ? {} : { original: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.originalPrice, size: "xs", tone: "muted", isSuperseded: true }} isLoading={isLoading} />) }),
        ...(props.discount === undefined ? {} : { discount: createLeafNode("badge", {}, () => <Badge props={{ content: props.discount, tone: "success" }} />) }),
    })
    const body = createGrammarNode("recommended-course-body", {
        title: createLeafNode("text", { size: "md", weight: "semibold" }, () => (
            <Text props={{ content: props.title, size: "md", weight: "semibold", isPressLabel: true }} isLoading={isLoading} />
        )),
        price,
        ...(props.priceDetailLabel === undefined ? {} : {
            note: createGrammarNode("price-note-row", {
                ...(props.savings === undefined ? {} : {
                    fact: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.savings, size: "xs", tone: "muted" }} isLoading={isLoading} />),
                }),
                action: createLeafNode("text-link", { size: "xs" }, () => (
                    <TextLink props={{ label: props.priceDetailLabel ?? "", size: "xs" }} on={{ press: on?.openPriceDetail }} />
                )),
            }),
        }),
        ...(props.reason === undefined ? {} : { reason: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.reason, size: "xs", tone: "muted" }} />) }),
    })
    const content = createGrammarNode("recommended-course-row", {
        mark: createLeafNode("icon-tile", {}, () => (
            <IconTile props={{ icon: "course", image: props.cover, tone: "accent", size: "md" }} isLoading={isLoading} />
        )),
        body,
    })
    return <PressableSurface contract="recommended-course-row" hover="label" render={content} label={props.title ?? "Course"} press={on?.open} disabled={isLoading} />
}

/** Source-level tier marker. */
export const meta = { shape: "composite", world: "pure" } as const
