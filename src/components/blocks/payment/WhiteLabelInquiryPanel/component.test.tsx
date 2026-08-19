import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { _WhiteLabelInquiryPanel } from "./component"

const copy = { title: "Inquiry", body: "Tell us", name: "Name", namePlaceholder: "Your name", email: "Email", emailPlaceholder: "Email", message: "Message", messagePlaceholder: "Message", submit: "Send", cancel: "Cancel", succeeded: "Sent", failed: "Failed", retry: "Retry" }
const base = { values: { name: "", email: "", message: "" }, errors: {}, copy, onChange: vi.fn(), onSubmit: vi.fn(), onDismiss: vi.fn() }
describe("_WhiteLabelInquiryPanel", () => {
    it("renders the idle form and all settled notices", () => { expect(renderToStaticMarkup(<_WhiteLabelInquiryPanel {...base} state="idle" />)).toContain("Inquiry"); expect(renderToStaticMarkup(<_WhiteLabelInquiryPanel {...base} state="invalid" errors={{ email: "Invalid" }} />)).toContain("Invalid"); expect(renderToStaticMarkup(<_WhiteLabelInquiryPanel {...base} state="succeeded" />)).toContain("Sent"); expect(renderToStaticMarkup(<_WhiteLabelInquiryPanel {...base} state="failed" />)).toContain("Retry") })
})
