import { Grammar } from "@/components/layouts/Grammar"
import { Text } from "@/components/leaves/Text"
import { TextLink } from "@/components/leaves/TextLink"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** Rank and title for one trending result. */
export type TrendingContentRowData = {
    readonly id: string
    readonly rank?: string
    readonly title?: string
    readonly isTopRank?: boolean
}
/** Journey reported when the reader opens the ranked result. */
export type TrendingContentRowActions = { readonly open?: () => void }
/** Props for the closed ranked-result composition. */
export type TrendingContentRowProps = CompositeProps<TrendingContentRowData, TrendingContentRowActions>

/** Draw one ranked actionable title; the first three ranks retain the legacy accent treatment. */
export const TrendingContentRow = ({ props, on, isLoading = false }: TrendingContentRowProps) => (
    <Grammar layout="rank-title-row" render={layoutNode("rank-title-row", {
        rank: renderLeaf("text", { size: "sm", weight: "semibold" }, () => (
            <Text props={{ content: props.rank, size: "sm", weight: "semibold", tone: props.isTopRank === true ? "accent" : "muted" }} isLoading={isLoading} />
        )),
        title: renderLeaf("text-link", { size: "sm" }, () => (
            <TextLink props={{ label: props.title ?? "", size: "sm" }} on={{ press: on?.open }} />
        )),
    })} />
)

/** Source-level tier marker for the pure ranked-result composition. */
