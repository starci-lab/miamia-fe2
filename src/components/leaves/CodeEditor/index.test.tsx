import { fireEvent, render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

type EditorProps = { readonly extensions: ReadonlyArray<unknown>; readonly onChange: (code: string) => void; readonly editable: boolean }
const mocks = vi.hoisted(() => ({ editor: undefined as EditorProps | undefined, telemetry: vi.fn(), change: vi.fn() }))
vi.mock("@uiw/react-codemirror", () => ({ default: (input: EditorProps) => { mocks.editor = input; return <output data-testid="editor" data-editable={String(input.editable)} onClick={() => input.onChange("updated")} onKeyDown={() => input.onChange("updated")} /> }, EditorView: { lineWrapping: { grammar: "wrap" }, domEventHandlers: (handlers: EventHandlers) => ({ handlers }) } }))
vi.mock("@uiw/codemirror-theme-vscode", () => ({ vscodeDark: {} }))
vi.mock("@codemirror/lang-cpp", () => ({ cpp: vi.fn(() => ({ grammar: "cpp" })) }))
vi.mock("@codemirror/lang-java", () => ({ java: vi.fn(() => ({ grammar: "java" })) }))
vi.mock("@codemirror/lang-javascript", () => ({ javascript: vi.fn((options?: unknown) => ({ grammar: options === undefined ? "javascript" : "typescript" })) }))
vi.mock("@codemirror/lang-python", () => ({ python: vi.fn(() => ({ grammar: "python" })) }))

import { CodeEditor } from "./index"

type EventHandlers = { readonly paste: (event: ClipboardEvent) => boolean; readonly keydown: () => boolean; readonly blur: () => boolean }
type HandlerExtension = { readonly handlers: EventHandlers }
const handlers = (): EventHandlers => {
    const extension = mocks.editor?.extensions.find((item): item is HandlerExtension => typeof item === "object" && item !== null && "handlers" in item)
    if (!extension) throw new Error("editor event handlers were not installed")
    return extension.handlers
}

describe("CodeEditor telemetry", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.editor = undefined })

    it("maps every supported grammar and reports paste, keydown, blur and change", () => {
        const view = render(<CodeEditor props={{ id: "code", language: "python", label: "Code", defaultValue: "print()" }} on={{ telemetry: mocks.telemetry, change: mocks.change }} />)
        for (const language of ["java", "cpp", "typescript", "javascript", "plain"]) view.rerender(<CodeEditor props={{ id: "code", language, label: "Code" }} on={{ telemetry: mocks.telemetry, change: mocks.change }} />)
        const event = { clipboardData: { getData: () => "hello" } } as unknown as ClipboardEvent
        expect(handlers().paste(event)).toBe(false); expect(handlers().paste(event)).toBe(false); expect(handlers().keydown()).toBe(false); expect(handlers().blur()).toBe(false)
        fireEvent.click(view.getByTestId("editor"))
        expect(mocks.change).toHaveBeenCalledWith("updated")
        expect(mocks.telemetry).toHaveBeenLastCalledWith({ pasteCount: 2, pasteSizeMax: 5, keystrokeCount: 1, tabBlurCount: 1 })
    })

    it("respects readOnly without requiring action callbacks", () => {
        const view = render(<CodeEditor props={{ id: "code", language: "unknown", label: "Read only", readOnly: true }} />)
        expect(view.getByTestId("editor")).toHaveAttribute("data-editable", "false")
    })
})
