import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ProfileChallengeManagePageBase } from "./component"
import type { ProfileSolvedChallenge } from "@/modules/api/graphql/queries/types/profile-evidence"

const row: ProfileSolvedChallenge = { id: "submission-1", title: "Two pointers", passedAt: "2026-01-01", selectedLang: "TypeScript", difficulty: "Medium", score: 94 }
const input = { filterLabel: "All", on: { back: vi.fn(), search: vi.fn(), filter: vi.fn(), select: vi.fn() } }

describe("ProfileChallengeManagePageBase", () => {
    it("draws a ready filtered submission with its qualifiers and score", () => {
        const markup = renderToStaticMarkup(<ProfileChallengeManagePageBase {...input} state="ready" courseTitle="Algorithms" rows={[row]} query="two" />)
        expect(markup).toContain("Algorithms submissions")
        expect(markup).toContain("TypeScript · Medium · 2026-01-01")
        expect(markup).toContain("94")
        expect(markup).toContain("1 found")
    })

    it("renders resting rows and distinct empty/error messages", () => {
        const pending = renderToStaticMarkup(<ProfileChallengeManagePageBase {...input} state="pending" rows={[]} query="" />)
        expect(pending).toContain("data-loading=\"true\"")
        const emptySearch = renderToStaticMarkup(<ProfileChallengeManagePageBase {...input} state="ready" rows={[]} query="missing" />)
        expect(emptySearch).toContain("No submissions match this search.")
        const empty = renderToStaticMarkup(<ProfileChallengeManagePageBase {...input} state="ready" rows={[]} query="" />)
        expect(empty).toContain("No passed submissions were found.")
        const failed = renderToStaticMarkup(<ProfileChallengeManagePageBase {...input} state="error" rows={[]} query="anything" />)
        expect(failed).toContain("Submissions couldn&#x27;t be loaded.")
    })
})
