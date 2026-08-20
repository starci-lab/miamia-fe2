import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { SolutionEditorBase } from "@/components/blocks/coding/SolutionEditor/component"

type EditorStubProps = { readonly props: { readonly readOnly?: boolean; readonly label: string } }
type SelectStubProps = { readonly props: { readonly label: string; readonly disabled?: boolean } }
vi.mock("@/components/leaves/CodeEditor", () => ({ CodeEditor: (input: EditorStubProps) => <output data-testid="editor">{input.props.label}:{String(input.props.readOnly)}</output> }))
vi.mock("@/components/leaves/Select", () => ({ Select: (input: SelectStubProps) => <output data-testid="select">{input.props.label}:{String(input.props.disabled)}</output> }))

const labels = { editor: "Editor", languageField: "Language", run: "Run", submit: "Submit", submitting: "Submitting" }
const languages = [{ id: "python", label: "Python" }]

describe("SolutionEditorBase states", () => {
    it("draws the idle editor without an empty console", () => {
        const markup = renderToStaticMarkup(<SolutionEditorBase state="ready" props={{ labels, languages, language: "python", source: "print()" }} />)
        expect(markup).toContain("Editor:false")
        expect(markup).not.toContain("judge-console")
        expect(markup).toContain("Submit")
    })

    it("draws busy controls and all testcase/compile outcomes", () => {
        const markup = renderToStaticMarkup(<SolutionEditorBase state="submitting" props={{ labels, languages, language: "python", testcases: [{ id: "1", label: "#1", passed: true }, { id: "2", label: "#2", passed: false }, { id: "3", label: "#3" }], compilerMessage: "Syntax error" }} />)
        expect(markup).toContain("Editor:true")
        expect(markup).toContain("Submitting")
        expect(markup).toContain("#1")
        expect(markup).toContain("Syntax error")
    })
})
