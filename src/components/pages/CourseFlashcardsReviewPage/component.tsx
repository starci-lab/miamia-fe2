import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { NavLink } from "@/components/leaves/NavLink"
import { Text } from "@/components/leaves/Text"
import {
    renderComposite,
    layoutNode,
    renderLeaf,
} from "@/modules/types/layout"

/** One settled deck row rendered by the review overview. */
export type FlashcardReviewDeckRow = {
    readonly id: string
    readonly title: string
    readonly description: string
    readonly difficulty: string
    readonly cardCount: number
    readonly dueCount: number
    readonly masteredCount: number
}

/** Pure review-overview layout after all live values and actions resolve. */
export type CourseFlashcardsReviewPageProps = {
    readonly state: "pending" | "ready" | "empty" | "failed"
    readonly props: {
        readonly title: string
        readonly subtitle: string
        readonly reviewLabel: string
        readonly quizLabel: string
        readonly dueTitle: string
        readonly dueDescription: string
        readonly statsTitle: string
        readonly streakText: string
        readonly retentionText: string
        readonly decksTitle: string
        readonly cardsLabel: string
        readonly dueLabel: string
        readonly masteredLabel: string
        readonly startLabel: string
        readonly resumeLabel: string
        readonly retryLabel: string
        readonly emptyText: string
        readonly failedText: string
        readonly dueCount: number
        readonly decks: ReadonlyArray<FlashcardReviewDeckRow>
        readonly resumeSessionId?: string
    }
    readonly on: {
        readonly openQuiz: () => void
        readonly startDue: () => void
        readonly startDeck: (deckId: string) => void
        readonly resume: (sessionId: string) => void
        readonly retry: () => void
    }
}

/** The due card's action: resume a session in progress, start the due queue, or nothing left to do. */
const resolveDueAction = (
    data: CourseFlashcardsReviewPageProps["props"],
    on: CourseFlashcardsReviewPageProps["on"],
) => {
    const { resumeSessionId } = data
    if (resumeSessionId !== undefined) {
        return renderLeaf("button", {}, () => (
            <Button props={{ label: data.resumeLabel, variant: "primary" }} on={{ press: () => on.resume(resumeSessionId) }} />
        ))
    }
    if (data.dueCount === 0) return undefined
    return renderLeaf("button", {}, () => (
        <Button props={{ label: data.startLabel, variant: "primary" }} on={{ press: on.startDue }} />
    ))
}

/** Skeleton deck cards shown while the review overview is loading. */
const pendingDeckCards = (data: CourseFlashcardsReviewPageProps["props"]) => (
    Array.from({ length: 4 }, (_, index) => layoutNode("flashcard-review-deck-card", {
        title: renderLeaf("heading", {}, () => (
            <Heading props={{ content: data.decksTitle, level: 3 }} isLoading />
        )),
        description: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
            <Text props={{ size: "sm", tone: "muted" }} isLoading />
        )),
        facts: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ size: "xs" }} isLoading />
        )),
        action: renderLeaf("button", {}, () => (
            <Button props={{ label: `${data.startLabel} ${index + 1}` }} isLoading />
        )),
    }))
)

/** Settled deck cards, one per deck the course has. */
const readyDeckCards = (
    data: CourseFlashcardsReviewPageProps["props"],
    on: CourseFlashcardsReviewPageProps["on"],
) => (
    data.decks.map((deck) => layoutNode("flashcard-review-deck-card", {
        title: renderLeaf("heading", {}, () => (
            <Heading props={{ content: deck.title, level: 3 }} />
        )),
        description: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
            <Text props={{ content: deck.description, size: "sm", tone: "muted" }} />
        )),
        facts: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
            <Text
                props={{
                    content: `${deck.cardCount} ${data.cardsLabel} · ${deck.dueCount} ${data.dueLabel} · ${deck.masteredCount} ${data.masteredLabel}`,
                    size: "xs",
                }}
            />
        )),
        action: renderLeaf("button", {}, () => (
            <Button props={{ label: data.startLabel, variant: "primary" }} on={{ press: () => on.startDeck(deck.id) }} />
        )),
    }))
)

/** Which deck cards to render, by overview state. */
const resolveDeckCards = (
    state: CourseFlashcardsReviewPageProps["state"],
    data: CourseFlashcardsReviewPageProps["props"],
    on: CourseFlashcardsReviewPageProps["on"],
) => {
    if (state === "pending") return pendingDeckCards(data)
    if (state === "ready") return readyDeckCards(data, on)
    return undefined
}

/** Renders the legacy review hierarchy without fetching or routing internally. */
export const CourseFlashcardsReviewPageBase = (input: CourseFlashcardsReviewPageProps) => {
    const state = input.state
    const data = input.props
    const on = input.on
    const isLoading = state === "pending"
    const header = layoutNode("centred-title-pair", {
        title: renderLeaf("heading", {}, () => (
            <Heading props={{ content: data.title, level: 1 }} isLoading={isLoading} />
        )),
        description: renderLeaf("text", { size: "sm" }, () => (
            <Text props={{ content: data.subtitle, size: "sm", tone: "muted" }} isLoading={isLoading} />
        )),
    })
    const modes = layoutNode("flashcard-mode-tabs", {
        tab: [
            renderLeaf("nav-link", { kind: "tab" }, () => (
                <NavLink props={{ label: data.reviewLabel, kind: "tab", isCurrent: true }} />
            )),
            renderLeaf("nav-link", { kind: "tab" }, () => (
                <NavLink props={{ label: data.quizLabel, kind: "tab" }} on={{ press: on.openQuiz }} />
            )),
        ],
    })
    const notice = state === "failed" || state === "empty"
        ? renderComposite("empty-notice", {}, () => (
            <EmptyNotice
                props={{
                    message: state === "failed" ? data.failedText : data.emptyText,
                    actionLabel: state === "failed" ? data.retryLabel : undefined,
                }}
                on={{ act: on.retry }}
            />
        ))
        : undefined
    const due = state === "ready"
        ? layoutNode("flashcard-review-due-card", {
            title: renderLeaf("heading", {}, () => (
                <Heading props={{ content: data.dueTitle, level: 2 }} />
            )),
            description: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: data.dueDescription, size: "sm", tone: "muted" }} />
            )),
            fact: renderLeaf("text", { size: "sm", weight: "medium" }, () => (
                <Text props={{ content: `${data.dueCount} ${data.dueLabel}`, size: "sm", weight: "medium" }} />
            )),
            action: resolveDueAction(data, on),
        })
        : undefined
    const stats = state === "ready"
        ? layoutNode("centred-title-pair", {
            title: renderLeaf("heading", {}, () => (
                <Heading props={{ content: data.statsTitle, level: 2 }} />
            )),
            description: renderLeaf("text", { size: "sm" }, () => (
                <Text props={{ content: `${data.streakText} · ${data.retentionText}`, size: "sm", tone: "muted" }} />
            )),
        })
        : undefined
    const decks = resolveDeckCards(state, data, on)

    return (
        <Grammar layout="course-flashcards-review-page" render={layoutNode("course-flashcards-review-page", {
            header,
            modes,
            due,
            stats,
            decksTitle: state === "ready" || state === "pending"
                ? renderLeaf("heading", {}, () => (
                    <Heading props={{ content: data.decksTitle, level: 2 }} isLoading={isLoading} />
                ))
                : undefined,
            deck: decks,
            notice,
        })} />
    )
}

/** Canon metadata for the pure page half. */
