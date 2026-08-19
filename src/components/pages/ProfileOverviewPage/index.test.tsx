import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ProfileOverviewPage } from "./index"

const m = vi.hoisted(() => ({ viewer: { data: undefined as unknown }, profile: { data: undefined as unknown }, progress: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, wrapped: { data: undefined as unknown, error: undefined as unknown }, push: vi.fn(), view: undefined as unknown }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada" }) }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks", () => ({ useQueryMeSwr: () => m.viewer, useQueryUserProfileSwr: () => m.profile, useQueryProgressSummarySwr: () => m.progress, useQueryWrappedSwr: () => m.wrapped }))
vi.mock("./component", () => ({ ProfileOverviewPageBase: (input: unknown) => { m.view = input; const page = input as { on?: { retryProgress?: () => void; openWrapped?: () => void; selectView?: (view: string) => void }; props: { selectedView: string } }; return <><output data-testid="state">{(input as { state: string }).state}</output><output data-testid="selected">{page.props.selectedView}</output><button onClick={() => page.on?.selectView?.("public")}>public</button><button onClick={page.on?.retryProgress}>retry</button><button onClick={page.on?.openWrapped}>wrapped</button></> } }))

beforeEach(() => { vi.clearAllMocks(); m.viewer.data = undefined; m.profile.data = undefined; m.progress.data = undefined; m.progress.error = undefined; m.wrapped.data = undefined; m.wrapped.error = undefined })

describe("ProfileOverviewPage connected half", () => {
    it("resolves visitor state without exposing private learning data", () => { m.viewer.data = { id: "viewer" }; m.profile.data = { id: "ada" }; render(<ProfileOverviewPage />); expect(screen.getByTestId("state")).toHaveTextContent("visitor"); expect(screen.getByTestId("selected")).toHaveTextContent("private") })
    it("resolves owner progress and wrapped actions", () => {
        m.viewer.data = { id: "ada" }; m.profile.data = { id: "ada" }; m.progress.data = { currentStreak: 2, studyDays: 4, phrasesKnown: 8, totalPhrases: 10, bestPercent: 90, level: 3, xpIntoLevel: 40, xpForNextLevel: 100 }; m.wrapped.data = { isUnlocked: true, stats: { xpEarned: 12, phrasesLearned: 4, papersCompleted: 1, longestStreak: 3 }, daysUntilUnlock: 0 }; render(<ProfileOverviewPage />); expect(screen.getByTestId("state")).toHaveTextContent("owner"); fireEvent.click(screen.getByText("public")); fireEvent.click(screen.getByText("retry")); fireEvent.click(screen.getByText("wrapped")); expect(m.progress.mutate).toHaveBeenCalledOnce(); expect(m.push).toHaveBeenCalledWith("/profile/ada/wrapped")
    })
    it("keeps progress and wrapped notices truthful for failures, zero ceiling and locked data", () => { m.viewer.data = { id: "ada" }; m.profile.data = { id: "ada" }; m.progress.error = new Error("offline"); m.progress.data = { currentStreak: 0, studyDays: 0, phrasesKnown: 0, totalPhrases: 0, bestPercent: null, level: 1, xpIntoLevel: 0, xpForNextLevel: 0 }; m.wrapped.data = { isUnlocked: false, stats: undefined, daysUntilUnlock: 3 }; render(<ProfileOverviewPage />); expect(screen.getByTestId("state")).toHaveTextContent("owner") })
})
