import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LearnerWrappedSummary } from "./component"
describe("LearnerWrappedSummary", () => {
    it("shows a truthful lock instead of statistics", () => {
        render(<LearnerWrappedSummary state="locked" props={{ title: "Weekly", metricLabels: ["XP", "Phrases", "Papers", "Streak"], notice: "Unlocks in 2 days" }} />)
        expect(screen.getByText("Unlocks in 2 days")).toBeInTheDocument()
        expect(screen.queryByText("XP")).not.toBeInTheDocument()
    })
})
