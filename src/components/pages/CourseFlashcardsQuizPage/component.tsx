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

/** Pure quiz-setup layout after configuration facts and actions resolve. */
export type CourseFlashcardsQuizPageProps = {
    readonly state: "pending" | "ready" | "empty" | "failed"
    readonly props: {
        readonly title: string
        readonly subtitle: string
        readonly reviewLabel: string
        readonly quizLabel: string
        readonly configurationTitle: string
        readonly modeLabel: string
        readonly quickLabel: string
        readonly deepLabel: string
        readonly levelLabel: string
        readonly allLevelsLabel: string
        readonly juniorLabel: string
        readonly middleLabel: string
        readonly seniorLabel: string
        readonly staffLabel: string
        readonly startLabel: string
        readonly resumeLabel: string
        readonly retryLabel: string
        readonly emptyText: string
        readonly failedText: string
        readonly selectedMode: "quick" | "deep"
        readonly selectedLevel: string | null
        readonly cardCount: number
        readonly cardsLabel: string
        readonly resumeSessionId?: string
    }
    readonly on: {
        readonly openReview: () => void
        readonly selectMode: (mode: "quick" | "deep") => void
        readonly selectLevel: (level: string | null) => void
        readonly start: () => void
        readonly resume: (sessionId: string) => void
        readonly retry: () => void
    }
}

/** Renders the legacy quiz setup hierarchy without fetching or routing internally. */
export const CourseFlashcardsQuizPageBase = (input: CourseFlashcardsQuizPageProps) => {
    const state = input.state
    const data = input.props
    const on = input.on
    const isLoading = state === "pending"
    const levels = [
        { id: null, label: data.allLevelsLabel },
        { id: "junior", label: data.juniorLabel },
        { id: "middle", label: data.middleLabel },
        { id: "senior", label: data.seniorLabel },
        { id: "staff", label: data.staffLabel },
    ] as const
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
                <NavLink props={{ label: data.reviewLabel, kind: "tab" }} on={{ press: on.openReview }} />
            )),
            renderLeaf("nav-link", { kind: "tab" }, () => (
                <NavLink props={{ label: data.quizLabel, kind: "tab", isCurrent: true }} />
            )),
        ],
    })
    const configuration = state === "ready" || state === "pending"
        ? layoutNode("flashcard-quiz-configuration", {
            title: renderLeaf("heading", {}, () => (
                <Heading props={{ content: data.configurationTitle, level: 2 }} isLoading={isLoading} />
            )),
            fact: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                <Text props={{ content: `${data.cardCount} ${data.cardsLabel}`, size: "sm", tone: "muted" }} isLoading={isLoading} />
            )),
            resume: data.resumeSessionId === undefined
                ? undefined
                : renderLeaf("button", {}, () => (
                    <Button props={{ label: data.resumeLabel, variant: "outline" }} on={{ press: () => on.resume(data.resumeSessionId ?? "") }} />
                )),
            modeLabel: renderLeaf("text", { size: "sm", weight: "semibold" }, () => (
                <Text props={{ content: data.modeLabel, size: "sm", weight: "semibold" }} isLoading={isLoading} />
            )),
            mode: (["quick", "deep"] as const).map((mode) => renderLeaf("button", {}, () => (
                <Button
                    props={{
                        label: mode === "quick" ? data.quickLabel : data.deepLabel,
                        variant: data.selectedMode === mode ? "primary" : "outline",
                    }}
                    on={{ press: () => on.selectMode(mode) }}
                    isLoading={isLoading}
                />
            ))),
            levelLabel: renderLeaf("text", { size: "sm", weight: "semibold" }, () => (
                <Text props={{ content: data.levelLabel, size: "sm", weight: "semibold" }} isLoading={isLoading} />
            )),
            level: levels.map((level) => renderLeaf("button", {}, () => (
                <Button
                    props={{
                        label: level.label,
                        variant: data.selectedLevel === level.id ? "primary" : "outline",
                    }}
                    on={{ press: () => on.selectLevel(level.id) }}
                    isLoading={isLoading}
                />
            ))),
            start: renderLeaf("button", {}, () => (
                <Button props={{ label: data.startLabel, variant: "primary" }} on={{ press: on.start }} isLoading={isLoading} />
            )),
        })
        : undefined
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

    return (
        <Grammar layout="course-flashcards-quiz-page" render={layoutNode("course-flashcards-quiz-page", {
            header,
            modes,
            configuration,
            notice,
        })} />
    )
}

/** Canon metadata for the pure page half. */
