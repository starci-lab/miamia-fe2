import { Badge, type BadgeTone } from "@/components/leaves/Badge"
import { Grammar } from "@/components/branches/Grammar"
import { Text } from "@/components/leaves/Text"
import { TextLink } from "@/components/leaves/TextLink"
import {
    createGrammarNode,
    createLeafNode,
    type CompositeProps,
} from "@/components/contracts/props"

/** One dated product update rendered inside a joined changelog list. */
export type ChangelogEntryRowData = {
    readonly id: string
    readonly dateLabel?: string
    readonly categoryLabel?: string
    readonly categoryTone?: BadgeTone
    readonly title?: string
    readonly body?: string
    readonly isAction?: boolean
}

/** What the changelog row reports when its title opens an update. */
export type ChangelogEntryRowActions = {
    readonly open?: () => void
}

/** Props for {@link ChangelogEntryRow}. */
export type ChangelogEntryRowProps = CompositeProps<ChangelogEntryRowData, ChangelogEntryRowActions>

/** Draw one changelog entry without owning the list surface or navigation. */
export const ChangelogEntryRow = ({ props, on, isLoading = false }: ChangelogEntryRowProps) => {
    const metaRow = createGrammarNode("date-category-row", {
        date: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: props.dateLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
        )),
        category: props.categoryLabel === undefined ? undefined : createLeafNode("badge", {}, () => (
            <Badge props={{ content: props.categoryLabel, tone: props.categoryTone }} isLoading={isLoading} />
        )),
    })
    const title = props.isAction === true && on?.open !== undefined
        ? createLeafNode("text-link", { size: "sm" }, () => (
            <TextLink props={{ label: props.title ?? "", size: "sm" }} on={{ press: on.open }} />
        ))
        : createLeafNode("text", { size: "sm" }, () => (
            <Text props={{ content: props.title, size: "sm", weight: "medium" }} isLoading={isLoading} />
        ))

    return (
        <Grammar contract="changelog-entry-row" render={createGrammarNode("changelog-entry-row", {
            meta: metaRow,
            title,
            body: props.body === undefined && !isLoading ? undefined : createLeafNode(
                "text",
                { size: "xs", tone: "muted" },
                () => <Text props={{ content: props.body, size: "xs", tone: "muted" }} isLoading={isLoading} />,
            ),
        })} />
    )
}

/** Source-level tier marker for the fixed changelog row composition. */
export const meta = { shape: "composite", world: "pure" } as const
