import {
    SurfaceListCard,
    type SurfaceListCardActions,
} from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import {
    ChangelogEntryRow,
    type ChangelogEntryRowData,
} from "@/components/composites/ChangelogEntryRow"
import { LAYOUTS } from "@/resources/visual-layouts"
import type { SerializableValue, ComponentProps } from "@/modules/types/layout"
import { renderComposite, layoutNode } from "@/modules/types/layout"

/** Product category attached to a changelog entry. */
export type ChangelogCategory = "feature" | "fix" | "announcement"

/** One resolved changelog entry. */
export type ChangelogEntry = {
    readonly id: string
    readonly dateLabel: string
    readonly category?: ChangelogCategory
    readonly categoryLabel?: string
    readonly title: string
    readonly body?: string
    readonly isAction?: boolean
}

/** Resolved section copy and entries drawn by the changelog block. */
export type ChangelogListData = {
    readonly label: string
    readonly emptyMessage: string
    readonly errorMessage: string
    readonly entries?: ReadonlyArray<ChangelogEntry>
}

/** Product actions reported by the changelog block. */
export type ChangelogListActions = {
    readonly open?: (id: string) => void
}

/** State and data accepted by the pure changelog block. */
export type ChangelogListProps = {
    readonly state: "pending" | "empty" | "failed" | "ready"
    readonly props: ChangelogListData
    readonly on?: ChangelogListActions
}

type ChangelogContentData = {
    readonly [key: string]: SerializableValue
    readonly label: string
    readonly entries: ReadonlyArray<ChangelogEntry>
}

type ChangelogContentProps = ComponentProps<ChangelogContentData, SurfaceListCardActions>

const RESTING_COUNT = LAYOUTS["changelog-list"].children.entry.restingCount

const categoryTone = (category: ChangelogCategory | undefined): ChangelogEntryRowData["categoryTone"] => {
    if (category === "feature") return "success"
    if (category === "fix") return "warning"
    if (category === "announcement") return "accent"
    return undefined
}

const ChangelogContentView = ({ props, on, isLoading = false }: ChangelogContentProps) => {
    const entries: ReadonlyArray<ChangelogEntry> = isLoading
        ? Array.from({ length: RESTING_COUNT }, (_unused, index) => ({
            id: `resting-${index}`,
            dateLabel: "",
            title: "",
            body: "",
        }))
        : props.entries

    return (
        <Grammar layout="changelog-list" render={layoutNode("changelog-list", {
            entry: entries.map((entry) => renderComposite("changelog-entry-row", {}, () => (
                <ChangelogEntryRow
                    props={{
                        id: entry.id,
                        dateLabel: entry.dateLabel,
                        categoryLabel: entry.categoryLabel,
                        categoryTone: categoryTone(entry.category),
                        title: entry.title,
                        body: entry.body,
                        isAction: entry.isAction,
                    }}
                    on={{ open: on?.[entry.id] }}
                    isLoading={isLoading}
                />
            ))),
        })} />
    )
}

const ChangelogContent = layoutNode("changelog-list", ChangelogContentView)

/** The rows to draw: the resolved entries, one synthetic error row, or none while pending. */
const resolveChangelogEntries = (input: ChangelogListProps): ReadonlyArray<ChangelogEntry> => {
    if (input.state === "ready") return input.props.entries ?? []
    if (input.state === "failed") return [{ id: "failed", dateLabel: "", title: input.props.errorMessage }]
    return []
}

/** Draw the product changelog as a joined history without owning fetching or navigation. */
export const ChangelogListBase = (input: ChangelogListProps) => {
    if (input.state === "empty") return null

    const isLoading = input.state === "pending"
    const entries = resolveChangelogEntries(input)
    const openById: SurfaceListCardActions = Object.fromEntries(entries.map((entry) => [
        entry.id,
        input.on?.open === undefined ? undefined : () => input.on?.open?.(entry.id),
    ]))

    return (
        <SurfaceListCard
            props={{ label: input.props.label, entries }}
            on={openById}
            layout="changelog-list"
            render={ChangelogContent}
            isLoading={isLoading}
        />
    )
}

/** Source-level tier marker for the pure dashboard block. */
