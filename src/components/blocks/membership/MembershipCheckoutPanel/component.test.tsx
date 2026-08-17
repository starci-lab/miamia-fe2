import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _MembershipCheckoutPanel } from "./component"

const props = { title: "Premium", body: "Mở kho đề", price: "49.000đ / tháng", benefits: ["100+ đề"], checkoutLabel: "Thanh toán", cancelLabel: "Để sau", errorMessage: "Thử lại" }

describe("_MembershipCheckoutPanel", () => {
    it("shows value before its checkout action", () => {
        const checkout = vi.fn()
        render(<_MembershipCheckoutPanel state="idle" props={props} on={{ checkout }} />)
        expect(screen.getByText("100+ đề")).toBeTruthy()
        fireEvent.click(screen.getByRole("button", { name: "Thanh toán" }))
        expect(checkout).toHaveBeenCalledOnce()
    })
})
