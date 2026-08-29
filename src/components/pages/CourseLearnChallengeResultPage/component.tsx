import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"

/** One backend-authored scorer finding shown without client interpretation. */
export type CourseLearnChallengeFeedback = {
    readonly id: string
    readonly message: string
    readonly detail?: string
    readonly severity: "low" | "medium" | "high"
    readonly location?: string
    readonly suggestion?: string
}

/** Pure result facts, finite state and route actions. */
export type CourseLearnChallengeResultPageProps = {
    readonly state: "pending" | "ready" | "failed"
    readonly props: {
        readonly title: string
        readonly description: string
        readonly scoreLine?: string
        readonly shortFeedback?: string
        readonly feedbacks: ReadonlyArray<CourseLearnChallengeFeedback>
        readonly notice?: string
        readonly reloadLabel: string
        readonly retryLabel: string
        readonly nextLabel: string
    }
    readonly on?: {
        readonly reload?: () => void
        readonly retry?: () => void
        readonly next?: () => void
    }
}

/** Draws pending, graded and failed challenge-result states without querying. */
export const CourseLearnChallengeResultPageBase = (input: CourseLearnChallengeResultPageProps) => {
    const loading = input.state === "pending"
    const deriveControls = () => {
        if (input.state === "failed") {
            return [
                renderLeaf("text", {}, () => (
                    <Text props={{ content: input.props.notice, live: "assertive" }} />
                )),
                renderLeaf("button", {}, () => (
                    <Button props={{ label: input.props.reloadLabel }} on={{ press: input.on?.reload }} />
                )),
            ]
        }
        if (input.state === "pending") {
            return [
                renderLeaf("button", {}, () => (
                    <Button props={{ label: input.props.retryLabel }} isLoading />
                )),
                renderLeaf("button", {}, () => (
                    <Button props={{ label: input.props.nextLabel, variant: "primary" }} isLoading />
                )),
            ]
        }
        return [
            ...(input.props.shortFeedback === undefined ? [] : [
                renderLeaf("text", {}, () => (
                    <Text props={{ content: input.props.shortFeedback }} isLoading={loading} />
                )),
            ]),
            ...input.props.feedbacks.flatMap((feedback) => [
                renderLeaf("text", { weight: "semibold" }, () => (
                    <Text props={{ content: feedback.message, weight: "semibold" }} />
                )),
                renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: feedback.severity, size: "sm", tone: "muted" }} />
                )),
                ...(feedback.detail === undefined ? [] : [
                    renderLeaf("text", {}, () => <Text props={{ content: feedback.detail }} />),
                ]),
                ...(feedback.location === undefined ? [] : [
                    renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: feedback.location, size: "sm" }} />
                    )),
                ]),
                ...(feedback.suggestion === undefined ? [] : [
                    renderLeaf("text", {}, () => <Text props={{ content: feedback.suggestion }} />),
                ]),
            ]),
            renderLeaf("button", {}, () => (
                <Button props={{ label: input.props.retryLabel }} on={{ press: input.on?.retry }} isLoading={loading} />
            )),
            renderLeaf("button", {}, () => (
                <Button
                    props={{ label: input.props.nextLabel, variant: "primary" }}
                    on={{ press: input.on?.next }}
                    isLoading={loading}
                />
            )),
        ]
    }
    const controls = deriveControls()

    return (
        <Grammar
            layout="course-learn-challenge-result-page"
            render={layoutNode("course-learn-challenge-result-page", {
                header: layoutNode("centred-title-pair", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm" }} isLoading={loading} />
                    )),
                }),
                score: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text
                        props={{ content: input.props.scoreLine, size: "sm", tone: "muted" }}
                        isLoading={loading}
                    />
                )),
                body: layoutNode("stacked-peer-controls", { control: controls }),
            })}
        />
    )
}

/** Architectural identity for the pure result twin. */
