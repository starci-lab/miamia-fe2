import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ProfileChallengesPageBase } from "@/components/pages/ProfileChallengesPage/component"
import { CourseQaPageBase } from "@/components/pages/CourseQaPage/component"

const evidence = vi.hoisted(() => ({ data: undefined as unknown, error: undefined as unknown, isLoading: false }))
vi.mock("next-intl", () => ({ useLocale: () => "en", useTranslations: () => (key: string) => key }))
vi.mock("@/components/blocks/profile/overview/useOverviewEvidence", () => ({ useOverviewEvidence: () => evidence }))
type ChangelogStubProps = { readonly state: string; readonly props: { readonly entries: ReadonlyArray<{ readonly id: string; readonly category?: string }> }; readonly on: { readonly open: (id: string) => void } }
const changelog = vi.hoisted(() => ({ data: undefined as unknown, error: undefined as unknown, mutate: vi.fn(), push: vi.fn() }))
vi.mock("@/hooks", () => ({ useQueryChangelogEntriesSwr: () => changelog, useQueryUserProfileSwr: () => ({ data: { id: "u" } }), useQueryProfileEvidenceSwr: () => evidence }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: changelog.push }) }))
vi.mock("@/components/blocks/dashboard/ChangelogList/component", () => ({ ChangelogListBase: (input: ChangelogStubProps) => <><output data-testid="changelog-state">{input.state}</output><output data-testid="changelog-entries">{input.props.entries.map((entry) => `${entry.id}:${entry.category ?? "none"}`).join("|")}</output><button onClick={() => input.on.open("entry")}>open-entry</button></> }))
import { OverviewCourses } from "@/components/blocks/profile/overview/OverviewCourses"
import { ChangelogList } from "@/components/blocks/dashboard/ChangelogList/index"

const labels = { title: "Questions", trail: [], searchPlaceholder: "Search", searchLabel: "Search", clearSearchLabel: "Clear", askLabel: "Ask", askPlaceholder: "Question", questionsLabel: "Questions", repliesLabel: "Replies", backLabel: "Back", draftKey: 0, draft: "", questions: [{ id: "q", body: "How?", meta: "today", replyLabel: "1 reply" }], replies: [], emptyMessage: "Empty", emptySearchMessage: "No match", errorMessage: "Failed", retryLabel: "Retry" }

describe("batch 17 measured pure/connected targets", () => {
    beforeEach(() => { vi.clearAllMocks(); evidence.data = undefined; evidence.error = undefined; evidence.isLoading = false; changelog.data = undefined; changelog.error = undefined })
    it("covers profile challenge strength/error/pending/ready evidence", () => {
        const on = { openCourse: vi.fn() }; const pending = renderToStaticMarkup(<ProfileChallengesPageBase strength={{ state: "pending" }} submissions={{ state: "pending", data: [] }} on={on} />); expect(pending).toContain("data-loading=\"true\"")
        const error = renderToStaticMarkup(<ProfileChallengesPageBase strength={{ state: "error", data: null }} submissions={{ state: "error", data: [] }} on={on} />); expect(error).toContain("Passed submissions couldn&#x27;t be loaded.")
        const ready = renderToStaticMarkup(<ProfileChallengesPageBase strength={{ state: "ready", data: { percentile: 10, rank: 2, xp: 100 } }} submissions={{ state: "ready", data: [{ id: "s", title: "Challenge", passedAt: "2026-01-01", courseGlobalId: "course", selectedLang: "ts", score: 90 }] }} on={on} />); expect(ready).toContain("Challenge"); expect(ready).toContain("Top 10%")
    })
    it("covers Q&A pending/failed/empty/selected thread projections", () => {
        const pending = renderToStaticMarkup(<CourseQaPageBase state="pending" props={labels} />); expect(pending).toContain("Search")
        const failed = renderToStaticMarkup(<CourseQaPageBase state="failed" props={{ ...labels, errorMessage: "Failed" }} />); expect(failed).toContain("Failed")
        const empty = renderToStaticMarkup(<CourseQaPageBase state="empty" props={{ ...labels, questions: [] }} />); expect(empty).toContain("Empty")
        const ready = renderToStaticMarkup(<CourseQaPageBase state="ready" props={{ ...labels, selectedQuestion: labels.questions[0], replies: [{ id: "r", body: "Reply", meta: "now" }] }} on={{ closeThread: vi.fn() }} />); expect(ready).toContain("Replies")
    })
    it("covers OverviewCourses loading/error/empty/ready evidence", () => {
        evidence.isLoading = true; const view = render(<OverviewCourses />); expect(view.container.textContent).toBeTruthy(); evidence.isLoading = false; evidence.error = new Error("offline"); view.rerender(<OverviewCourses />); expect(view.container.textContent).toContain("evidence.error"); evidence.error = undefined; evidence.data = [{ globalId: "c", label: "Course", contentCompleted: 1, contentTotal: 2, challengeCompleted: 1, challengeTotal: 2, completed: 1, total: 2 }]; view.rerender(<OverviewCourses />); expect(view.container.textContent).toContain("Course")
    })
    it("covers ChangelogList pending/failed/empty/ready and external open", async () => {
        const view = render(<ChangelogList />); expect(screen.getByTestId("changelog-state")).toHaveTextContent("pending"); changelog.error = new Error("offline"); view.rerender(<ChangelogList />); expect(screen.getByTestId("changelog-state")).toHaveTextContent("failed"); changelog.error = undefined; changelog.data = []; view.rerender(<ChangelogList />); expect(screen.getByTestId("changelog-state")).toHaveTextContent("empty"); changelog.data = [{ id: "entry", category: "feature", publishedAt: "2026-01-01", title: "Feature", body: "Body", linkUrl: "/news" }]; view.rerender(<ChangelogList />); await waitFor(() => expect(screen.getByTestId("changelog-state")).toHaveTextContent("ready")); fireEvent.click(screen.getByRole("button", { name: "open-entry" })); expect(changelog.push).toHaveBeenCalledWith("/news")
    })
})
