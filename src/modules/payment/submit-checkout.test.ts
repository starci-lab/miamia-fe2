import { afterEach, describe, expect, it, vi } from "vitest"
import { submitCheckout } from "./submit-checkout"

afterEach(() => {
    document.body.replaceChildren()
    vi.restoreAllMocks()
})

describe("submitCheckout", () => {
    it("posts provider fields instead of placing them in the URL", () => {
        const submit = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => undefined)
        submitCheckout({ checkoutUrl: "https://pay.test/checkout", checkoutFields: JSON.stringify({ orderCode: 42, signature: "safe" }) })
        const form = document.querySelector("form")
        expect(form?.method).toBe("post")
        expect(form?.action).toBe("https://pay.test/checkout")
        expect(Object.fromEntries([...form!.querySelectorAll("input")].map((input) => [input.name, input.value]))).toEqual({ orderCode: "42", signature: "safe" })
        expect(submit).toHaveBeenCalledOnce()
    })
})
