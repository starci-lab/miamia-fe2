import { SurfaceFormCard } from "@/components/branches/SurfaceFormCard"
import { SurfaceListCard, type SurfaceListCardData } from "@/components/branches/SurfaceListCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Breadcrumbs, type BreadcrumbStep } from "@/components/leaves/Breadcrumbs"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Icon } from "@/components/leaves/Icon"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { Textarea } from "@/components/leaves/Textarea"
import {
    renderComposite,
    layoutNode,
    layoutContent,
    renderLeaf,
    type BlockProps,
    type ComponentProps,
} from "@/modules/types/layout"

/** One resolved question or reply line rendered by the Q&A list. */
export type CourseQaThreadRow = {
    readonly id: string
    readonly body: string
    readonly meta: string
    readonly replyLabel?: string
}

type CourseQaPageData = {
    readonly title: string
    readonly trail: ReadonlyArray<BreadcrumbStep>
    readonly searchPlaceholder: string
    readonly searchLabel: string
    readonly clearSearchLabel: string
    readonly askLabel: string
    readonly askPlaceholder: string
    readonly questionsLabel: string
    readonly repliesLabel: string
    readonly backLabel: string
    readonly draftKey: number
    readonly draft: string
    readonly isSubmitting?: boolean
    readonly questions: ReadonlyArray<CourseQaThreadRow>
    readonly selectedQuestion?: CourseQaThreadRow
    readonly replies: ReadonlyArray<CourseQaThreadRow>
    readonly emptyMessage: string
    readonly emptySearchMessage: string
    readonly errorMessage: string
    readonly retryLabel: string
}

type CourseQaPageActions = {
    readonly course?: () => void
    readonly search?: (query: string) => void
    readonly changeDraft?: (value: string) => void
    readonly ask?: () => void
    readonly openThread?: (id: string) => void
    readonly closeThread?: () => void
    readonly retry?: () => void
}

type CourseQaPageProps = BlockProps<"pending" | "ready" | "empty" | "failed", CourseQaPageData> & {
    readonly on?: CourseQaPageActions
}

type CourseQaListData = SurfaceListCardData & {
    readonly rows: ReadonlyArray<CourseQaThreadRow>
    readonly emptyMessage: string
}

type CourseQaListActions = {
    readonly [key: string]: (() => void) | undefined
}

const PENDING_QA_ROWS: ReadonlyArray<CourseQaThreadRow> = Array.from(
    { length: 4 },
    (_unused, index) => ({ id: `pending-${index}`, body: "", meta: "" }),
)

const CourseQaList = ({ props, on, isLoading = false }: ComponentProps<CourseQaListData, CourseQaListActions>) => {
    const displayedRows = isLoading ? PENDING_QA_ROWS : props.rows
    const steps = !isLoading && props.rows.length === 0
        ? [layoutContent("content-next-row", () => <EmptyNotice props={{ message: props.emptyMessage }} />)]
        : displayedRows.map((row) => layoutNode("content-next-row", {
            label: renderLeaf("text", { size: "md" }, () => (
                <Text
                    props={{
                        content: row.replyLabel === undefined ? `${row.body} · ${row.meta}` : `${row.body} · ${row.meta} · ${row.replyLabel}`,
                        size: "md",
                        isPressLabel: on?.[`open:${row.id}`] !== undefined,
                    }}
                    isLoading={isLoading}
                />
            )),
            ...(on?.[`open:${row.id}`] === undefined ? {} : {
                disclosure: renderLeaf("icon", {}, () => <Icon props={{ name: "disclosure", role: "chip" }} />),
            }),
        }))
    return <Grammar layout="content-next-list" render={layoutNode("content-next-list", { step: steps })} />
}

const CourseQaListContent = layoutNode("content-next-list", CourseQaList)

/** Pure course Q&A list, inline ask form and one selected thread. */
export const CourseQaPageBase = (input: CourseQaPageProps) => {
    const isLoading = input.state === "pending"
    const rows = input.props.selectedQuestion === undefined ? input.props.questions : input.props.replies
    const label = input.props.selectedQuestion === undefined ? input.props.questionsLabel : input.props.repliesLabel
    const listActions: CourseQaListActions = Object.fromEntries(
        input.props.questions.map((question) => [`open:${question.id}`, () => input.on?.openThread?.(question.id)]),
    )
    const header = layoutNode("page-header-stack", {
        trail: renderLeaf("breadcrumbs", {}, () => (
            <Breadcrumbs props={{ steps: input.props.trail, label: input.props.title }} on={{ course: input.on?.course }} />
        )),
        title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
    })
    const toolbar = layoutContent("catalog-search-count-view-row", () => (
        <>
            <SearchBox
                props={{
                    placeholder: input.props.searchPlaceholder,
                    label: input.props.searchLabel,
                    clearLabel: input.props.clearSearchLabel,
                }}
                on={{ search: input.on?.search }}
            />
            <SurfaceFormCard
                layout="stacked-peer-controls"
                render={layoutNode("stacked-peer-controls", {
                    control: [
                        layoutContent("spread-choice-row", () => (
                            <Textarea
                                key={input.props.draftKey}
                                props={{
                                    id: "course-question",
                                    name: "question",
                                    label: input.props.askLabel,
                                    placeholder: input.props.askPlaceholder,
                                    defaultValue: input.props.draft,
                                    rows: 3,
                                    disabled: input.props.isSubmitting,
                                }}
                                on={{ change: input.on?.changeDraft }}
                            />
                        )),
                        renderLeaf("button", {}, () => (
                            <Button
                                props={{
                                    label: input.props.askLabel,
                                    icon: "send",
                                    variant: "primary",
                                    isPending: input.props.isSubmitting,
                                    disabled: input.props.draft.trim() === "",
                                }}
                                on={{ press: input.on?.ask }}
                            />
                        )),
                    ],
                })}
            />
        </>
    ))

    const notice = input.state === "failed" || input.state === "empty"
        ? renderComposite("empty-notice", {}, () => (
            <EmptyNotice
                props={{
                    icon: input.state === "failed" ? "retry" : "community",
                    message: input.state === "failed" ? input.props.errorMessage : input.props.emptyMessage,
                    actionLabel: input.state === "failed" ? input.props.retryLabel : undefined,
                }}
                on={{ act: input.state === "failed" ? input.on?.retry : undefined }}
            />
        ))
        : undefined

    return (
        <Grammar layout="course-qa-page" render={layoutNode("course-qa-page", {
            header,
            composer: toolbar,
            ...(notice === undefined ? {
                thread: layoutContent("catalog-section-group", () => (
                    <>
                        {input.props.selectedQuestion === undefined ? null : (
                            <Button props={{ label: input.props.backLabel, variant: "ghost", size: "sm" }} on={{ press: input.on?.closeThread }} />
                        )}
                        <SurfaceListCard
                            layout="content-next-list"
                            render={CourseQaListContent}
                            props={{ label, rows, emptyMessage: input.props.emptySearchMessage }}
                            on={input.props.selectedQuestion === undefined ? listActions : undefined}
                            isLoading={isLoading}
                        />
                    </>
                )),
            } : { notice }),
        })} />
    )
}

/** Source-level ownership marker. */
