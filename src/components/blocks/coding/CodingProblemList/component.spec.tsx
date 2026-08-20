import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { CodingProblemListBase } from "@/components/blocks/coding/CodingProblemList/component"
import { PhrasePracticeBase } from "@/components/blocks/study/PhrasePractice/component"
import { ExamDownloadCheckoutPanelBase } from "@/components/blocks/payment/ExamDownloadCheckoutPanel/component"

const phraseProps = { title: "Practice", position: "1/2", prompt: "Hello", questionLabel: "Choose", options: [{ id: "a", label: "Xin chào" }], previousLabel: "Previous", nextLabel: "Next", submitLabel: "Submit", exitLabel: "Exit", loading: "Loading", failed: "Failed", empty: "Empty", retry: "Retry", resultTitle: "Result", resultStats: [{ icon: "star" as const, label: "Known", value: "1" }], repeatLabel: "Repeat", backLabel: "Back" }
const checkoutProps = { title: "Download", body: "Get the exam", price: "100₫", benefits: ["PDF", "Solutions"], checkoutLabel: "Buy", cancelLabel: "Cancel", errorMessage: "Failed" }

describe("pure block branch coverage", () => {
    it("draws coding list loading/ready and both notices", () => {
        expect(renderToStaticMarkup(<CodingProblemListBase state="pending" props={{}} />)).toContain("data-loading=\"true\"")
        expect(renderToStaticMarkup(<CodingProblemListBase state="ready" props={{ problems: [{ slug: "one", title: "One", fact: "Easy", isSolved: true, label: "Open One" }] }} on={{ open: vi.fn() }} />)).toContain("One")
        expect(renderToStaticMarkup(<CodingProblemListBase state="empty" props={{ noticeMessage: "No problems", noticeActionLabel: "Back" }} on={{ recover: vi.fn() }} />)).toContain("No problems")
        expect(renderToStaticMarkup(<CodingProblemListBase state="all-solved" props={{ noticeMessage: "All done" }} />)).toContain("All done")
    })

    it("draws phrase terminal, answering, submitting and result trees", () => {
        for (const state of ["pending", "failed", "empty"] as const) expect(renderToStaticMarkup(<PhrasePracticeBase state={state} props={phraseProps} />)).toContain(state === "pending" ? "Loading" : state === "failed" ? "Failed" : "Empty")
        expect(renderToStaticMarkup(<PhrasePracticeBase state="answering" props={{ ...phraseProps, submitFailed: "Try again" }} on={{ previous: vi.fn(), next: vi.fn(), select: vi.fn(), exit: vi.fn() }} />)).toContain("Try again")
        expect(renderToStaticMarkup(<PhrasePracticeBase state="submitting" props={phraseProps} on={{ submit: vi.fn(), exit: vi.fn() }} />)).toContain("Submit")
        expect(renderToStaticMarkup(<PhrasePracticeBase state="result" props={phraseProps} on={{ repeat: vi.fn(), exit: vi.fn() }} />)).toContain("Result")
    })

    it("draws idle/submitting/failed checkout action states", () => {
        expect(renderToStaticMarkup(<ExamDownloadCheckoutPanelBase state="idle" props={checkoutProps} />)).toContain("Download")
        expect(renderToStaticMarkup(<ExamDownloadCheckoutPanelBase state="submitting" props={checkoutProps} on={{ checkout: vi.fn(), dismiss: vi.fn() }} />)).toContain("Buy")
        expect(renderToStaticMarkup(<ExamDownloadCheckoutPanelBase state="failed" props={checkoutProps} on={{ retry: vi.fn() }} />)).toContain("Failed")
    })
})
