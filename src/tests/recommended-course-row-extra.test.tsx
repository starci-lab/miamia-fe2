import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { RecommendedCourseRow } from "@/components/composites/RecommendedCourseRow"
import { CodingDomainPageBase } from "@/components/pages/CodingDomainPage/component"

describe("RecommendedCourseRow variants", () => {
    it("draws complete pricing and recommendation context", () => {
        const markup = renderToStaticMarkup(<RecommendedCourseRow props={{ id: "course", title: "Algorithms", cover: "/cover.png", price: "100₫", originalPrice: "200₫", discount: "50%", savings: "Save 100₫", priceDetailLabel: "Why this price?", reason: "Recommended for you" }} on={{ open: vi.fn(), openPriceDetail: vi.fn() }} />)
        expect(markup).toContain("Algorithms")
        expect(markup).toContain("50%")
        expect(markup).toContain("Why this price?")
        expect(markup).toContain("Recommended for you")
    })

    it("omits optional pricing notes and draws the loading surface", () => {
        const markup = renderToStaticMarkup(<RecommendedCourseRow isLoading props={{ id: "course", title: undefined, price: undefined }} />)
        expect(markup).toContain("data-loading=\"true\"")
        expect(markup).not.toContain("Why this price?")
    })

    it("draws coding domain list and notice projections", () => {
        const labels = { navHome: "Home", navPractice: "Practice", title: "Arrays", standingLabel: "Standing", standingFact: "1/2", meterLabel: "50%" }
        const ready = renderToStaticMarkup(<CodingDomainPageBase props={{ labels, percent: 50, problems: { state: "ready", items: [{ slug: "one", title: "One", fact: "10 points", isSolved: false, label: "Open One" }] } }} />)
        expect(ready).toContain("Arrays")
        expect(ready).toContain("One")
        expect(renderToStaticMarkup(<CodingDomainPageBase props={{ labels, problems: { state: "empty", noticeMessage: "No problems", noticeActionLabel: "Back" } }} />)).toContain("No problems")
        expect(renderToStaticMarkup(<CodingDomainPageBase props={{ labels, problems: { state: "all-solved", noticeMessage: "All solved" } }} />)).toContain("All solved")
    })
})
