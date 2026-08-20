import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ push: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ usePathname: () => "/study/explore", useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/auth/useSessionRefresh", () => ({ useSessionRefresh: vi.fn() }))
vi.mock("@/components/overlays/app/ComingSoonOverlay", () => ({ ComingSoonOverlay: () => null }))

import { MiaMiaAppLayout } from "./index"

describe("MiaMiaAppLayout", () => {
    it("unlocks Study, marks its route family current and opens its landing page", () => {
        render(<MiaMiaAppLayout surface={() => <main>Study surface</main>} />)
        const studyLinks = screen.getAllByRole("link", { name: "study" })
        expect(studyLinks.some((link) => link.getAttribute("aria-current") === "page")).toBe(true)
        fireEvent.click(studyLinks[0])
        expect(mocks.push).toHaveBeenCalledWith("/study")
        fireEvent.click(screen.getAllByRole("link", { name: "game" })[0])
        expect(mocks.push).toHaveBeenCalledWith("/game")
    })
})
