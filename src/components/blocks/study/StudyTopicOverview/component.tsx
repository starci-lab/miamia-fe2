import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { defineCompositeComponent, defineContractComponent, defineLeafComponent, type BlockProps } from "@/components/contracts/props"

type StudyPhraseRowData = { readonly id: string; readonly phrase: string; readonly meaning: string; readonly example?: string }
type StudyTopicOverviewData = { readonly title: string; readonly description: string; readonly backLabel: string; readonly startLabel: string; readonly loading: string; readonly failed: string; readonly empty: string; readonly retry: string; readonly phrases: ReadonlyArray<StudyPhraseRowData> }
type StudyTopicOverviewActions = { readonly start?: () => void; readonly back?: () => void; readonly retry?: () => void }
type StudyTopicOverviewState = "pending" | "failed" | "empty" | "ready"
type StudyTopicOverviewProps = BlockProps<StudyTopicOverviewState, StudyTopicOverviewData> & { readonly on?: StudyTopicOverviewActions }

/** The notice sentence for a non-ready tree: loading, failed, or genuinely empty. */
const resolveNoticeMessage = (state: StudyTopicOverviewState, props: StudyTopicOverviewData): string => {
    if (state === "pending") return props.loading
    if (state === "failed") return props.failed
    return props.empty
}

/** Renders one public topic and its ordered phrase evidence. */
export const StudyTopicOverviewBase = (input: StudyTopicOverviewProps) => {
    const notice = input.state !== "ready"
    return <Tree contract="study-topic-overview" render={defineContractComponent("study-topic-overview", {
        back: defineLeafComponent("button", {}, () => <Button props={{ label: input.props.backLabel, variant: "ghost" }} on={{ press: input.on?.back }} />),
        header: defineContractComponent("page-header-stack", { title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} isLoading={input.state === "pending"} />) }),
        ...(input.props.description ? { description: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.description, size: "sm", tone: "muted" }} />) } : {}),
        ...(notice ? { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ icon: "course", message: resolveNoticeMessage(input.state, input.props), actionLabel: input.state === "failed" ? input.props.retry : undefined }} on={{ act: input.on?.retry }} />) } : {
            phrases: defineContractComponent("study-phrase-list", {
                phrase: input.props.phrases.map((phrase) => defineContractComponent("study-phrase-row", {
                    phrase: defineLeafComponent("heading", {}, () => <Heading props={{ content: phrase.phrase, level: 3 }} />),
                    meaning: defineLeafComponent("text", {}, () => <Text props={{ content: phrase.meaning }} />),
                    ...(phrase.example ? { example: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: phrase.example, size: "sm", tone: "muted" }} />) } : {}),
                })),
            }),
            action: defineLeafComponent("button", {}, () => <Button props={{ label: input.props.startLabel, variant: "primary", icon: "practice" }} on={{ press: input.on?.start }} />),
        }),
    })} />
}
/** Declares the pure Study topic block. */
export const meta = { shape: "block", world: "pure", domain: "study" } as const
