import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _ProfileOverviewPage, type ProfileOverviewPageProps } from "./component"
vi.stubGlobal("ResizeObserver", class { observe() {}; unobserve() {}; disconnect() {} })

const input: ProfileOverviewPageProps = {
    state: "owner",
    props: {
        selectedView: "private",
        switchLabels: { label: "Profile view", privateLabel: "Private", publicLabel: "Public" },
        progress: { state: "ready", props: { title: "Progress", metricLabels: ["Streak", "Days", "Phrases", "Score"], metricValues: ["2", "4", "6", "80%"], levelLabel: "Level 2", levelPercent: 50, levelFact: "50/100 XP", failedMessage: "Failed", retryLabel: "Retry" } },
        wrapped: { state: "unlocked", props: { title: "Weekly", metricLabels: ["XP", "Phrases", "Papers", "Streak"], metricValues: ["10", "2", "1", "3"], notice: "Locked", actionLabel: "Open" } },
        publicMessage: "Public profile", publicDescription: "Private facts stay private",
    },
}

describe("_ProfileOverviewPage", () => {
    it("renders private evidence and reports the public view choice", () => {
        const selectView = vi.fn()
        render(<_ProfileOverviewPage {...input} on={{ selectView }} />)
        expect(screen.getByText("Progress")).toBeInTheDocument()
        fireEvent.click(screen.getByText("Public"))
        expect(selectView).toHaveBeenCalledWith("public")
    })

    it("never renders private evidence to a visitor", () => {
        render(<_ProfileOverviewPage {...input} state="visitor" />)
        expect(screen.queryByText("Progress")).not.toBeInTheDocument()
        expect(screen.getByText("Public profile")).toBeInTheDocument()
    })
})
