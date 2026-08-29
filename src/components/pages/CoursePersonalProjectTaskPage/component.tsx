import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"

/** Pure state and actions for one personal-project task submission surface. */
export type CoursePersonalProjectTaskPageProps = {
    readonly state: "pending" | "ready" | "submitting" | "failed"
    readonly props: {
        readonly title: string
        readonly description: string
        readonly scoreLabel?: string
        readonly notice?: string
        readonly submitLabel: string
        readonly retryLabel: string
    }
    readonly on?: {
        readonly submit?: () => void
        readonly retry?: () => void
    }
}

/** Draws task loading, submission and recovery states without fetching data. */
export const CoursePersonalProjectTaskPageBase = (input: CoursePersonalProjectTaskPageProps) => {
    const loading = input.state === "pending"
    const failed = input.state === "failed"
    const controls = failed
        ? [
            renderLeaf("text", {}, () => (
                <Text props={{ content: input.props.notice, live: "assertive" }} />
            )),
            renderLeaf("button", {}, () => (
                <Button props={{ label: input.props.retryLabel }} on={{ press: input.on?.retry }} />
            )),
        ]
        : [
            renderLeaf("text", { size: "sm", tone: "muted" }, () => (
                <Text
                    props={{ content: input.props.scoreLabel, size: "sm", tone: "muted" }}
                    isLoading={loading}
                />
            )),
            renderLeaf("button", {}, () => (
                <Button
                    props={{
                        label: input.props.submitLabel,
                        variant: "primary",
                        isPending: input.state === "submitting",
                    }}
                    on={{ press: input.on?.submit }}
                    isLoading={loading}
                />
            )),
        ]

    return (
        <Grammar
            layout="course-personal-project-task-page"
            render={layoutNode("course-personal-project-task-page", {
                header: layoutNode("centred-title-pair", {
                    title: renderLeaf("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />
                    )),
                    description: renderLeaf("text", { size: "sm" }, () => (
                        <Text props={{ content: input.props.description, size: "sm" }} isLoading={loading} />
                    )),
                }),
                controls: layoutNode("stacked-peer-controls", { control: controls }),
            })}
        />
    )
}

/** Architectural identity for the pure task page twin. */
