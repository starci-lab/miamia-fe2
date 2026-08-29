import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { CodeBlock } from "@/components/leaves/CodeBlock"
import { Grammar } from "@/components/layouts/Grammar"
import {
    layoutNode,
    renderLeaf,
    type BlockProps,
} from "@/modules/types/layout"
import { CodeEditor, type EditorTelemetry } from "@/components/leaves/CodeEditor"
import { Select, type SelectOption } from "@/components/leaves/Select"

/**
 * BLOCK - `SolutionEditor`: where the solution is written, and how it is sent.
 *
 * Target path: `src/components/blocks/coding/SolutionEditor/component.tsx`.
 *
 * IT OWNS THE ANTI-CHEAT READING because it owns the surface that can see it. Pastes, keystrokes
 * and blurs are facts about THIS editing session; nothing above this block can observe them and
 * nothing below it knows they matter.
 *
 * THE CONSOLE IS ABSENT UNTIL THERE IS SOMETHING IN IT. A tray parked open before the first
 * submission takes height from the editor to show nothing, and the verdict - the thing a reader
 * actually waits for - lives in the strip above rather than in here.
 *
 * SWITCHING LANGUAGE MUST NOT DISCARD THE BUFFER. The editor is uncontrolled, so the connected half
 * keeps one draft per language and hands the right `defaultValue` down; this half only reports the
 * change. Five languages the server accepts, five drafts.
 */

/** The situations this block can be in. */
export type SolutionEditorState = "ready" | "submitting" | "judged"

/** One testcase outcome, as the console draws it. */
export type TestcaseOutcome = {
    /** Stable identity for the React key. */
    readonly id: string
    /** The already-resolved chip text, e.g. "#3" or "#4 hidden". */
    readonly label: string
    /** Whether it passed. Absent means it has not been reached yet. */
    readonly passed?: boolean
}

/** Resolves the badge tone for one testcase outcome. */
const toneOfTestcase = (passed: boolean | undefined): "neutral" | "success" | "danger" => {
    if (passed === undefined) return "neutral"
    return passed ? "success" : "danger"
}

/** What the block draws. */
export type SolutionEditorData = {
    /** The languages the server accepts, already worded. */
    readonly languages: ReadonlyArray<SelectOption>
    /** Which one is selected. */
    readonly language: string
    /** The draft for that language. */
    readonly source?: string
    /** Already-resolved control words. */
    readonly labels: {
        readonly editor: string
        readonly languageField: string
        readonly run: string
        readonly submit: string
        readonly submitting: string
    }
    /** Per-testcase outcomes. Absent means the console does not exist yet. */
    readonly testcases?: ReadonlyArray<TestcaseOutcome>
    /** The compiler's own words. Present only for a compile error. */
    readonly compilerMessage?: string
}

/** What the block reports. */
export type SolutionEditorActions = {
    readonly changeLanguage?: (id: string) => void
    readonly changeSource?: (code: string) => void
    readonly reportTelemetry?: (reading: EditorTelemetry) => void
    readonly run?: () => void
    readonly submit?: () => void
}

/** Props for {@link SolutionEditorBase}. */
export type SolutionEditorProps =
    BlockProps<SolutionEditorState, SolutionEditorData> & {
        readonly on?: SolutionEditorActions
    }

/** The editor's box id, so its label reaches it. */
const EDITOR_ID = "coding-solution-editor"

/** The language field's id. */
const LANGUAGE_ID = "coding-solution-language"

/**
 * Draw the working half of the problem page.
 *
 * @param input - {@link SolutionEditorProps}
 */
export const SolutionEditorBase = (input: SolutionEditorProps) => {
    const labels = input.props.labels
    const isBusy = input.state === "submitting"
    const testcases = input.props.testcases ?? []

    const toolbar = layoutNode("editor-toolbar-row", {
        language: renderLeaf("select", {}, () => (
            <Select
                props={{
                    id: LANGUAGE_ID,
                    name: "language",
                    label: labels.languageField,
                    options: input.props.languages,
                    selectedKey: input.props.language,
                    disabled: isBusy,
                }}
                on={{ select: input.on?.changeLanguage }}
            />
        )),
        actions: layoutNode("catalog-card-action-row", {
            cart: renderLeaf("button", {}, () => (
                <Button
                    props={{ label: labels.run, size: "sm", variant: "outline", disabled: isBusy }}
                    on={{ press: input.on?.run }}
                />
            )),
            open: renderLeaf("button", {}, () => (
                <Button
                    props={{
                        label: isBusy ? labels.submitting : labels.submit,
                        size: "sm",
                        variant: "primary",
                        // `isPending` is THIS action running; `isLoading` is the shared
                        // data-loading slot and would draw a skeleton where a working button
                        // belongs.
                        isPending: isBusy,
                    }}
                    on={{ press: input.on?.submit }}
                />
            )),
        }),
    })

    return (
        <Grammar
            layout="editor-over-console"
            render={layoutNode("editor-over-console", {
                toolbar,
                editor: renderLeaf("code-editor", {}, () => (
                    <CodeEditor
                        props={{
                            id: EDITOR_ID,
                            language: input.props.language,
                            label: labels.editor,
                            defaultValue: input.props.source,
                            readOnly: isBusy,
                        }}
                        on={{
                            change: input.on?.changeSource,
                            telemetry: input.on?.reportTelemetry,
                        }}
                    />
                )),
                ...(testcases.length === 0 ? {} : {
                    console: layoutNode("judge-console", {
                        cases: layoutNode("testcase-chip-run", {
                            testcase: testcases.map((testcase) => renderLeaf("badge", {}, () => (
                                <Badge
                                    props={{
                                        content: testcase.label,
                                        tone: toneOfTestcase(testcase.passed),
                                    }}
                                />
                            ))),
                        }),
                        ...(input.props.compilerMessage === undefined ? {} : {
                            message: renderLeaf("code-block", {}, () => (
                                <CodeBlock props={{ code: input.props.compilerMessage ?? "" }} />
                            )),
                        }),
                    }),
                }),
            })}
        />
    )
}

/** Source-level ownership marker. */
