import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ profile: { data: undefined as unknown, isLoading: true }, query: { data: undefined as unknown, error: undefined as unknown, isLoading: false }, push: vi.fn() }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada", courseId: "course-1" }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => mocks.profile }))
vi.mock("@/hooks/swr/useQueryProfileEvidenceSwr", () => ({ useQueryProfileEvidenceSwr: () => mocks.query }))
type RoadmapStubProps = { readonly state: string; readonly project?: { readonly courseTitle: string }; readonly onBack: () => void }
vi.mock("./component", () => ({ ProfileProjectRoadmapPageBase: (input: RoadmapStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="title">{input.project?.courseTitle ?? "none"}</output><button onClick={input.onBack}>back</button></> }))

import { ProfileProjectRoadmapPage } from "./index"

describe("ProfileProjectRoadmapPage connected lookup", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.profile.data = undefined; mocks.profile.isLoading = true; mocks.query.data = undefined; mocks.query.error = undefined; mocks.query.isLoading = false })

    it("resolves pending, error and selected capstone navigation", async () => {
        const view = render(<ProfileProjectRoadmapPage />)
        expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.profile.data = { id: "u1" }; mocks.profile.isLoading = false; mocks.query.error = new Error("offline"); view.rerender(<ProfileProjectRoadmapPage />)
        await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("error"))
        mocks.query.error = undefined; mocks.query.data = [{ courseGlobalId: "course-1", courseTitle: "Systems Design", totalMilestones: 1, completedMilestones: 1, totalTasks: 1, completedTasks: 1, milestones: [] }]; view.rerender(<ProfileProjectRoadmapPage />)
        await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready"))
        expect(screen.getByTestId("title")).toHaveTextContent("Systems Design")
        fireEvent.click(screen.getByRole("button", { name: "back" }))
        expect(mocks.push).toHaveBeenCalledWith("/profile/ada/projects")
    })
})
