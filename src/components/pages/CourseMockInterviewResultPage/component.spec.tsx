import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CourseMockInterviewResultPageBase } from "./component"

describe("CourseMockInterviewResultPageBase", () => {
    it("renders persisted rubric and question feedback", () => {
        const { container } = render(
            <CourseMockInterviewResultPageBase
                state="ready"
                props={{
                    title: "Interview debrief",
                    description: "Persisted result",
                    gradingLabel: "Grading",
                    failedLabel: "Failed",
                    scoreLabel: "Overall score",
                    score: 82,
                    verdict: "pass",
                    promptTitle: "Distributed cache",
                    phaseTitle: "Score breakdown",
                    phases: [{ id: "requirements", label: "Requirements", score: 16, max: 20 }],
                    strengthsTitle: "Strengths",
                    strengths: ["Clear trade-offs"],
                    gapsTitle: "What to improve",
                    gaps: ["Quantify capacity"],
                    reviewsTitle: "Question review",
                    reviews: [{ id: "0", title: "Cache invalidation", answer: "Version keys", feedback: "Cover eviction too", scoreLabel: "80/100" }],
                    retryLabel: "Check again",
                    newSessionLabel: "Interview again",
                }}
            />,
        )

        expect(screen.getByText("82/100")).toBeTruthy()
        expect(screen.getByText("Clear trade-offs")).toBeTruthy()
        expect(screen.getByText("Cover eviction too")).toBeTruthy()
        expect(container.querySelector(".layout-name-course-mock-interview-result-page")).toBeTruthy()
    })
    it("renders grading and failed recovery states", () => { const props = { title: "Result", description: "Wait", gradingLabel: "Grading", failedLabel: "Failed", scoreLabel: "Score", phaseTitle: "Phases", phases: [], strengthsTitle: "Strengths", strengths: [], gapsTitle: "Gaps", gaps: [], reviewsTitle: "Reviews", reviews: [], retryLabel: "Retry", newSessionLabel: "New" }; const retry = vi.fn(); render(<CourseMockInterviewResultPageBase state="grading" props={props} on={{ retry, newSession: vi.fn() }} />); expect(screen.getByText("Grading")).toBeTruthy(); cleanup(); render(<CourseMockInterviewResultPageBase state="failed" props={props} on={{ retry }} />); fireEvent.click(screen.getAllByRole("button", { name: "Retry" })[0]!); expect(retry).toHaveBeenCalledOnce() })
})
