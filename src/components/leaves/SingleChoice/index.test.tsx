import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SingleChoice } from "."

describe("SingleChoice", () => {
    it("reports one selected answer and exposes one radio group", () => {
        const select = vi.fn()
        render(<SingleChoice props={{ label: "Câu 1", name: "answer", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }] }} on={{ select }} />)
        expect(screen.getByRole("radiogroup", { name: "Câu 1" })).toBeTruthy()
        fireEvent.click(screen.getByRole("radio", { name: "B" }))
        expect(select).toHaveBeenCalledWith("b")
    })
})
