import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
    profile: { data: undefined as unknown, isLoading: false },
    evidence: new Map<string, { data: unknown; error?: unknown; isLoading?: boolean }>(),
    push: vi.fn(),
}))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada" }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => mocks.profile }))
vi.mock("@/hooks/swr/useQueryProfileEvidenceSwr", () => ({ useQueryProfileEvidenceSwr: (kind: string) => mocks.evidence.get(kind) ?? { data: undefined, isLoading: false } }))
type SkillsStubProps = { readonly state: string; readonly props: { readonly filterLabel: string; readonly history: ReadonlyArray<{ readonly slug: string; readonly problemTitle: string }> }; readonly on?: { readonly filter?: () => void; readonly search?: (value: string) => void; readonly select?: (slug: string) => void } }
vi.mock("./component", () => ({ ProfileSkillsPageBase: (input: SkillsStubProps) => <><output data-testid="skills-state">{input.state}</output><output data-testid="filter">{input.props.filterLabel}</output><output data-testid="history">{input.props.history.map((item) => item.problemTitle).join("|")}</output><button onClick={input.on?.filter}>filter</button><button onClick={() => input.on?.search?.("graph")}>search</button><button onClick={() => input.on?.select?.("two-pointers")}>select</button></> }))

import { ProfileSkillsPage } from "./index"

const readyEvidence = () => {
    mocks.profile.data = { id: "u1" }
    mocks.evidence.set("coding-progress", { data: { solvedProblemIds: ["1"] } })
    mocks.evidence.set("coding-rank", { data: { rank: 4, percentile: 8 } })
    mocks.evidence.set("coding-xp", { data: { codingXp: 120 } })
    mocks.evidence.set("coding-skills", { data: { byDifficulty: [], byDomain: [], byLanguage: [] } })
    mocks.evidence.set("coding-history", { data: [{ slug: "one", problemTitle: "Graph basics", difficulty: "easy" }, { slug: "two", problemTitle: "Sorting", difficulty: "hard" }] })
}

describe("ProfileSkillsPage connected evidence", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.profile.data = undefined; mocks.profile.isLoading = true; mocks.evidence.clear() })

    it("resolves pending, error and ready filtered history states", async () => {
        const view = render(<ProfileSkillsPage />)
        expect(screen.getByTestId("skills-state")).toHaveTextContent("pending")
        readyEvidence(); mocks.profile.isLoading = false; mocks.evidence.get("coding-history")!.error = new Error("offline"); view.rerender(<ProfileSkillsPage />)
        await waitFor(() => expect(screen.getByTestId("skills-state")).toHaveTextContent("error"))
        readyEvidence(); view.rerender(<ProfileSkillsPage />)
        await waitFor(() => expect(screen.getByTestId("skills-state")).toHaveTextContent("ready"))
        expect(screen.getByTestId("history")).toHaveTextContent("Graph basics|Sorting")
        fireEvent.click(screen.getByRole("button", { name: "search" })); expect(screen.getByTestId("history")).toHaveTextContent("Graph basics")
        fireEvent.click(screen.getByRole("button", { name: "filter" })); expect(screen.getByTestId("filter")).toHaveTextContent("Filter: easy")
        fireEvent.click(screen.getByRole("button", { name: "select" })); expect(mocks.push).toHaveBeenCalledWith("/profile/ada/skills/two-pointers")
    })
})
