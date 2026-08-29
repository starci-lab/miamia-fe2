import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Article } from "@/components/leaves/Article"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, renderLeaf } from "@/modules/types/layout"
import type { Foundation } from "@/modules/api/graphql/queries/query-foundations"

/** Resolved states, content and actions for one foundation resource reader. */
export type CourseFoundationResourcePageProps = {
    readonly state: "pending" | "ready" | "not-found" | "failed"
    readonly props: {
        readonly resource?: Foundation | null
        readonly titleFallback: string
        readonly notFound: string
        readonly failed: string
        readonly retry: string
        readonly back: string
        readonly openPlayground: string
    }
    readonly on?: { readonly back?: () => void; readonly retry?: () => void; readonly openPlayground?: () => void }
}

/** Draw one live foundation resource, including not-found and retryable failure states. */
export const CourseFoundationResourcePageBase = (input: CourseFoundationResourcePageProps) => {
    const loading = input.state === "pending"
    const unavailable = input.state === "not-found" || input.state === "failed"
    const notice = unavailable
        ? renderComposite("empty-notice", {}, () => (
            <EmptyNotice
                props={{
                    message: input.state === "failed" ? input.props.failed : input.props.notFound,
                    actionLabel: input.state === "failed" ? input.props.retry : undefined,
                }}
                on={{ act: input.on?.retry }}
            />
        ))
        : undefined

    return (
        <Grammar layout="course-foundation-resource-page" render={layoutNode("course-foundation-resource-page", {
            back: renderLeaf("button", {}, () => (
                <Button props={{ label: input.props.back, variant: "ghost" }} on={{ press: input.on?.back }} />
            )),
            ...(!unavailable ? {
                header: layoutNode("page-header-stack", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading
                            props={{ content: input.props.resource?.title ?? input.props.titleFallback, level: 1 }}
                            isLoading={loading}
                        />
                    )),
                }),
                description: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text
                        props={{ content: input.props.resource?.description ?? "", size: "sm", tone: "muted" }}
                        isLoading={loading}
                    />
                )),
                body: renderLeaf("article", {}, () => (
                    <Article props={{ body: input.props.resource?.value ?? undefined }} isLoading={loading} />
                )),
                practice: renderLeaf("button", {}, () => (
                    <Button
                        props={{ label: input.props.openPlayground, variant: "primary" }}
                        on={{ press: input.on?.openPlayground }}
                        isLoading={loading}
                    />
                )),
            } : {}),
            notice,
        })} />
    )
}

/** Source-level ownership marker. */
