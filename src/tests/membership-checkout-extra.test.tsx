import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ catalog: { data: undefined as unknown, isLoading: true }, checkout: { isMutating: false, trigger: vi.fn() }, dismiss: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/swr/useQueryMiaMiaPricingCatalogSwr", () => ({ useQueryMiaMiaPricingCatalogSwr: () => mocks.catalog }))
vi.mock("@/hooks/swr/useMutatePurchaseMembershipSwr", () => ({ useMutatePurchaseMembershipSwr: () => mocks.checkout }))
vi.mock("@/modules/payment/submit-checkout", () => ({ submitCheckout: vi.fn() }))
type CheckoutStubProps = { readonly state: string; readonly props: { readonly price: string }; readonly on: { readonly checkout: () => void; readonly retry: () => void; readonly dismiss: () => void } }
vi.mock("@/components/blocks/membership/MembershipCheckoutPanel/component", () => ({ MembershipCheckoutPanelBase: (input: CheckoutStubProps) => <><output data-testid="membership-state">{input.state}</output><output data-testid="membership-price">{input.props.price}</output><button onClick={input.on.checkout}>checkout</button><button onClick={input.on.retry}>retry</button><button onClick={input.on.dismiss}>dismiss</button></> }))
import { MembershipCheckoutPanel } from "@/components/blocks/membership/MembershipCheckoutPanel/index"

describe("MembershipCheckoutPanel connected states", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.catalog.data = undefined; mocks.catalog.isLoading = true; mocks.checkout.isMutating = false })
    it("covers loading/idle/submitting/failed purchase and retry", async () => {
        const view = render(<MembershipCheckoutPanel onDismiss={mocks.dismiss} returnUrl="/ok" cancelUrl="/cancel" />); expect(screen.getByTestId("membership-state")).toHaveTextContent("loading")
        mocks.catalog.isLoading = false; mocks.catalog.data = { membership: { monthlyPriceVnd: 99000 } }; view.rerender(<MembershipCheckoutPanel onDismiss={mocks.dismiss} />); expect(screen.getByTestId("membership-state")).toHaveTextContent("idle"); expect(screen.getByTestId("membership-price")).toHaveTextContent("price")
        mocks.checkout.isMutating = true; view.rerender(<MembershipCheckoutPanel onDismiss={mocks.dismiss} />); expect(screen.getByTestId("membership-state")).toHaveTextContent("submitting")
        mocks.checkout.isMutating = false; mocks.checkout.trigger.mockRejectedValue(new Error("offline")); view.rerender(<MembershipCheckoutPanel onDismiss={mocks.dismiss} />); fireEvent.click(screen.getByRole("button", { name: "checkout" })); await waitFor(() => expect(screen.getByTestId("membership-state")).toHaveTextContent("failed")); fireEvent.click(screen.getByRole("button", { name: "retry" })); fireEvent.click(screen.getByRole("button", { name: "dismiss" })); expect(mocks.dismiss).toHaveBeenCalled()
    })
})
