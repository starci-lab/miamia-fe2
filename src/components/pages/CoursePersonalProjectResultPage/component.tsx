import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"

/** One resolved attempt or feedback line shown in the result history. */
export type CoursePersonalProjectResultRow = {
    readonly id: string
    readonly label: string
}

/** Pure result states and the route-back action. */
export type CoursePersonalProjectResultPageProps = {
    readonly state: "pending" | "ready" | "empty" | "failed"
    readonly props: {
        readonly title: string
        readonly description: string
        readonly attemptsLabel: string
        readonly feedbackLabel: string
        readonly attempts: ReadonlyArray<CoursePersonalProjectResultRow>
        readonly feedbacks: ReadonlyArray<CoursePersonalProjectResultRow>
        readonly notice?: string
        readonly retryTaskLabel: string
    }
    readonly on?: { readonly retryTask?: () => void }
}

/** Draws pending, graded, empty and failed task-result states. */
export const CoursePersonalProjectResultPageBase = (input: CoursePersonalProjectResultPageProps) => {
    const loading = input.state === "pending"
    const attempts = input.state === "ready"
        ? [
            renderLeaf("text", {}, () => (
                <Text props={{ content: input.props.attemptsLabel, weight: "semibold" }} />
            )),
            ...input.props.attempts.map((attempt) => renderLeaf("text", {}, () => (
                <Text props={{ content: attempt.label }} />
            ))),
        ]
        : [
            renderLeaf("text", {}, () => (
                <Text
                    props={{
                        content: input.props.notice,
                        live: input.state === "failed" ? "assertive" : "polite",
                    }}
                    isLoading={loading}
                />
            )),
        ]
    const feedback = input.state === "ready"
        ? [
            renderLeaf("text", {}, () => (
                <Text props={{ content: input.props.feedbackLabel, weight: "semibold" }} />
            )),
            ...input.props.feedbacks.map((feedback) => renderLeaf("text", {}, () => (
                <Text props={{ content: feedback.label }} />
            ))),
        ]
        : undefined

    return (
        <Grammar
            layout="course-personal-project-result-page"
            render={layoutNode("course-personal-project-result-page", {
                header: layoutNode("centred-title-pair", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm" }} isLoading={loading} />
                    )),
                }),
                attempts: layoutNode("stacked-peer-controls", { control: attempts }),
                ...(feedback === undefined ? {} : {
                    feedback: layoutNode("stacked-peer-controls", { control: feedback }),
                }),
                ...(loading ? {} : {
                    action: renderLeaf("button", {}, () => (
                        <Button
                            props={{ label: input.props.retryTaskLabel }}
                            on={{ press: input.on?.retryTask }}
                        />
                    )),
                }),
            })}
        />
    )
}

/** Architectural identity for the pure result page twin. */
