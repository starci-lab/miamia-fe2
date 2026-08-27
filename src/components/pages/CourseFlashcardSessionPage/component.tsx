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

/** Pure live-session states frozen by the approved A3 review. */
export type CourseFlashcardSessionState = "pending" | "active" | "syncing" | "completing" | "expired" | "failed"

/** Resolved display values for one focused review or quiz card. */
export type CourseFlashcardSessionPageData = {
    readonly mode: FlashcardSessionMode
    readonly title: string
    readonly progressText: string
    readonly deckTitle?: string
    readonly level?: string | null
    readonly prompt?: string
    readonly answer?: string
    readonly answerVisible: boolean
    readonly revealLabel: string
    readonly againLabel: string
    readonly hardLabel: string
    readonly goodLabel: string
    readonly easyLabel: string
    readonly correctLabel: string
    readonly incorrectLabel: string
    readonly syncingLabel: string
    readonly completingLabel: string
    readonly expiredText: string
    readonly failedText: string
    readonly retryLabel: string
    readonly leaveLabel: string
}

/** Resolved actions owned by the connected live-session page. */
export type CourseFlashcardSessionPageActions = {
    readonly reveal: () => void
    readonly rate: (grade: 0 | 1 | 2 | 3) => void
    readonly answerQuiz: (correct: boolean) => void
    readonly retry: () => void
    readonly leave: () => void
}

/** Pure live-session input after backend state and locale copy resolve. */
export type CourseFlashcardSessionPageProps = {
    readonly state: CourseFlashcardSessionState
    readonly data: CourseFlashcardSessionPageData
    readonly on: CourseFlashcardSessionPageActions
}

/** Renders one focused review/quiz card and its finite lifecycle controls. */
export const CourseFlashcardSessionPageBase = (input: CourseFlashcardSessionPageProps) => {
    const { state, data, on } = input
    const isLoading = state === "pending"
    const settledFailure = state === "failed" || state === "expired"
    const header = createGrammarNode("flashcard-session-header", {
        deck: data.deckTitle === undefined
            ? undefined
            : createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: data.deckTitle, size: "sm", tone: "muted" }} isLoading={isLoading} />
            )),
        title: createLeafNode("heading", {}, () => (
            <Heading props={{ content: data.title, level: 1 }} isLoading={isLoading} />
        )),
        leave: createLeafNode("button", {}, () => (
            <Button props={{ label: data.leaveLabel, variant: "outline" }} on={{ press: on.leave }} />
        )),
    })
    const progress = settledFailure
        ? undefined
        : createGrammarNode("label-with-muted-fact-row", {
            label: createLeafNode("text", { size: "sm", weight: "semibold" }, () => (
                <Text props={{ content: data.progressText, size: "sm", weight: "semibold" }} isLoading={isLoading} />
            )),
            fact: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                <Text props={{ content: data.level ?? undefined, size: "xs" }} isLoading={isLoading} />
            )),
        })
    const card = settledFailure
        ? undefined
        : createGrammarNode("flashcard-session-card", {
            prompt: createLeafNode("text", { size: "md", weight: "medium" }, () => (
                <Text props={{ content: data.prompt, size: "md", weight: "medium" }} isLoading={isLoading} />
            )),
            answer: data.answerVisible
                ? createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: data.answer, size: "sm", tone: "muted" }} />
                ))
                : undefined,
        })
    const status = state === "syncing" || state === "completing"
        ? createLeafNode("text", { size: "sm", tone: "muted" }, () => (
            <Text
                props={{
                    content: state === "syncing" ? data.syncingLabel : data.completingLabel,
                    size: "sm",
                    tone: "muted",
                    live: "polite",
                }}
            />
        ))
        : undefined
    let actions
    if (state !== "active") {
        actions = undefined
    } else if (!data.answerVisible) {
        actions = [createLeafNode("button", {}, () => (
            <Button props={{ label: data.revealLabel, variant: "primary" }} on={{ press: on.reveal }} />
        ))]
    } else if (data.mode === "review") {
        actions = ([data.againLabel, data.hardLabel, data.goodLabel, data.easyLabel] as const).map((label, grade) => (
            createLeafNode("button", {}, () => (
                <Button props={{ label, variant: grade === 2 ? "primary" : "outline" }} on={{ press: () => on.rate(grade as 0 | 1 | 2 | 3) }} />
            ))
        ))
    } else {
        actions = [
            createLeafNode("button", {}, () => (
                <Button props={{ label: data.incorrectLabel, variant: "outline" }} on={{ press: () => on.answerQuiz(false) }} />
            )),
            createLeafNode("button", {}, () => (
                <Button props={{ label: data.correctLabel, variant: "primary" }} on={{ press: () => on.answerQuiz(true) }} />
            )),
        ]
    }
    const notice = settledFailure
        ? createCompositeNode("empty-notice", {}, () => (
            <EmptyNotice
                props={{
                    message: state === "expired" ? data.expiredText : data.failedText,
                    actionLabel: data.retryLabel,
                }}
                on={{ act: on.retry }}
            />
        ))
        : undefined

    return (
        <Grammar contract="course-flashcard-session-page" render={createGrammarNode("course-flashcard-session-page", {
            header,
            progress,
            card,
            status,
            action: actions,
            notice,
        })} />
    )
}

/** Canon metadata for the pure page half. */
export const meta = { world: "pure", domain: "learn" } as const
