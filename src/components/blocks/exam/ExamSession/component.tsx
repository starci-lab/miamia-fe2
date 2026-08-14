import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { LabelledProgressRow } from "@/components/composites/LabelledProgressRow"
import { Article } from "@/components/leaves/Article"
import { Button } from "@/components/leaves/Button"
import { ConfirmButton } from "@/components/leaves/ConfirmButton"
import { Heading } from "@/components/leaves/Heading"
import { SingleChoice, type SingleChoiceOptionData } from "@/components/leaves/SingleChoice"
import { Text } from "@/components/leaves/Text"
import { defineCompositeComponent, defineContractComponent, defineLeafComponent, type BlockProps } from "@/components/contracts/props"

/** Summarizes the learner's graded performance for one skill. */
export type ExamSkillSummary = { readonly id: string; readonly title: string; readonly percent: number; readonly percentText: string }
/** Describes one answer shown in the graded review. */
export type ExamAnswerReviewData = { readonly id: string; readonly number: string; readonly verdict: string; readonly stem: string; readonly selectedLabel: string; readonly selected: string; readonly correctLabel: string; readonly correct: string; readonly explanation?: string }
/** Holds the display data for every exam-session state. */
export type ExamSessionData = {
    readonly title: string; readonly positionLabel: string; readonly exitLabel: string; readonly exitConfirmLabel: string
    readonly passage?: string; readonly questionLabel: string; readonly stem: string; readonly options: ReadonlyArray<SingleChoiceOptionData>; readonly selectedKey?: string
    readonly previousLabel: string; readonly nextLabel: string; readonly submitLabel: string; readonly isLast: boolean
    readonly loadingMessage: string; readonly failedMessage: string; readonly retryLabel: string
    readonly resultTitle: string; readonly scoreText: string; readonly scoreBody: string; readonly skillTitle: string; readonly skills: ReadonlyArray<ExamSkillSummary>; readonly reviews: ReadonlyArray<ExamAnswerReviewData>; readonly backLabel: string
}
/** Defines the learner actions supported by the exam session. */
export type ExamSessionActions = { readonly selectAnswer?: (id: string) => void; readonly previous?: () => void; readonly forward?: () => void; readonly submit?: () => void; readonly exit?: () => void; readonly retry?: () => void; readonly back?: () => void }
/** Defines the stateful contract consumed by the pure exam-session block. */
export type ExamSessionProps = BlockProps<"loading" | "failed" | "ready" | "submitting" | "graded", ExamSessionData> & { readonly on?: ExamSessionActions }

const factRow = (label: string, value: string) => defineContractComponent("label-with-muted-fact-row", {
    label: defineLeafComponent("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: label, size: "sm", weight: "semibold" }} />),
    fact: defineLeafComponent("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: value, size: "xs" }} />),
})

/** Renders the pure exam runner and graded-result states. */
export const _ExamSession = (input: ExamSessionProps) => {
    const header = defineContractComponent("exam-session-header", {
        title: defineContractComponent("title-with-baseline-fact", {
            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
            fact: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.positionLabel, size: "sm", tone: "muted" }} />),
        }),
        exit: defineLeafComponent("confirm-button", {}, () => <ConfirmButton props={{ label: input.props.exitLabel, confirmLabel: input.props.exitConfirmLabel, disabled: input.state === "submitting" }} on={{ confirm: input.on?.exit }} />),
    })
    if (input.state === "loading" || input.state === "failed") {
        return <Tree contract="exam-session-page" render={defineContractComponent("exam-session-page", {
            header,
            body: defineContractComponent("exam-state-notice", {
                notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ icon: "review", message: input.state === "loading" ? input.props.loadingMessage : input.props.failedMessage, actionLabel: input.state === "failed" ? input.props.retryLabel : undefined }} on={{ act: input.on?.retry }} />),
            }),
        })} />
    }
    if (input.state === "graded") {
        return <Tree contract="exam-session-page" render={defineContractComponent("exam-session-page", {
            header,
            body: defineContractComponent("exam-result-summary", {
                score: defineContractComponent("premium-value-band", {
                    copy: defineContractComponent("premium-copy-stack", {
                        title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.resultTitle, level: 2 }} />),
                        body: defineLeafComponent("text", {}, () => <Text props={{ content: `${input.props.scoreText} · ${input.props.scoreBody}` }} />),
                    }),
                }),
                ...(input.props.skills.length === 0 ? {} : {
                    skills: defineContractComponent("exam-skill-list", {
                        title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.skillTitle, level: 2 }} />),
                        skill: input.props.skills.map((skill) => defineCompositeComponent("labelled-progress-row", {}, () => <LabelledProgressRow key={skill.id} props={skill} />)),
                    }),
                }),
                answers: defineContractComponent("exam-answer-review-list", {
                    answer: input.props.reviews.map((review) => defineContractComponent("exam-answer-review", {
                        title: defineContractComponent("title-with-baseline-fact", {
                            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: review.number, level: 3 }} />),
                            fact: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: review.verdict, size: "sm", tone: "muted" }} />),
                        }),
                        stem: defineLeafComponent("text", {}, () => <Text props={{ content: review.stem }} />),
                        selected: factRow(review.selectedLabel, review.selected),
                        correct: factRow(review.correctLabel, review.correct),
                        ...(review.explanation === undefined ? {} : { explanation: defineLeafComponent("article", {}, () => <Article props={{ body: review.explanation }} />) }),
                    })),
                }),
                actions: defineContractComponent("exam-session-actions", {
                    progress: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.scoreText, size: "sm", tone: "muted" }} />),
                    forward: defineLeafComponent("button", {}, () => <Button props={{ label: input.props.backLabel, variant: "primary" }} on={{ press: input.on?.back }} />),
                }),
            }),
        })} />
    }
    return <Tree contract="exam-session-page" render={defineContractComponent("exam-session-page", {
        header,
        body: defineContractComponent("exam-passage-question", {
            ...(input.props.passage === undefined ? {} : { passage: defineLeafComponent("article", {}, () => <Article props={{ body: input.props.passage }} />) }),
            question: defineContractComponent("exam-question-card", {
                eyebrow: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.questionLabel, size: "sm", tone: "accent" }} />),
                stem: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.stem, level: 2 }} />),
                answer: defineLeafComponent("single-choice", {}, () => <SingleChoice props={{ label: input.props.questionLabel, name: "exam-answer", options: input.props.options, selectedKey: input.props.selectedKey, disabled: input.state === "submitting" }} on={{ select: input.on?.selectAnswer }} />),
            }),
        }),
        actions: defineContractComponent("exam-session-actions", {
            previous: defineLeafComponent("button", {}, () => <Button props={{ label: input.props.previousLabel, variant: "ghost" }} on={{ press: input.on?.previous }} />),
            progress: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.positionLabel, size: "sm", tone: "muted" }} />),
            forward: defineLeafComponent("button", {}, () => <Button props={{ label: input.props.isLast ? input.props.submitLabel : input.props.nextLabel, variant: "primary", isPending: input.state === "submitting" }} on={{ press: input.props.isLast ? input.on?.submit : input.on?.forward }} />),
        }),
    })} />
}

/** Declares the component architecture metadata. */
export const meta = { shape: "block", world: "pure", domain: "exam" } as const
