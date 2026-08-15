import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProfileViewSwitch } from "./component"
vi.stubGlobal("ResizeObserver", class { observe() {}; unobserve() {}; disconnect() {} })
describe("ProfileViewSwitch", () => {
    it("reports the selected audience", () => {
        const select = vi.fn()
        render(<ProfileViewSwitch props={{ label: "View", privateLabel: "Private", publicLabel: "Public", selectedView: "private" }} on={{ select }} />)
        fireEvent.click(screen.getByText("Public"))
        expect(select).toHaveBeenCalledWith("public")
    })
})
