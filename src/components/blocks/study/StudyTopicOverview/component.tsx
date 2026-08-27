import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createLeafNode, type BlockProps } from "@/components/contracts/props"

type StudyPhraseRowData = { readonly id: string; readonly phrase: string; readonly meaning: string; readonly example?: string }
type StudyTopicOverviewData = { readonly title: string; readonly description: string; readonly backLabel: string; readonly startLabel: string; readonly loading: string; readonly failed: string; readonly empty: string; readonly retry: string; readonly phrases: ReadonlyArray<StudyPhraseRowData> }
type StudyTopicOverviewActions = { readonly start?: () => void; readonly back?: () => void; readonly retry?: () => void }
type StudyTopicOverviewState = "pending" | "failed" | "empty" | "ready"
type StudyTopicOverviewProps = BlockProps<StudyTopicOverviewState, StudyTopicOverviewData> & { readonly on?: StudyTopicOverviewActions }

/** The notice sentence for a non-ready Grammar: loading, failed, or genuinely empty. */
const resolveNoticeMessage = (state: StudyTopicOverviewState, props: StudyTopicOverviewData): string => {
    if (state === "pending") return props.loading
    if (state === "failed") return props.failed
    return props.empty
}

/** Renders one public topic and its ordered phrase evidence. */
export const StudyTopicOverviewBase = (input: StudyTopicOverviewProps) => {
    const notice = input.state !== "ready"
    return <Grammar contract="study-topic-overview" render={createGrammarNode("study-topic-overview", {
        back: createLeafNode("button", {}, () => <Button props={{ label: input.props.backLabel, variant: "ghost" }} on={{ press: input.on?.back }} />),
        header: createGrammarNode("page-header-stack", { title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} isLoading={input.state === "pending"} />) }),
        ...(input.props.description ? { description: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.description, size: "sm", tone: "muted" }} />) } : {}),
        ...(notice ? { notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ icon: "course", message: resolveNoticeMessage(input.state, input.props), actionLabel: input.state === "failed" ? input.props.retry : undefined }} on={{ act: input.on?.retry }} />) } : {
            phrases: createGrammarNode("study-phrase-list", {
                phrase: input.props.phrases.map((phrase) => createGrammarNode("study-phrase-row", {
                    phrase: createLeafNode("heading", {}, () => <Heading props={{ content: phrase.phrase, level: 3 }} />),
                    meaning: createLeafNode("text", {}, () => <Text props={{ content: phrase.meaning }} />),
                    ...(phrase.example ? { example: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: phrase.example, size: "sm", tone: "muted" }} />) } : {}),
                })),
            }),
            action: createLeafNode("button", {}, () => <Button props={{ label: input.props.startLabel, variant: "primary", icon: "practice" }} on={{ press: input.on?.start }} />),
        }),
    })} />
}
/** Declares the pure Study topic block. */
export const meta = { shape: "block", world: "pure", domain: "study" } as const
