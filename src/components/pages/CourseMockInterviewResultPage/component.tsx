import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { LabelledProgressRow } from "@/components/composites/LabelledProgressRow"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Progress } from "@/components/leaves/Progress"
import { Text } from "@/components/leaves/Text"
import {
    renderComposite,
    layoutNode,
    renderLeaf,
} from "@/modules/types/layout"

/** Finite situations shown by the result route. */
export type CourseMockInterviewResultState = "grading" | "ready" | "failed"

/** One scored rubric row in the debrief. */
export type CourseMockInterviewScoreRow = {
    readonly id: string
    readonly label: string
    readonly score: number
    readonly max: number
}

/** One backend-authored comparison between a candidate answer and its expected coverage. */
export type CourseMockInterviewQuestionReview = {
    readonly id: string
    readonly title: string
    readonly answer: string
    readonly feedback: string
    readonly scoreLabel: string
}

/** Resolved debrief data consumed by the pure result page. */
export type CourseMockInterviewResultData = {
    readonly title: string
    readonly description: string
    readonly gradingLabel: string
    readonly failedLabel: string
    readonly scoreLabel: string
    readonly score?: number
    readonly verdict?: string
    readonly promptTitle?: string
    readonly phaseTitle: string
    readonly phases: ReadonlyArray<CourseMockInterviewScoreRow>
    readonly strengthsTitle: string
    readonly strengths: ReadonlyArray<string>
    readonly gapsTitle: string
    readonly gaps: ReadonlyArray<string>
    readonly reviewsTitle: string
    readonly reviews: ReadonlyArray<CourseMockInterviewQuestionReview>
    readonly retryLabel: string
    readonly newSessionLabel: string
}

/** User intents emitted by the pure result page. */
export type CourseMockInterviewResultActions = {
    readonly retry?: () => void
    readonly newSession?: () => void
}

/** Public boundary of the presentational result twin. */
export type CourseMockInterviewResultPageProps = {
    readonly state: CourseMockInterviewResultState
    readonly props: CourseMockInterviewResultData
    readonly on?: CourseMockInterviewResultActions
}

/** Presentational debrief for a URL-addressable graded interview attempt. */
export const CourseMockInterviewResultPageBase = (input: CourseMockInterviewResultPageProps) => {
    const loading = input.state === "grading"
    const ready = input.state === "ready"
    const action = [
        renderLeaf("button", {}, () => (
            <Button props={{ label: input.props.newSessionLabel, variant: "primary" }} on={{ press: input.on?.newSession }} />
        )),
        ...(ready ? [] : [
            renderLeaf("button", {}, () => (
                <Button props={{ label: input.props.retryLabel, variant: "outline" }} on={{ press: input.on?.retry }} />
            )),
        ]),
    ]

    return (
        <Grammar
            layout="course-mock-interview-result-page"
            render={layoutNode("course-mock-interview-result-page", {
                header: layoutNode("centred-title-pair", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm", tone: "muted" }} isLoading={loading} />
                    )),
                }),
                ...(input.state === "failed" ? {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{ message: input.props.failedLabel, actionLabel: input.props.retryLabel }}
                            on={{ act: input.on?.retry }}
                        />
                    )),
                } : {}),
                ...(input.state === "grading" ? {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice props={{ message: input.props.gradingLabel }} />
                    )),
                    grading: renderLeaf("progress", {}, () => (
                        <Progress props={{ label: input.props.gradingLabel }} isLoading />
                    )),
                } : {}),
                ...(ready ? {
                    scoreLabel: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                        <Text props={{ content: input.props.scoreLabel, size: "xs", tone: "muted" }} />
                    )),
                    score: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: `${input.props.score ?? 0}/100`, level: 1 }} />
                    )),
                    verdict: layoutNode("centred-title-pair", {
                        title: renderLeaf("heading", {}, () => (
                            <Heading props={{ content: input.props.verdict, level: 2 }} />
                        )),
                        description: renderLeaf("text", { size: "sm" }, () => (
                            <Text props={{ content: input.props.promptTitle, size: "sm", tone: "muted" }} />
                        )),
                    }),
                    phaseTitle: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.phaseTitle, level: 2 }} />
                    )),
                    phase: input.props.phases.map((item) => renderComposite("labelled-progress-row", {}, () => (
                        <LabelledProgressRow
                            props={{
                                id: item.id,
                                title: item.label,
                                percent: item.max === 0 ? 0 : (item.score / item.max) * 100,
                                percentText: `${item.score}/${item.max}`,
                            }}
                        />
                    ))),
                    strengthsTitle: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.strengthsTitle, level: 2 }} />
                    )),
                    strength: input.props.strengths.map((item) => renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: item, size: "sm" }} />
                    ))),
                    gapsTitle: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.gapsTitle, level: 2 }} />
                    )),
                    gap: input.props.gaps.map((item) => renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: item, size: "sm" }} />
                    ))),
                    ...(input.props.reviews.length === 0 ? {} : {
                        reviewsTitle: renderLeaf("heading", {}, () => (
                            <Heading props={{ content: input.props.reviewsTitle, level: 2 }} />
                        )),
                        review: input.props.reviews.map((item) => renderComposite("evidence-row", {}, () => (
                            <EvidenceRow
                                props={{
                                    title: `${item.title}: ${item.answer}`,
                                    subtitle: item.feedback,
                                    fact: item.scoreLabel,
                                }}
                            />
                        ))),
                    }),
                } : {}),
                action,
            })}
        />
    )
}

/** Source-level ownership marker for the pure result twin. */
