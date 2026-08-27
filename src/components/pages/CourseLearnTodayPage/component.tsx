import { Grammar } from "@/components/branches/Grammar"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Heading } from "@/components/leaves/Heading"
import { Progress } from "@/components/leaves/Progress"
import { SeeMoreLink } from "@/components/leaves/SeeMoreLink"
import { Text } from "@/components/leaves/Text"
import {
    createCompositeNode,
    createGrammarNode,
    createGrammarProjection,
    createLeafNode,
} from "@/components/contracts/props"
import type { LearnMobileView } from "@/components/layouts/LearnShellLayout/component"

/** The settled loading situation of the Today route. */
export type CourseLearnTodayState = "pending" | "ready" | "empty" | "failed"

/** One backend-proven next step displayed by Today. */
export type CourseLearnTodayItem = {
    readonly id: string
    readonly title: string
    readonly kind: string
    readonly actionLabel: string
}

/** Resolved copy and ranked work rendered by the pure Today page. */
export type CourseLearnTodayData = {
    readonly title: string
    readonly subtitle: string
    readonly primaryLabel: string
    readonly secondaryLabel: string
    readonly courseLabel: string
    readonly progressLabel: string
    readonly progressFact?: string
    readonly progressValue?: number
    readonly primary?: CourseLearnTodayItem
    readonly secondary: ReadonlyArray<CourseLearnTodayItem>
    readonly course: CourseLearnTodayItem
    readonly emptyMessage: string
    readonly failedMessage: string
    readonly retryLabel: string
}

/** Navigation and recovery events reported by the pure Today page. */
export type CourseLearnTodayActions = {
    readonly open?: (id: string) => void
    readonly retry?: () => void
}

/** Props accepted by the pure Today page twin. */
export type CourseLearnTodayPageProps = {
    readonly state: CourseLearnTodayState
    readonly mobileView: Extract<LearnMobileView, "today" | "course" | "progress">
    readonly props: CourseLearnTodayData
    readonly on?: CourseLearnTodayActions
}

/** Notice shape for a non-ready Today page; undefined once there is real work to show. */
type CourseLearnTodayNotice = { readonly message: string; readonly actionLabel?: string }

/** Which notice the Today route shows: the failed retry, the genuinely empty state, or none. */
const resolveTodayNotice = (
    state: CourseLearnTodayState,
    props: CourseLearnTodayData,
): CourseLearnTodayNotice | undefined => {
    if (state === "failed") return { message: props.failedMessage, actionLabel: props.retryLabel }
    if (state === "empty") return { message: props.emptyMessage }
    return undefined
}

const resumeCard = (
    item: CourseLearnTodayItem,
    open: CourseLearnTodayActions["open"],
    isLoading = false,
) => createGrammarNode("resume-item-card", {
    title: createLeafNode("text", { size: "md", weight: "medium" }, () => (
        <Text props={{ content: item.title, size: "md", weight: "medium" }} isLoading={isLoading} />
    )),
    kind: createLeafNode("text", { size: "sm", tone: "muted" }, () => (
        <Text props={{ content: item.kind, size: "sm", tone: "muted" }} isLoading={isLoading} />
    )),
    resume: createLeafNode("see-more-link", {}, () => (
        <SeeMoreLink props={{ label: item.actionLabel }} on={{ press: () => open?.(item.id) }} isLoading={isLoading} />
    )),
})

/** Draw the selected Today, course or progress mobile composition. */
export const CourseLearnTodayPageBase = (input: CourseLearnTodayPageProps) => {
    const isLoading = input.state === "pending"
    const showToday = input.mobileView === "today"
    const showCourse = input.mobileView === "course"
    const showProgress = input.mobileView === "progress"
    const placeholder: CourseLearnTodayItem = {
        id: "pending",
        title: "",
        kind: "",
        actionLabel: input.props.course.actionLabel,
    }
    const notice = resolveTodayNotice(input.state, input.props)

    return (
        <Grammar
            contract="course-learn-today-page"
            render={createGrammarNode("course-learn-today-page", {
                header: createGrammarNode("page-header-stack", {
                    title: createLeafNode("heading", {}, () => (
                        <Heading props={{ content: input.props.title, level: 1 }} />
                    )),
                }),
                subtitle: createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                    <Text props={{ content: input.props.subtitle, size: "sm", tone: "muted" }} />
                )),
                ...(notice === undefined ? {} : {
                    notice: createCompositeNode("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{ icon: input.state === "failed" ? "retry" : "course", ...notice }}
                            on={{ act: input.on?.retry }}
                        />
                    )),
                }),
                ...(!showToday || notice !== undefined ? {} : {
                    primary: createGrammarProjection("resume-item-card", () => (
                        <SurfaceCard
                            contract="resume-item-card"
                            props={{ label: input.props.primaryLabel }}
                            render={resumeCard(input.props.primary ?? placeholder, input.on?.open, isLoading)}
                            isLoading={isLoading}
                        />
                    )),
                    ...(!isLoading && input.props.secondary.length === 0 ? {} : {
                        secondary: createGrammarProjection("resume-card-grid", () => (
                            <SurfaceCard
                                contract="resume-card-grid"
                                props={{ label: input.props.secondaryLabel, isFrameless: true }}
                                render={createGrammarNode("resume-card-grid", {
                                    card: isLoading
                                        ? [resumeCard(placeholder, input.on?.open, true)]
                                        : input.props.secondary.map((item) => resumeCard(item, input.on?.open)),
                                })}
                            />
                        )),
                    }),
                }),
                ...(!showCourse || notice !== undefined ? {} : {
                    course: createGrammarProjection("resume-item-card", () => (
                        <SurfaceCard
                            contract="resume-item-card"
                            props={{ label: input.props.courseLabel }}
                            render={resumeCard(input.props.course, input.on?.open, isLoading)}
                            isLoading={isLoading}
                        />
                    )),
                }),
                ...(!showProgress || notice !== undefined ? {} : {
                    progress: createGrammarProjection("label-fact-over-progress", () => (
                        <SurfaceCard
                            contract="label-fact-over-progress"
                            props={{ label: input.props.progressLabel }}
                            render={createGrammarNode("label-fact-over-progress", {
                                line: createGrammarNode("label-with-muted-fact-row", {
                                    label: createLeafNode("text", { size: "sm", weight: "semibold" }, () => (
                                        <Text props={{ content: input.props.progressLabel, size: "sm", weight: "semibold" }} isLoading={isLoading} />
                                    )),
                                    fact: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                                        <Text props={{ content: input.props.progressFact, size: "xs", tone: "muted" }} isLoading={isLoading} />
                                    )),
                                }),
                                progress: createLeafNode("progress", {}, () => (
                                    <Progress props={{ label: input.props.progressLabel, value: input.props.progressValue }} isLoading={isLoading} />
                                )),
                            })}
                        />
                    )),
                }),
            })}
        />
    )
}

/** Source-level ownership marker. */
export const meta = { world: "pure", domain: "learn" } as const
