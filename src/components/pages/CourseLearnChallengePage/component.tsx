import { Grammar } from "@/components/layouts/Grammar"
import { Field } from "@/components/composites/Field"
import {
    renderComposite,
    layoutNode,
    renderLeaf,
} from "@/modules/types/layout"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"

/** One authored challenge deliverable and its current repository input. */
export type CourseLearnChallengeDeliverable = {
    readonly id: string
    readonly title: string
    readonly description?: string
    readonly scoreLine?: string
    readonly url?: string
}

/** The finite challenge states approved for the content-reader route. */
export type CourseLearnChallengePageState = "pending" | "ready" | "submitting" | "passed" | "failed"

/** Pure challenge facts, labels and actions. */
export type CourseLearnChallengePageProps = {
    readonly state: CourseLearnChallengePageState
    readonly props: {
        readonly title: string
        readonly description: string
        readonly metaLine?: string
        readonly hint?: string
        readonly deliverables: ReadonlyArray<CourseLearnChallengeDeliverable>
        readonly notice?: string
        readonly submitLabel: string
        readonly submittingLabel: string
        readonly retryLabel: string
        readonly resultLabel: string
    }
    readonly on?: {
        readonly changeUrl?: (id: string, value: string) => void
        readonly submit?: (id: string) => void
        readonly retry?: () => void
        readonly openResult?: (id: string) => void
    }
}

/** Draws the challenge brief, deliverables and all approved submission states without fetching. */
export const CourseLearnChallengePageBase = (input: CourseLearnChallengePageProps) => {
    const loading = input.state === "pending"
    const renderFailedControls = () => [
        renderLeaf("text", {}, () => (
            <Text props={{ content: input.props.notice, live: "assertive" }} />
        )),
        renderLeaf("button", {}, () => (
            <Button props={{ label: input.props.retryLabel }} on={{ press: input.on?.retry }} />
        )),
    ]
    const renderPassedControls = () => [
        renderLeaf("text", { size: "sm", tone: "muted" }, () => (
            <Text props={{ content: input.props.metaLine, size: "sm", tone: "muted" }} />
        )),
        ...input.props.deliverables.map((deliverable) => renderLeaf("button", {}, () => (
            <Button
                props={{ label: `${input.props.resultLabel}: ${deliverable.title}` }}
                on={{ press: () => input.on?.openResult?.(deliverable.id) }}
            />
        ))),
    ]
    const renderDefaultControls = () => [
        renderLeaf("text", { size: "sm", tone: "muted" }, () => (
            <Text
                props={{ content: input.props.metaLine, size: "sm", tone: "muted" }}
                isLoading={loading}
            />
        )),
        ...(input.props.hint === undefined ? [] : [
            renderLeaf("text", { size: "sm" }, () => (
                <Text props={{ content: input.props.hint, size: "sm" }} isLoading={loading} />
            )),
        ]),
        ...input.props.deliverables.flatMap((deliverable) => [
            ...(deliverable.description === undefined ? [] : [
                renderLeaf("text", {}, () => (
                    <Text props={{ content: deliverable.description }} isLoading={loading} />
                )),
            ]),
            ...(deliverable.scoreLine === undefined ? [] : [
                renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text
                        props={{ content: deliverable.scoreLine, size: "sm", tone: "muted" }}
                        isLoading={loading}
                    />
                )),
            ]),
            renderComposite("field", {}, () => (
                <Field
                    props={{
                        id: `challenge-submission-${deliverable.id}`,
                        name: `challenge-submission-${deliverable.id}`,
                        label: deliverable.title,
                        kind: "text",
                        disabled: input.state === "submitting",
                    }}
                    on={{ change: (value) => input.on?.changeUrl?.(deliverable.id, value) }}
                    isLoading={loading}
                />
            )),
            renderLeaf("button", {}, () => (
                <Button
                    props={{
                        label: input.state === "submitting"
                            ? input.props.submittingLabel
                            : input.props.submitLabel,
                        variant: "primary",
                        disabled: deliverable.url?.trim().length === 0,
                        isPending: input.state === "submitting",
                    }}
                    on={{ press: () => input.on?.submit?.(deliverable.id) }}
                    isLoading={loading}
                />
            )),
        ]),
    ]
    const resolveControls = () => {
        if (input.state === "failed") return renderFailedControls()
        if (input.state === "passed") return renderPassedControls()
        return renderDefaultControls()
    }
    const controls = resolveControls()

    return (
        <Grammar
            layout="course-learn-challenge-page"
            render={layoutNode("course-learn-challenge-page", {
                header: layoutNode("centred-title-pair", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm" }} isLoading={loading} />
                    )),
                }),
                body: layoutNode("stacked-peer-controls", { control: controls }),
            })}
        />
    )
}

/** Architectural identity for the pure challenge twin. */
