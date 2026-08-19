import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { _CartPage } from "./component"
const labels = { navHome: "Home", navCart: "Cart", title: "Cart", summary: { subtotal: "Subtotal", savings: "Savings", surcharge: "Fee", total: "Total", unavailable: "Unavailable" }, installmentHint: "Installment", checkout: "Checkout", clearAll: "Clear", confirmClearAll: "Confirm", emptyMessage: "Empty", failedMessage: "Failed", failedAction: "Retry", emptyAction: "Browse" }
const actions = { checkout: vi.fn(), clearAll: vi.fn(), goHome: vi.fn(), browse: vi.fn() }
describe("_CartPage", () => {
    it("renders pending skeletons and settled notices", () => { const base = { labels, lines: [], subtotal: "0", savings: undefined, total: "0" }; expect(renderToStaticMarkup(<_CartPage state="pending" props={{ ...base }} on={actions} />)).toContain("Cart"); expect(renderToStaticMarkup(<_CartPage state="empty" props={{ ...base }} on={actions} />)).toContain("Empty"); expect(renderToStaticMarkup(<_CartPage state="failed" props={{ ...base }} on={actions} />)).toContain("Failed") })
    it("renders ready lines and pricing failure summary", () => { const html = renderToStaticMarkup(<_CartPage state="ready" props={{ labels, lines: [{ courseId: "c1", title: "Course", price: "100", originalPrice: "120", discountLabel: "20%", removeLabel: "Remove" }], subtotal: "100", savings: "20", total: "100", hasPricingFailed: true }} on={actions} />); expect(html).toContain("Course") })
})
