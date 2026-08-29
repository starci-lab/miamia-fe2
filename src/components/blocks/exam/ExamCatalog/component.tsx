import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { ExamPaperCard, type ExamPaperCardData } from "@/components/composites/ExamPaperCard"
import { Button } from "@/components/leaves/Button"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { Heading } from "@/components/leaves/Heading"
import { Pagination } from "@/components/leaves/Pagination"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, layoutContent, renderLeaf, type BlockProps } from "@/modules/types/layout"

/** One real paper collection shown in the catalogue selector. */
export type ExamCollectionData = { readonly id: string; readonly label: string; readonly count: number }
/** Resolved catalogue copy and paged paper data. */
export type ExamCatalogData = {
    readonly title: string; readonly description: string; readonly premiumTitle: string; readonly premiumBody: string; readonly premiumAction: string
    readonly searchLabel: string; readonly searchPlaceholder: string; readonly searchClearLabel: string; readonly collectionLabel: string
    readonly selectedCollectionId: string; readonly collections: ReadonlyArray<ExamCollectionData>; readonly sectionTitle: string; readonly countLabel: string
    readonly papers: ReadonlyArray<ExamPaperCardData>; readonly page: number; readonly totalPages: number; readonly pageLabel: string; readonly previousLabel: string; readonly nextLabel: string
    readonly emptyMessage: string; readonly failedMessage: string; readonly retryLabel: string
}
/** User intents emitted by the pure catalogue. */
export type ExamCatalogActions = { readonly search?: (query: string) => void; readonly selectCollection?: (id: string) => void; readonly changePage?: (page: number) => void; readonly requestPremium?: () => void; readonly retry?: () => void; readonly [key: `open:${string}`]: (() => void) | undefined }
/** State layout for the pure catalogue block. */
export type ExamCatalogProps = BlockProps<"loading" | "failed" | "empty" | "ready", ExamCatalogData> & { readonly on?: ExamCatalogActions }

/** Render one settled catalogue state. */
export const ExamCatalogBase = (input: ExamCatalogProps) => {
    const isLoading = input.state === "loading"
    const notice = input.state === "failed" || input.state === "empty"
    return <Grammar layout="exam-catalog-page" render={layoutNode("exam-catalog-page", {
        header: layoutNode("page-header-stack", {
            title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
        }),
        premium: layoutNode("premium-value-band", {
            copy: layoutNode("premium-copy-stack", {
                title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.premiumTitle, level: 2 }} />),
                body: renderLeaf("text", {}, () => <Text props={{ content: input.props.premiumBody, tone: "muted" }} />),
            }),
            action: renderLeaf("button", {}, () => <Button props={{ label: input.props.premiumAction, variant: "primary" }} on={{ press: input.on?.requestPremium }} />),
        }),
        query: layoutNode("catalog-query-with-count", {
            query: renderLeaf("search-box", {}, () => <SearchBox props={{ label: input.props.searchLabel, placeholder: input.props.searchPlaceholder, clearLabel: input.props.searchClearLabel }} on={{ search: input.on?.search }} />),
            count: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.countLabel, size: "sm", tone: "muted" }} />),
        }),
        collections: renderLeaf("choice-tabs", {}, () => <ChoiceTabs props={{ label: input.props.collectionLabel, selectedKey: input.props.selectedCollectionId, variant: "primary", tabs: input.props.collections.map((item) => ({ id: item.id, label: item.label })) }} on={{ select: input.on?.selectCollection }} />),
        ...(notice ? {} : {
            section: layoutNode("exam-program-section", {
                heading: layoutNode("title-with-baseline-fact", {
                    title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.sectionTitle, level: 2 }} />),
                    fact: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.countLabel, size: "sm", tone: "muted" }} />),
                }),
                papers: layoutNode("exam-paper-grid", {
                    paper: input.props.papers.map((paper) => layoutContent("exam-paper-card", () => <ExamPaperCard key={paper.id} props={paper} on={{ open: input.on?.[`open:${paper.id}`] }} isLoading={isLoading} />)),
                }),
            }),
            pagination: renderLeaf("pagination", {}, () => <Pagination props={{ label: input.props.pageLabel, page: input.props.page, total: input.props.totalPages, previousLabel: input.props.previousLabel, nextLabel: input.props.nextLabel }} on={{ change: input.on?.changePage }} />),
        }),
        ...(notice ? {
            notice: renderComposite("empty-notice", {}, () => <EmptyNotice props={{ icon: "review", message: input.state === "failed" ? input.props.failedMessage : input.props.emptyMessage, actionLabel: input.state === "failed" ? input.props.retryLabel : undefined }} on={{ act: input.on?.retry }} />),
        } : {}),
    })} />
}

/** Source-level block marker. */
