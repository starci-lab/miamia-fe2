import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _ProfileWrappedPage } from "./component"
vi.stubGlobal("ResizeObserver", class { observe() {}; unobserve() {}; disconnect() {} })
describe("_ProfileWrappedPage", () => {
    it("changes the selected period without inventing statistics", () => {
        const selectPeriod = vi.fn()
        render(<_ProfileWrappedPage props={{ period: "weekly", periodLabel: "Period", periods: [{ id: "weekly", label: "Week" }, { id: "monthly", label: "Month" }], summary: { state: "locked", props: { title: "Weekly", metricLabels: ["XP", "Phrases", "Papers", "Streak"], notice: "Locked" } } }} on={{ selectPeriod }} />)
        fireEvent.click(screen.getByText("Month"))
        expect(selectPeriod).toHaveBeenCalledWith("monthly")
    })
})
