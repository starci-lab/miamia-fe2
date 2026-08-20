import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ProfileProjectRoadmapPageBase } from "./component"
import type { ProfileCapstone } from "@/modules/api/graphql/queries/types/profile-evidence"

const project: ProfileCapstone = {
    courseGlobalId: "course-1",
    courseTitle: "Systems Design",
    totalMilestones: 2,
    completedMilestones: 1,
    totalTasks: 4,
    completedTasks: 2,
    milestones: [
        { milestoneGlobalId: "m1", title: "Foundations", position: 0, totalTasks: 2, passedTasks: 2, tasks: [] },
        { milestoneGlobalId: "m2", title: "Delivery", position: 1, totalTasks: 2, passedTasks: 1, tasks: [] },
    ],
}

describe("ProfileProjectRoadmapPageBase", () => {
    it("draws progress and distinguishes passed from active milestones", () => {
        const markup = renderToStaticMarkup(<ProfileProjectRoadmapPageBase state="ready" project={project} onBack={vi.fn()} />)
        expect(markup).toContain("Systems Design")
        expect(markup).toContain("1/2 milestones")
        expect(markup).toContain("Passed")
        expect(markup).toContain("50%")
    })

    it("renders pending skeleton rows and the two unavailable states", () => {
        const pending = renderToStaticMarkup(<ProfileProjectRoadmapPageBase state="pending" onBack={vi.fn()} />)
        expect(pending).toContain("data-loading=\"true\"")
        const missing = renderToStaticMarkup(<ProfileProjectRoadmapPageBase state="ready" onBack={vi.fn()} />)
        expect(missing).toContain("This capstone is not public.")
        const failed = renderToStaticMarkup(<ProfileProjectRoadmapPageBase state="error" onBack={vi.fn()} />)
        expect(failed).toContain("Capstone couldn&#x27;t be loaded")
        expect(failed).toContain("Roadmap couldn&#x27;t be loaded.")
    })
})
