import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Breadcrumbs, type BreadcrumbStep } from "@/components/leaves/Breadcrumbs"
import { Heading } from "@/components/leaves/Heading"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { TextLink } from "@/components/leaves/TextLink"
import {
    renderComposite,
    layoutNode,
    layoutContent,
    renderLeaf,
    type BlockProps,
    type ComponentProps,
} from "@/modules/types/layout"

/** One company destination or consultant contact line in the directory. */
export type HeadhuntingDirectoryRow = {
    readonly id: string
    readonly label: string
    readonly meta?: string
    readonly actionLabel?: string
    readonly isActionAvailable?: boolean
}

type CourseHeadhuntingsPageData = {
    readonly title: string
    readonly trail: ReadonlyArray<BreadcrumbStep>
    readonly searchPlaceholder: string
    readonly searchLabel: string
    readonly clearSearchLabel: string
    readonly companiesLabel: string
    readonly consultantsLabel: string
    readonly companies: ReadonlyArray<HeadhuntingDirectoryRow>
    readonly consultants: ReadonlyArray<HeadhuntingDirectoryRow>
    readonly emptyMessage: string
    readonly errorMessage: string
    readonly retryLabel: string
}

type CourseHeadhuntingsPageActions = {
    readonly [key: string]: (() => void) | ((query: string) => void) | undefined
    readonly course?: () => void
    readonly search?: (query: string) => void
    readonly retry?: () => void
}

type CourseHeadhuntingsPageProps = BlockProps<
    "pending" | "ready" | "empty" | "failed",
    CourseHeadhuntingsPageData
> & { readonly on?: CourseHeadhuntingsPageActions }

type DirectoryListData = SurfaceListCardData & { readonly rows: ReadonlyArray<HeadhuntingDirectoryRow> }

const PENDING_DIRECTORY_ROWS: ReadonlyArray<HeadhuntingDirectoryRow> = Array.from(
    { length: 4 },
    (_unused, index) => ({ id: `pending-${index}`, label: "" }),
)

/** A plain row opens; an actionable row contacts only once that action is actually available. */
const resolveDirectoryHandler = (row: HeadhuntingDirectoryRow, on?: CourseHeadhuntingsPageActions) => {
    if (row.actionLabel === undefined) return on?.[`open:${row.id}`]
    if (row.isActionAvailable === true) return on?.[`contact:${row.id}`]
    return undefined
}

const DirectoryList = ({ props, on, isLoading = false }: ComponentProps<DirectoryListData, CourseHeadhuntingsPageActions>) => (
    <Grammar layout="content-next-list" render={layoutNode("content-next-list", {
        step: (isLoading ? PENDING_DIRECTORY_ROWS : props.rows)
            .map((row) => layoutContent("content-next-row", () => {
                const label = [row.label, row.meta, row.actionLabel].filter((part) => part !== undefined).join(" · ")
                const handler = resolveDirectoryHandler(row, on)
                return handler === undefined ? (
                    <Text props={{ content: label, size: "md" }} isLoading={isLoading} />
                ) : (
                    <TextLink props={{ label, size: "md" }} on={{ press: handler as (() => void) | undefined }} />
                )
            })),
    })} />
)

const DirectoryListContent = layoutNode("content-next-list", DirectoryList)

/** Pure company search plus consultant contact directory. */
export const CourseHeadhuntingsPageBase = (input: CourseHeadhuntingsPageProps) => {
    const isLoading = input.state === "pending"
    const header = layoutNode("page-header-stack", {
        trail: renderLeaf("breadcrumbs", {}, () => (
            <Breadcrumbs props={{ steps: input.props.trail, label: input.props.title }} on={{ course: input.on?.course as (() => void) | undefined }} />
        )),
        title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
    })
    const toolbar = layoutContent("catalog-search-count-view-row", () => (
        <SearchBox
            props={{
                placeholder: input.props.searchPlaceholder,
                label: input.props.searchLabel,
                clearLabel: input.props.clearSearchLabel,
            }}
            on={{ search: input.on?.search as ((query: string) => void) | undefined }}
        />
    ))
    const notice = input.state === "failed" || input.state === "empty"
        ? renderComposite("empty-notice", {}, () => (
            <EmptyNotice
                props={{
                    icon: input.state === "failed" ? "retry" : "talents",
                    message: input.state === "failed" ? input.props.errorMessage : input.props.emptyMessage,
                    actionLabel: input.state === "failed" ? input.props.retryLabel : undefined,
                }}
                on={{ act: input.state === "failed" ? input.on?.retry as (() => void) | undefined : undefined }}
            />
        ))
        : undefined

    return (
        <Grammar layout="course-headhuntings-page" render={layoutNode("course-headhuntings-page", {
            header,
            search: toolbar,
            ...(notice === undefined ? {
                directories: layoutContent("catalog-section-group", () => (
                    <>
                        <SurfaceListCard
                            layout="content-next-list"
                            render={DirectoryListContent}
                            props={{ label: input.props.companiesLabel, rows: input.props.companies }}
                            on={input.on}
                            isLoading={isLoading}
                        />
                        {input.props.consultants.length === 0 && !isLoading ? null : (
                            <SurfaceListCard
                                layout="content-next-list"
                                render={DirectoryListContent}
                                props={{ label: input.props.consultantsLabel, rows: input.props.consultants }}
                                on={input.on}
                                isLoading={isLoading}
                            />
                        )}
                    </>
                )),
            } : { notice }),
        })} />
    )
}

/** Source-level ownership marker. */
