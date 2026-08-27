import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { LabelledProgressRow } from "@/components/composites/LabelledProgressRow"
import { Article } from "@/components/leaves/Article"
import { Button } from "@/components/leaves/Button"
import { ConfirmButton } from "@/components/leaves/ConfirmButton"
import { Heading } from "@/components/leaves/Heading"
import { SingleChoice, type SingleChoiceOptionData } from "@/components/leaves/SingleChoice"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createLeafNode, type BlockProps } from "@/components/contracts/props"

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

const factRow = (label: string, value: string) => createGrammarNode("label-with-muted-fact-row", {
    label: createLeafNode("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: label, size: "sm", weight: "semibold" }} />),
    fact: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: value, size: "xs" }} />),
})

/** Renders the pure exam runner and graded-result states. */
export const ExamSessionBase = (input: ExamSessionProps) => {
    const header = createGrammarNode("exam-session-header", {
        title: createGrammarNode("title-with-baseline-fact", {
            title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
            fact: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.positionLabel, size: "sm", tone: "muted" }} />),
        }),
        exit: createLeafNode("confirm-button", {}, () => <ConfirmButton props={{ label: input.props.exitLabel, confirmLabel: input.props.exitConfirmLabel, disabled: input.state === "submitting" }} on={{ confirm: input.on?.exit }} />),
    })
    if (input.state === "loading" || input.state === "failed") {
        return <Grammar contract="exam-session-page" render={createGrammarNode("exam-session-page", {
            header,
            body: createGrammarNode("exam-state-notice", {
                notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ icon: "review", message: input.state === "loading" ? input.props.loadingMessage : input.props.failedMessage, actionLabel: input.state === "failed" ? input.props.retryLabel : undefined }} on={{ act: input.on?.retry }} />),
            }),
        })} />
    }
    if (input.state === "graded") {
        return <Grammar contract="exam-session-page" render={createGrammarNode("exam-session-page", {
            header,
            body: createGrammarNode("exam-result-summary", {
                score: createGrammarNode("premium-value-band", {
                    copy: createGrammarNode("premium-copy-stack", {
                        title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.resultTitle, level: 2 }} />),
                        body: createLeafNode("text", {}, () => <Text props={{ content: `${input.props.scoreText} · ${input.props.scoreBody}` }} />),
                    }),
                }),
                ...(input.props.skills.length === 0 ? {} : {
                    skills: createGrammarNode("exam-skill-list", {
                        title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.skillTitle, level: 2 }} />),
                        skill: input.props.skills.map((skill) => createCompositeNode("labelled-progress-row", {}, () => <LabelledProgressRow key={skill.id} props={skill} />)),
                    }),
                }),
                answers: createGrammarNode("exam-answer-review-list", {
                    answer: input.props.reviews.map((review) => createGrammarNode("exam-answer-review", {
                        title: createGrammarNode("title-with-baseline-fact", {
                            title: createLeafNode("heading", {}, () => <Heading props={{ content: review.number, level: 3 }} />),
                            fact: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: review.verdict, size: "sm", tone: "muted" }} />),
                        }),
                        stem: createLeafNode("text", {}, () => <Text props={{ content: review.stem }} />),
                        selected: factRow(review.selectedLabel, review.selected),
                        correct: factRow(review.correctLabel, review.correct),
                        ...(review.explanation === undefined ? {} : { explanation: createLeafNode("article", {}, () => <Article props={{ body: review.explanation }} />) }),
                    })),
                }),
                actions: createGrammarNode("exam-session-actions", {
                    progress: createLeafNode("text", {}, () => <Text props={{ content: input.props.scoreText, size: "sm", tone: "muted" }} />),
                    forward: createLeafNode("button", {}, () => <Button props={{ label: input.props.backLabel, variant: "primary" }} on={{ press: input.on?.back }} />),
                }),
            }),
        })} />
    }
    return <Grammar contract="exam-session-page" render={createGrammarNode("exam-session-page", {
        header,
        body: createGrammarNode("exam-passage-question", {
            ...(input.props.passage === undefined ? {} : { passage: createLeafNode("article", {}, () => <Article props={{ body: input.props.passage }} />) }),
            question: createGrammarNode("exam-question-card", {
                eyebrow: createLeafNode("text", {}, () => <Text props={{ content: input.props.questionLabel, size: "sm", tone: "accent" }} />),
                stem: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.stem, level: 2 }} />),
                answer: createLeafNode("single-choice", {}, () => <SingleChoice props={{ label: input.props.questionLabel, name: "exam-answer", options: input.props.options, selectedKey: input.props.selectedKey, disabled: input.state === "submitting" }} on={{ select: input.on?.selectAnswer }} />),
            }),
        }),
        actions: createGrammarNode("exam-session-actions", {
            previous: createLeafNode("button", {}, () => <Button props={{ label: input.props.previousLabel, variant: "ghost" }} on={{ press: input.on?.previous }} />),
            progress: createLeafNode("text", {}, () => <Text props={{ content: input.props.positionLabel, size: "sm", tone: "muted" }} />),
            forward: createLeafNode("button", {}, () => <Button props={{ label: input.props.isLast ? input.props.submitLabel : input.props.nextLabel, variant: "primary", isPending: input.state === "submitting" }} on={{ press: input.props.isLast ? input.on?.submit : input.on?.forward }} />),
        }),
    })} />
}

/** Declares the component architecture metadata. */
export const meta = { shape: "block", world: "pure", domain: "exam" } as const
