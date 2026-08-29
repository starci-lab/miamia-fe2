import { Grammar } from "@/components/layouts/Grammar"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** One setup choice presented to the learner. */
export type MockInterviewSetupChoice = {
    readonly id: string
    readonly label: string
}

/** The situations the mock-interview green room can present. */
export type CourseMockInterviewSetupState = "pending" | "ready" | "resumable" | "starting" | "failed"

/** Resolved setup copy and current configuration. */
export type CourseMockInterviewSetupData = {
    readonly title: string
    readonly description: string
    readonly status?: string
    readonly levelLabel: string
    readonly modeLabel: string
    readonly levels: ReadonlyArray<MockInterviewSetupChoice>
    readonly modes: ReadonlyArray<MockInterviewSetupChoice>
    readonly selectedLevel: string
    readonly selectedMode: string
    readonly startLabel: string
    readonly resumeLabel: string
    readonly retryLabel: string
}

/** Actions emitted by the pure setup page. */
export type CourseMockInterviewSetupActions = {
    readonly configure?: (field: "level" | "mode", value: string) => void
    readonly start?: () => void
    readonly resume?: () => void
    readonly retry?: () => void
}

/** Props for the presentational mock-interview setup twin. */
export type CourseMockInterviewSetupPageProps = {
    readonly state: CourseMockInterviewSetupState
    readonly props: CourseMockInterviewSetupData
    readonly on?: CourseMockInterviewSetupActions
}

/** Draw the setup, resumable, loading and failed green-room states. */
export const CourseMockInterviewSetupPageBase = (input: CourseMockInterviewSetupPageProps) => {
    const loading = input.state === "pending"
    const starting = input.state === "starting"
    const level = input.props.levels.map((choice) => renderLeaf("button", {}, () => (
        <Button
            props={{
                label: choice.label,
                variant: choice.id === input.props.selectedLevel ? "primary" : "ghost",
                disabled: loading || starting,
            }}
            on={{ press: () => input.on?.configure?.("level", choice.id) }}
            isLoading={loading}
        />
    )))
    const mode = input.props.modes.map((choice) => renderLeaf("button", {}, () => (
        <Button
            props={{
                label: choice.label,
                variant: choice.id === input.props.selectedMode ? "primary" : "ghost",
                disabled: loading || starting,
            }}
            on={{ press: () => input.on?.configure?.("mode", choice.id) }}
            isLoading={loading}
        />
    )))
    const action = input.state === "failed" ? [
        renderLeaf("button", {}, () => (
            <Button props={{ label: input.props.retryLabel, variant: "primary" }} on={{ press: input.on?.retry }} />
        )),
    ] : [
        renderLeaf("button", {}, () => (
            <Button
                props={{
                    label: input.props.startLabel,
                    variant: "primary",
                    disabled: loading || starting,
                    isPending: starting,
                }}
                on={{ press: input.on?.start }}
                isLoading={loading}
            />
        )),
        ...(input.state !== "resumable" ? [] : [
            renderLeaf("button", {}, () => (
                <Button props={{ label: input.props.resumeLabel, variant: "ghost" }} on={{ press: input.on?.resume }} />
            )),
        ]),
    ]

    return (
        <Grammar
            layout="course-mock-interview-setup-page"
            render={layoutNode("course-mock-interview-setup-page", {
                header: layoutNode("centred-title-pair", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm" }} isLoading={loading} />
                    )),
                }),
                levelLabel: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: input.props.levelLabel, size: "sm", tone: "muted" }} isLoading={loading} />
                )),
                level,
                modeLabel: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: input.props.modeLabel, size: "sm", tone: "muted" }} isLoading={loading} />
                )),
                mode,
                ...(input.props.status === undefined ? {} : {
                    status: renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                        <Text
                            props={{
                                content: input.props.status,
                                size: "sm",
                                tone: "muted",
                                live: input.state === "failed" ? "assertive" : "polite",
                            }}
                        />
                    )),
                }),
                action,
            })}
        />
    )
}

/** Source-level ownership marker for the pure setup twin. */
