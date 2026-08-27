import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { StatRow, type StatRowData } from "@/components/composites/StatRow"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { SingleChoice, type SingleChoiceOptionData } from "@/components/leaves/SingleChoice"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createLeafNode, type BlockProps } from "@/components/contracts/props"

type PhrasePracticeData = {
    readonly title: string; readonly position: string; readonly prompt: string; readonly questionLabel: string; readonly options: ReadonlyArray<SingleChoiceOptionData>; readonly selectedKey?: string
    readonly previousLabel: string; readonly nextLabel: string; readonly submitLabel: string; readonly exitLabel: string; readonly loading: string; readonly failed: string; readonly empty: string; readonly retry: string; readonly submitFailed?: string
    readonly resultTitle: string; readonly resultStats: ReadonlyArray<StatRowData>; readonly repeatLabel: string; readonly backLabel: string
}
type PhrasePracticeActions = { readonly select?: (id: string) => void; readonly previous?: () => void; readonly next?: () => void; readonly submit?: () => void; readonly exit?: () => void; readonly retry?: () => void; readonly repeat?: () => void }
type PhrasePracticeProps = BlockProps<"pending" | "failed" | "empty" | "answering" | "submitting" | "result", PhrasePracticeData> & { readonly on?: PhrasePracticeActions }

/** Renders phrase answering, submission and verified result without changing route identity. */
export const PhrasePracticeBase = (input: PhrasePracticeProps) => {
    const terminal = input.state === "pending" || input.state === "failed" || input.state === "empty"
    const isResult = input.state === "result"
    const terminalMessage = () => {
        if (input.state === "pending") return input.props.loading
        if (input.state === "failed") return input.props.failed
        return input.props.empty
    }
    /*
     * Lifted out of the spread below. Nested inline it read `terminal ? A : isResult ? B : C`,
     * where the second `?` is easy to attach to the wrong `:` on a skim - and the branches are
     * whole slot trees, so the mistake would be silent rather than a syntax error.
     */
    const questionOrResultSlots = isResult ? {
        result: createGrammarNode("study-result-stack", {
            title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.resultTitle, level: 2 }} />),
            stat: input.props.resultStats.map((stat) => createCompositeNode("stat-row", {}, () => <StatRow key={stat.label} props={stat} />)),
            action: [
                createLeafNode("button", {}, () => <Button props={{ label: input.props.repeatLabel, variant: "secondary", icon: "retry" }} on={{ press: input.on?.repeat }} />),
                createLeafNode("button", {}, () => <Button props={{ label: input.props.backLabel, variant: "primary", icon: "next", iconPlacement: "trailing" }} on={{ press: input.on?.exit }} />),
            ],
        }),
    } : {
        prompt: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.prompt, level: 2 }} />),
        options: createGrammarNode("study-option-grid", { answer: createLeafNode("single-choice", {}, () => <SingleChoice props={{ label: input.props.questionLabel, name: "phrase-practice-answer", options: input.props.options, selectedKey: input.props.selectedKey, disabled: input.state === "submitting" }} on={{ select: input.on?.select }} />) }),
        ...(input.props.submitFailed ? { notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ icon: "retry", message: input.props.submitFailed ?? "" }} />) } : {}),
        action: [
            createLeafNode("button", {}, () => <Button props={{ label: input.props.previousLabel, variant: "ghost", disabled: !input.on?.previous }} on={{ press: input.on?.previous }} />),
            createLeafNode("button", {}, () => <Button props={{ label: input.on?.next ? input.props.nextLabel : input.props.submitLabel, variant: "primary", isPending: input.state === "submitting", icon: "next", iconPlacement: "trailing" }} on={{ press: input.on?.next ?? input.on?.submit }} />),
        ],
    }

    return <Grammar contract="study-practice-stack" render={createGrammarNode("study-practice-stack", {
        header: createGrammarNode("title-with-baseline-fact", {
            title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} />),
            fact: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.props.position, size: "sm", tone: "muted" }} />),
        }),
        ...(terminal ? { notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ icon: "practice", message: terminalMessage(), actionLabel: input.state === "failed" ? input.props.retry : undefined }} on={{ act: input.on?.retry }} />) } : questionOrResultSlots),
        ...(isResult || terminal ? {} : { exit: createLeafNode("button", {}, () => <Button props={{ label: input.props.exitLabel, variant: "ghost" }} on={{ press: input.on?.exit }} />) }),
    })} />
}
/** Declares the pure phrase-practice block. */
export const meta = { shape: "block", world: "pure", domain: "study" } as const
