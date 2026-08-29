import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { NavLink } from "@/components/leaves/NavLink"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, renderLeaf } from "@/modules/types/layout"

/** Query states exposed by the pure course concept map. */
export type CourseMindMapPageState = "pending" | "ready" | "empty" | "failed"

/** One normalized graph node shown in both rail and canvas. */
export type CourseMindMapNodeView = {
    readonly id: string
    readonly label: string
    readonly detail?: string
    readonly left: number
    readonly top: number
    readonly canOpen: boolean
}

/** Resolved graph data, selection and navigation actions. */
export type CourseMindMapPageProps = {
    readonly state: CourseMindMapPageState
    readonly props: {
        readonly title: string
        readonly description: string
        readonly searchLabel: string
        readonly searchPlaceholder: string
        readonly clearSearchLabel: string
        readonly emptyText: string
        readonly noResultsText: string
        readonly failedText: string
        readonly retryLabel: string
        readonly openLabel: string
        readonly graphFact: string
        readonly nodes: ReadonlyArray<CourseMindMapNodeView>
        readonly selectedId?: string
    }
    readonly on: {
        readonly search: (query: string) => void
        readonly select: (id: string) => void
        readonly openContent: (id: string) => void
        readonly retry: () => void
    }
}

/** The empty-notice message: failed, no results for the search, or truly empty. */
const deriveNoticeMessage = (
    hasFailed: boolean,
    noResults: boolean,
    failedText: string,
    noResultsText: string,
    emptyText: string,
): string => {
    if (hasFailed) return failedText
    if (noResults) return noResultsText
    return emptyText
}

/** Draw the server concept graph as a searchable, selectable and mobile-safe node field. */
export const CourseMindMapPageBase = (input: CourseMindMapPageProps) => {
    const loading = input.state === "pending"
    const selected = input.props.nodes.find((node) => node.id === input.props.selectedId)
    const noResults = input.state === "ready" && input.props.nodes.length === 0
    const notice = input.state === "empty" || input.state === "failed" || noResults
        ? renderComposite("empty-notice", {}, () => (
            <EmptyNotice
                props={{
                    message: deriveNoticeMessage(
                        input.state === "failed",
                        noResults,
                        input.props.failedText,
                        input.props.noResultsText,
                        input.props.emptyText,
                    ),
                    actionLabel: input.state === "failed" ? input.props.retryLabel : undefined,
                }}
                on={{ act: input.on.retry }}
            />
        ))
        : undefined

    return (
        <Grammar layout="course-mind-map-page" render={layoutNode("course-mind-map-page", {
            header: layoutNode("page-header-stack", {
                title: renderLeaf("heading", {}, () => (
                    <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                )),
            }),
            description: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: input.props.description, size: "sm", tone: "muted" }} isLoading={loading} />
            )),
            search: renderLeaf("search-box", {}, () => (
                <SearchBox
                    props={{
                        label: input.props.searchLabel,
                        placeholder: input.props.searchPlaceholder,
                        clearLabel: input.props.clearSearchLabel,
                    }}
                    on={{ search: input.on.search }}
                />
            )),
            graphFact: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                <Text props={{ content: input.props.graphFact, size: "xs", tone: "muted" }} isLoading={loading} />
            )),
            node: input.props.nodes.map((node) => renderLeaf("nav-link", { kind: "section" }, () => (
                <NavLink
                    props={{
                        label: node.detail === undefined ? node.label : `${node.label} · ${node.detail}`,
                        kind: "section",
                        isCurrent: node.id === input.props.selectedId,
                    }}
                    on={{ press: () => input.on.select(node.id) }}
                    isLoading={loading}
                />
            ))),
            ...(selected?.detail === undefined ? {} : {
                selection: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: selected.detail, size: "sm", tone: "muted" }} />
                )),
            }),
            ...(selected?.canOpen !== true ? {} : {
                open: renderLeaf("button", {}, () => (
                    <Button props={{ label: input.props.openLabel, variant: "primary" }} on={{ press: () => input.on.openContent(selected.id) }} />
                )),
            }),
            notice,
        })} />
    )
}

/** Source-level ownership marker. */
