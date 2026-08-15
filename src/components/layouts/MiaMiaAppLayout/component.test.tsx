import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _MiaMiaAppLayout } from "./component"
const mobileTabs = ["home", "exam", "study", "game", "ranking"].map((id) => ({ id: id as "home" | "exam" | "study" | "game" | "ranking", label: id, icon: "home" as const }))
describe("_MiaMiaAppLayout", () => {
    it("keeps the mobile footbar at five destinations", () => {
        render(<_MiaMiaAppLayout props={{ spine: { lockedLabel: "Soon", groups: [] }, mobileTabs }} surface={() => <main>Surface</main>} />)
        expect(screen.getAllByRole("link")).toHaveLength(5)
    })
    it("announces Study as the current mobile destination", () => {
        const currentTabs = mobileTabs.map((tab) => ({ ...tab, isCurrent: tab.id === "study" }))
        render(<_MiaMiaAppLayout props={{ spine: { lockedLabel: "Soon", groups: [] }, mobileTabs: currentTabs }} surface={() => <main>Study</main>} />)
        expect(screen.getByRole("link", { name: "study" })).toHaveAttribute("aria-current", "page")
    })
})
