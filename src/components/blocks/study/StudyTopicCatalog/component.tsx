import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { Heading } from "@/components/leaves/Heading"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { defineCompositeComponent, defineContractComponent, defineContractProjection, defineLeafComponent, type BlockProps } from "@/components/contracts/props"

type StudyTopicCardData = { readonly id: string; readonly slug: string; readonly level: string; readonly title: string; readonly body: string; readonly fact: string; readonly actionLabel: string }
type StudyTopicCatalogData = {
    readonly title: string; readonly description: string; readonly searchLabel: string; readonly searchPlaceholder: string; readonly clearLabel: string
    readonly filterLabel: string; readonly selectedLevel: string; readonly levels: ReadonlyArray<{ readonly id: string; readonly label: string }>
    readonly topics: ReadonlyArray<StudyTopicCardData>; readonly empty: string; readonly filteredEmpty: string; readonly failed: string; readonly retry: string
}
type StudyTopicCatalogActions = { readonly search?: (query: string) => void; readonly selectLevel?: (level: string) => void; readonly retry?: () => void; readonly [key: `open:${string}`]: (() => void) | undefined }
type StudyTopicCatalogProps = BlockProps<"pending" | "failed" | "empty" | "filtered-empty" | "ready", StudyTopicCatalogData> & { readonly on?: StudyTopicCatalogActions }

/** The empty-notice copy: the failure message, the filtered-empty message, or the plain-empty one. */
const emptyNoticeMessage = (state: StudyTopicCatalogProps["state"], props: StudyTopicCatalogData): string => {
    if (state === "failed") return props.failed
    if (state === "filtered-empty") return props.filteredEmpty
    return props.empty
}

/** Renders the searchable topic catalogue and all settled list outcomes. */
export const StudyTopicCatalogBase = (input: StudyTopicCatalogProps) => {
    const loading = input.state === "pending"
    const notice = input.state === "failed" || input.state === "empty" || input.state === "filtered-empty"
    return <Tree contract="study-catalog-stack" render={defineContractComponent("study-catalog-stack", {
        header: defineContractComponent("page-header-stack", {
            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
        }),
        description: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.description, size: "sm", tone: "muted" }} />),
        query: defineLeafComponent("search-box", {}, () => <SearchBox props={{ label: input.props.searchLabel, placeholder: input.props.searchPlaceholder, clearLabel: input.props.clearLabel }} on={{ search: input.on?.search }} />),
        filter: defineLeafComponent("choice-tabs", {}, () => <ChoiceTabs props={{ label: input.props.filterLabel, selectedKey: input.props.selectedLevel, tabs: input.props.levels, variant: "primary" }} on={{ select: input.on?.selectLevel }} />),
        ...(notice ? { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ icon: "course", message: emptyNoticeMessage(input.state, input.props), actionLabel: input.state === "failed" ? input.props.retry : undefined }} on={{ act: input.on?.retry }} />) } : {
            topics: defineContractComponent("study-topic-grid", {
                topic: input.props.topics.map((topic) => defineContractProjection("study-topic-card", () => <SurfaceCard key={topic.id} contract="study-topic-card" render={defineContractComponent("study-topic-card", {
                    level: defineLeafComponent("badge", {}, () => <Badge props={{ content: topic.level, tone: "accent" }} isLoading={loading} />),
                    title: defineLeafComponent("heading", {}, () => <Heading props={{ content: topic.title, level: 2 }} isLoading={loading} />),
                    body: defineLeafComponent("text", {}, () => <Text props={{ content: topic.body, tone: "muted" }} isLoading={loading} />),
                    fact: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: topic.fact, size: "sm", tone: "muted" }} isLoading={loading} />),
                    action: defineLeafComponent("button", {}, () => <Button props={{ label: topic.actionLabel, variant: "primary", icon: "next", iconPlacement: "trailing" }} on={{ press: input.on?.[`open:${topic.id}`] }} isLoading={loading} />),
                })} />)),
            }),
        }),
    })} />
}
/** Declares the pure Study catalogue block. */
export const meta = { shape: "block", world: "pure", domain: "study" } as const
