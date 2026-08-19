import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { CodingPracticeHubPageBase } from "./component"
const labels = { navHome: "Home", navPractice: "Practice", title: "Coding", standingLabel: "Standing", standingMore: "More" }
const domains = { state: "ready" as const, items: [{ domain: "arrays", name: "Arrays", solved: 2, total: 4 }] }
describe("CodingPracticeHubPageBase", () => {
    it("renders guest, signed-in resume and standing branches", () => { const on = { goHome: vi.fn(), openDomain: vi.fn(), recoverDomains: vi.fn(), resume: vi.fn(), openStanding: vi.fn() }; const guest = renderToStaticMarkup(<CodingPracticeHubPageBase session="guest" props={{ labels, domains: { ...domains, noticeMessage: "Sign in" }, resume: undefined }} on={on} />); expect(guest).toContain("Coding"); const signed = renderToStaticMarkup(<CodingPracticeHubPageBase session="signed-in" props={{ labels, domains, resume: { title: "Problem", kind: "Array", actionLabel: "Resume" }, standing: [{ id: "u1", rank: 1, username: "Ada", fact: "10 XP", isViewer: true }] }} on={on} />); expect(signed).toContain("Problem"); expect(signed).toContain("Ada") })
})
