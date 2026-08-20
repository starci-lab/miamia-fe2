import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ProfileChallengeSubmissionPageBase } from "@/components/pages/ProfileChallengeSubmissionPage/component"

describe("ProfileChallengeSubmissionPage proof branches", () => {
    it("draws pending, missing, error and complete proof details", () => {
        const pending = renderToStaticMarkup(<ProfileChallengeSubmissionPageBase state="pending" onBack={vi.fn()} />); expect(pending).toContain("data-loading=\"true\"")
        const missing = renderToStaticMarkup(<ProfileChallengeSubmissionPageBase state="ready" detail={null} onBack={vi.fn()} />); expect(missing).toContain("Challenge proof not found")
        const failed = renderToStaticMarkup(<ProfileChallengeSubmissionPageBase state="error" onBack={vi.fn()} />); expect(failed).toContain("Challenge proof couldn&#x27;t be loaded")
        const ready = renderToStaticMarkup(<ProfileChallengeSubmissionPageBase state="ready" detail={{ title: "Two pointers", courseTitle: "Algorithms", submissionUrl: "https://example.test/submission", selectedLang: "TypeScript", difficulty: "Medium", score: 95, passedAt: "2026-01-01", attempts: [{ attemptNumber: 1, score: 95, processedAt: "today", shortFeedback: "Good" }], feedbacks: [{ message: "Strong", detail: "Correct", severity: "Strong", suggestion: "Keep going" }] }} onBack={vi.fn()} />)
        expect(ready).toContain("Two pointers"); expect(ready).toContain("https://example.test/submission"); expect(ready).toContain("Passed"); expect(ready).toContain("Strong")
    })
})
