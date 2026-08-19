import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { ExamPaperCard, type ExamPaperCardData } from "@/components/composites/ExamPaperCard"
import { Button } from "@/components/leaves/Button"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { Heading } from "@/components/leaves/Heading"
import { Pagination } from "@/components/leaves/Pagination"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { defineCompositeComponent, defineContractComponent, defineContractProjection, defineLeafComponent, type BlockProps } from "@/components/contracts/props"

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
/** State contract for the pure catalogue block. */
export type ExamCatalogProps = BlockProps<"loading" | "failed" | "empty" | "ready", ExamCatalogData> & { readonly on?: ExamCatalogActions }

/** Render one settled catalogue state. */
export const ExamCatalogBase = (input: ExamCatalogProps) => {
    const isLoading = input.state === "loading"
    const notice = input.state === "failed" || input.state === "empty"
    return <Tree contract="exam-catalog-page" render={defineContractComponent("exam-catalog-page", {
        header: defineContractComponent("page-header-stack", {
            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
        }),
        premium: defineContractComponent("premium-value-band", {
            copy: defineContractComponent("premium-copy-stack", {
                title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.premiumTitle, level: 2 }} />),
                body: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.premiumBody, tone: "muted" }} />),
            }),
            action: defineLeafComponent("button", {}, () => <Button props={{ label: input.props.premiumAction, variant: "primary" }} on={{ press: input.on?.requestPremium }} />),
        }),
        query: defineContractComponent("catalog-query-with-count", {
            query: defineLeafComponent("search-box", {}, () => <SearchBox props={{ label: input.props.searchLabel, placeholder: input.props.searchPlaceholder, clearLabel: input.props.searchClearLabel }} on={{ search: input.on?.search }} />),
            count: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.countLabel, size: "sm", tone: "muted" }} />),
        }),
        collections: defineLeafComponent("choice-tabs", {}, () => <ChoiceTabs props={{ label: input.props.collectionLabel, selectedKey: input.props.selectedCollectionId, variant: "primary", tabs: input.props.collections.map((item) => ({ id: item.id, label: item.label })) }} on={{ select: input.on?.selectCollection }} />),
        ...(notice ? {} : {
            section: defineContractComponent("exam-program-section", {
                heading: defineContractComponent("title-with-baseline-fact", {
                    title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.sectionTitle, level: 2 }} />),
                    fact: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.countLabel, size: "sm", tone: "muted" }} />),
                }),
                papers: defineContractComponent("exam-paper-grid", {
                    paper: input.props.papers.map((paper) => defineContractProjection("exam-paper-card", () => <ExamPaperCard key={paper.id} props={paper} on={{ open: input.on?.[`open:${paper.id}`] }} isLoading={isLoading} />)),
                }),
            }),
            pagination: defineLeafComponent("pagination", {}, () => <Pagination props={{ label: input.props.pageLabel, page: input.props.page, total: input.props.totalPages, previousLabel: input.props.previousLabel, nextLabel: input.props.nextLabel }} on={{ change: input.on?.changePage }} />),
        }),
        ...(notice ? {
            notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ icon: "review", message: input.state === "failed" ? input.props.failedMessage : input.props.emptyMessage, actionLabel: input.state === "failed" ? input.props.retryLabel : undefined }} on={{ act: input.on?.retry }} />),
        } : {}),
    })} />
}

/** Source-level block marker. */
export const meta = { shape: "block", world: "pure", domain: "exam" } as const
