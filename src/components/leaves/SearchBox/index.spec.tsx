import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SearchBox } from "./index"

describe("SearchBox", () => {
    const props = { placeholder: "Tìm đề", label: "Tìm đề", clearLabel: "Xóa tìm kiếm" }

    it("publishes the visible query as the learner types", () => {
        const search = vi.fn()
        render(<SearchBox props={props} on={{ search }} />)
        fireEvent.change(screen.getByRole("searchbox", { name: "Tìm đề" }), { target: { value: "Bắc Ninh" } })
        expect(search).toHaveBeenLastCalledWith("Bắc Ninh")
    })

    it("clears both the field and the active query", () => {
        const search = vi.fn()
        render(<SearchBox props={props} on={{ search }} />)
        const field = screen.getByRole("searchbox", { name: "Tìm đề" })
        fireEvent.change(field, { target: { value: "Bắc Ninh" } })
        fireEvent.click(screen.getByRole("button", { name: "Xóa tìm kiếm" }))
        expect(field).toHaveValue("")
        expect(search).toHaveBeenLastCalledWith("")
    })
})
