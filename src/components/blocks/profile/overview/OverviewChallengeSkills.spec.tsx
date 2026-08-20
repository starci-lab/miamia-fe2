import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ evidence: new Map<string, { data: unknown; error?: unknown; isLoading: boolean }>() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/components/blocks/profile/overview/useOverviewEvidence", () => ({ useOverviewEvidence: (kind: string) => mocks.evidence.get(kind) ?? { data: undefined, isLoading: false } }))
type SkillStubProps = { readonly label: string; readonly totalValue?: string; readonly rows: ReadonlyArray<unknown>; readonly stateMessage?: string; readonly isLoading?: boolean }
vi.mock("@/components/blocks/profile/overview/SkillSnapshot", () => ({ SkillSnapshot: (input: SkillStubProps) => <><output data-testid="skill-label">{input.label}</output><output data-testid="skill-total">{input.totalValue}</output><output data-testid="skill-message">{input.stateMessage}</output><output data-testid="skill-rows">{input.rows.length}</output></> }))
type ReadinessStubProps = { readonly state: string; readonly props: { readonly courseTitle?: string; readonly band?: string; readonly metrics?: ReadonlyArray<unknown> } }
vi.mock("@/components/blocks/dashboard/JobReadinessWidget/component", () => ({ JobReadinessWidgetBase: (input: ReadinessStubProps) => <><output data-testid="readiness-state">{input.state}</output><output data-testid="readiness-course">{input.props.courseTitle}</output><output data-testid="readiness-band">{input.props.band}</output><output data-testid="readiness-metrics">{input.props.metrics?.length}</output></> }))
import { OverviewChallengeSkills } from "@/components/blocks/profile/overview/OverviewChallengeSkills"
import { OverviewCodeSkills } from "@/components/blocks/profile/overview/OverviewCodeSkills"
import { OverviewJobReadiness } from "@/components/blocks/profile/overview/OverviewJobReadiness"

describe("profile overview evidence branches", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.evidence.clear() })
    it("resolves challenge and coding skill evidence states", async () => {
        mocks.evidence.set("solved-challenges", { isLoading: true, data: undefined }); const view = render(<OverviewChallengeSkills />); expect(screen.getByTestId("skill-rows")).toHaveTextContent("1")
        mocks.evidence.set("solved-challenges", { isLoading: false, data: [{ id: "1", difficulty: "easy", selectedLang: "ts" }, { id: "2", difficulty: "easy", selectedLang: "py" }] }); view.rerender(<OverviewChallengeSkills />); expect(screen.getByTestId("skill-total")).toHaveTextContent("2"); expect(screen.getByTestId("skill-message")).toHaveTextContent("overview.languages")
        mocks.evidence.set("coding-skills", { isLoading: false, data: { byLanguage: [{ key: "TypeScript", solved: 3 }], byDifficulty: [{ key: "easy", solved: 2 }], byDomain: [] } }); view.rerender(<OverviewCodeSkills />); await waitFor(() => expect(screen.getByTestId("skill-total")).toHaveTextContent("2"))
    })
    it("covers job readiness loading, error, empty and banded ready states", () => {
        mocks.evidence.set("job-readiness", { isLoading: true, data: undefined }); const view = render(<OverviewJobReadiness />); expect(screen.getByTestId("readiness-state")).toHaveTextContent("pending")
        mocks.evidence.set("job-readiness", { isLoading: false, error: new Error("offline"), data: undefined }); view.rerender(<OverviewJobReadiness />); expect(screen.getByTestId("readiness-state")).toHaveTextContent("failed")
        mocks.evidence.set("job-readiness", { isLoading: false, data: { tracks: [] } }); view.rerender(<OverviewJobReadiness />); expect(screen.getByTestId("readiness-state")).toHaveTextContent("empty")
        mocks.evidence.set("job-readiness", { isLoading: false, data: { foundation: { codingPercentile: 12 }, tracks: [{ courseId: "c", courseTitle: "Course", capstoneScore: 120, interviewScore: -1, cvScore: 80, depthScore: 50, band: "jobReady" }] } }); view.rerender(<OverviewJobReadiness />); expect(screen.getByTestId("readiness-state")).toHaveTextContent("ready"); expect(screen.getByTestId("readiness-band")).toHaveTextContent("jobReady"); expect(screen.getByTestId("readiness-metrics")).toHaveTextContent("3")
    })
})
