import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LearnerProgressSnapshot } from "./component"
describe("LearnerProgressSnapshot", () => {
    it("renders backend totals and level progress", () => {
        render(<LearnerProgressSnapshot state="ready" props={{ title: "Progress", metricLabels: ["Streak", "Days", "Phrases", "Score"], metricValues: ["4", "8", "12", "90%"], levelLabel: "Level 3", levelPercent: 50, levelFact: "50/100 XP", failedMessage: "Failed", retryLabel: "Retry" }} />)
        expect(screen.getByText("90%")).toBeInTheDocument()
        expect(screen.getByLabelText("Level 3")).toHaveAttribute("aria-valuenow", "50")
    })
})
