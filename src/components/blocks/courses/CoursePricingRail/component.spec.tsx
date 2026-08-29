import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CoursePricingRailBase } from "./component"

const props = {
    title: "Fullstack Mastery",
    price: "1,250,000 ₫",
    originalPrice: "1,500,000 ₫",
    discountLabel: "−17%",
    savingsLabel: "Save 250,000 ₫",
    scarcityLabel: "100 seats left in Early",
    phases: [
        { id: "pioneer", name: "Pioneer", value: "1,000,000 ₫" },
        { id: "early", name: "Early", value: "Open now", isActive: true },
        { id: "standard", name: "Standard", value: "1,500,000 ₫" },
    ],
    ctaLabel: "Enrol now",
    enrolmentLabel: "13 learners enrolled",
}

describe("CoursePricingRailBase", () => {
    it("keeps one sticky-card decision with compact phase comparison", () => {
        const act = vi.fn()
        render(<CoursePricingRailBase state="ready" props={props} on={{ act }} />)

        expect(document.querySelector("[data-component=\"SurfaceCardSurface\"]")).toBeTruthy()
        expect(screen.getAllByText("Early")).toHaveLength(2)
        expect(screen.getByText("100 seats left in Early")).toBeInTheDocument()
        expect(document.querySelectorAll(".layout-name-course-pricing-phase-card")).toHaveLength(3)
        fireEvent.click(screen.getByRole("button", { name: "Enrol now" }))
        expect(act).toHaveBeenCalledOnce()
    })

    it("rests only the unresolved price", () => {
        render(<CoursePricingRailBase state="price-pending" props={{ ...props, price: undefined }} />)
        expect(screen.getByText("100 seats left in Early")).toBeInTheDocument()
        expect(screen.queryByText("1,250,000 ₫")).toBeNull()
    })
})
