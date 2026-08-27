import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"
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
            createLeafNode("text", {}, () => (
                <Text props={{ content: input.props.attemptsLabel, weight: "semibold" }} />
            )),
            ...input.props.attempts.map((attempt) => createLeafNode("text", {}, () => (
                <Text props={{ content: attempt.label }} />
            ))),
        ]
        : [
            createLeafNode("text", {}, () => (
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
            createLeafNode("text", {}, () => (
                <Text props={{ content: input.props.feedbackLabel, weight: "semibold" }} />
            )),
            ...input.props.feedbacks.map((feedback) => createLeafNode("text", {}, () => (
                <Text props={{ content: feedback.label }} />
            ))),
        ]
        : undefined

    return (
        <Grammar
            contract="course-personal-project-result-page"
            render={createGrammarNode("course-personal-project-result-page", {
                header: createGrammarNode("centred-title-pair", {
                    title: createLeafNode("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: createLeafNode("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm" }} isLoading={loading} />
                    )),
                }),
                attempts: createGrammarNode("stacked-peer-controls", { control: attempts }),
                ...(feedback === undefined ? {} : {
                    feedback: createGrammarNode("stacked-peer-controls", { control: feedback }),
                }),
                ...(loading ? {} : {
                    action: createLeafNode("button", {}, () => (
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
export const meta = { world: "pure", domain: "learn" } as const
