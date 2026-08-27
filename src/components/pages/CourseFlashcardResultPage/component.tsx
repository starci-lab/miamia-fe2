import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import {
    createCompositeNode,
    createGrammarNode,
    createLeafNode,
} from "@/components/contracts/props"
import type { FlashcardSessionMode } from "@/modules/api/graphql/queries/query-my-in-progress-flashcard-session"

/** One resolved weak-topic row from a persisted result projection. */
export type CourseFlashcardResultWeakTopic = {
    readonly tag: string
    readonly value: string
}

/** Pure result input after its route-specific projection resolves. */
export type CourseFlashcardResultPageProps = {
    readonly state: "pending" | "ready" | "failed"
    readonly data: {
        readonly mode: FlashcardSessionMode
        readonly title: string
        readonly subtitle: string
        readonly scoreLabel: string
        readonly scoreText?: string
        readonly reviewedLabel: string
        readonly reviewedText?: string
        readonly xpLabel: string
        readonly xpText?: string
        readonly durationLabel: string
        readonly durationText?: string
        readonly nextDueLabel: string
        readonly nextDueText?: string
        readonly breakdownTitle: string
        readonly gradeRows: ReadonlyArray<{ readonly label: string; readonly value: number }>
        readonly weakTopicsTitle: string
        readonly weakTopics: ReadonlyArray<CourseFlashcardResultWeakTopic>
        readonly failedText: string
        readonly retryLabel: string
        readonly retrySessionLabel: string
        readonly backLabel: string
    }
    readonly on: {
        readonly retryLoad: () => void
        readonly retrySession: () => void
        readonly back: () => void
    }
}

/** Renders the stable review/quiz result URL with score, history, and onward actions. */
export const CourseFlashcardResultPageBase = (input: CourseFlashcardResultPageProps) => {
    const { state, data, on } = input
    const isLoading = state === "pending"
    const statValues = [
        [data.scoreLabel, data.scoreText],
        [data.reviewedLabel, data.reviewedText],
        [data.xpLabel, data.xpText],
        [data.durationLabel, data.durationText],
    ] as const
    const header = createGrammarNode("centred-title-pair", {
        title: createLeafNode("heading", {}, () => (
            <Heading props={{ content: data.title, level: 1 }} isLoading={isLoading} />
        )),
        description: createLeafNode("text", { size: "sm" }, () => (
            <Text props={{ content: data.subtitle, size: "sm", tone: "muted" }} isLoading={isLoading} />
        )),
    })
    const stats = state === "failed"
        ? undefined
        : statValues.map(([label, value]) => createGrammarNode("flashcard-result-stat", {
            label: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                <Text props={{ content: label, size: "xs" }} isLoading={isLoading} />
            )),
            value: createLeafNode("heading", {}, () => (
                <Heading props={{ content: value, level: 2 }} isLoading={isLoading} />
            )),
        }))
    const nextDue = state === "ready" && data.nextDueText !== undefined
        ? createGrammarNode("centred-title-pair", {
            title: createLeafNode("heading", {}, () => (
                <Heading props={{ content: data.nextDueLabel, level: 3 }} />
            )),
            description: createLeafNode("text", { size: "sm" }, () => (
                <Text props={{ content: data.nextDueText, size: "sm", weight: "semibold" }} />
            )),
        })
        : undefined
    const grades = state === "ready"
        ? data.gradeRows.map((row) => createGrammarNode("flashcard-result-fact-row", {
            label: createLeafNode("text", { size: "sm", weight: "medium" }, () => (
                <Text props={{ content: row.label, size: "sm", weight: "medium" }} />
            )),
            value: createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: row.value.toString(), size: "sm", tone: "muted" }} />
            )),
        }))
        : undefined
    const weakTopics = state === "ready"
        ? data.weakTopics.map((topic) => createGrammarNode("flashcard-result-fact-row", {
            label: createLeafNode("text", { size: "sm", weight: "medium" }, () => (
                <Text props={{ content: topic.tag, size: "sm", weight: "medium" }} />
            )),
            value: createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: topic.value, size: "sm", tone: "muted" }} />
            )),
        }))
        : undefined
    const actions = state === "ready"
        ? [
            createLeafNode("button", {}, () => (
                <Button props={{ label: data.backLabel, variant: "outline" }} on={{ press: on.back }} />
            )),
            createLeafNode("button", {}, () => (
                <Button props={{ label: data.retrySessionLabel, variant: "primary" }} on={{ press: on.retrySession }} />
            )),
        ]
        : undefined
    const notice = state === "failed"
        ? createCompositeNode("empty-notice", {}, () => (
            <EmptyNotice
                props={{ message: data.failedText, actionLabel: data.retryLabel }}
                on={{ act: on.retryLoad }}
            />
        ))
        : undefined

    return (
        <Grammar contract="course-flashcard-result-page" render={createGrammarNode("course-flashcard-result-page", {
            mode: createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: data.mode === "review" ? "Review" : "Quiz", size: "sm", tone: "muted" }} />
            )),
            header,
            stat: stats,
            nextDue,
            breakdownTitle: state === "ready" && data.gradeRows.length > 0
                ? createLeafNode("heading", {}, () => (
                    <Heading props={{ content: data.breakdownTitle, level: 2 }} />
                ))
                : undefined,
            grade: grades,
            weakTopicsTitle: state === "ready" && data.weakTopics.length > 0
                ? createLeafNode("heading", {}, () => (
                    <Heading props={{ content: data.weakTopicsTitle, level: 2 }} />
                ))
                : undefined,
            weakTopic: weakTopics,
            action: actions,
            notice,
        })} />
    )
}

/** Canon metadata for the pure page half. */
export const meta = { world: "pure", domain: "learn" } as const
