import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProfileSkillsPageBase } from "./component"

describe("ProfileSkillsPageBase", () => {
    it("keeps legacy metric, breakdown and solve-history order without generic evidence owner", () => {
        const select = vi.fn()
        const { container } = render(<ProfileSkillsPageBase state="ready" props={{
            metrics: [{ id: "solved", value: "42", label: "solved" }, { id: "xp", value: "3280", label: "coding XP" }, { id: "percentile", value: "Top 8%", label: "percentile" }, { id: "rank", value: "#126", label: "rank" }],
            byDifficulty: [{ key: "easy", solved: 18 }], byDomain: [{ key: "graphs", solved: 9 }], byLanguage: [{ key: "TypeScript", solved: 20 }],
            history: [{ slug: "shortest-path", problemTitle: "Shortest path", difficulty: "hard", domain: "graphs", languages: ["TypeScript"], firstSolvedAt: "2026-08-03" }], filterLabel: "Filters",
        }} on={{ select }} />)
        const text = container.textContent ?? ""
        expect(text.indexOf("Coding metrics")).toBeLessThan(text.indexOf("Stats"))
        expect(text.indexOf("Stats")).toBeLessThan(text.indexOf("Solve history"))
        expect(container.querySelectorAll("[data-node='profile-breakdown']")).toHaveLength(3)
        expect(screen.getByText("Shortest path")).toBeInTheDocument()
        expect(container.querySelector("[data-component='ProfileEvidenceSection']")).toBeNull()
    })
    it("renders pending skeleton branches and reports toolbar actions", () => { const search = vi.fn(); const filter = vi.fn(); const select = vi.fn(); render(<ProfileSkillsPageBase state="pending" props={{ metrics: [], byDifficulty: [], byDomain: [], byLanguage: [], history: [], filterLabel: "Filters" }} on={{ search, filter, select }} />); fireEvent.change(screen.getByPlaceholderText("Search solved problems"), { target: { value: "graphs" } }); fireEvent.click(screen.getByRole("button", { name: "Filters" })); expect(search).toHaveBeenCalledWith("graphs"); expect(filter).toHaveBeenCalledOnce(); expect(select).not.toHaveBeenCalled() })
})
