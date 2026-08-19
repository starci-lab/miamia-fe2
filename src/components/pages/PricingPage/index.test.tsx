import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ token: undefined as string | undefined, catalog: { data: { examDownloads: { packages: [{ packageId: "personal", priceVnd: 100 }] } } }, error: undefined as unknown, replace: vi.fn() }))
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(), useRouter: () => ({ replace: m.replace }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ replace: m.replace }) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => m.token }))
vi.mock("@/hooks/swr/useQueryMiaMiaPricingCatalogSwr", () => ({ useQueryMiaMiaPricingCatalogSwr: () => ({ data: m.catalog.data, error: m.error }) }))
type SelectProps = { readonly onSelect: (offer: string) => void }
type OpenProps = { readonly isOpen: boolean }
type ViewProps = { readonly catalog: React.ComponentType }
vi.mock("@/components/blocks/payment/PricingOfferCatalog", () => ({ PricingOfferCatalog: ({ onSelect }: SelectProps) => <button onClick={() => onSelect("pro")}>choose</button> }))
vi.mock("@/components/blocks/payment/PaymentReturnStatus", () => ({ PaymentReturnStatus: () => <output>return</output> }))
vi.mock("@/components/overlays/auth/SignInOverlay", () => ({ SignInOverlay: ({ isOpen }: OpenProps) => isOpen ? <output>signin</output> : null }))
vi.mock("@/components/overlays/membership/MembershipCheckoutOverlay", () => ({ MembershipCheckoutOverlay: ({ isOpen }: OpenProps) => isOpen ? <output>membership</output> : null }))
vi.mock("@/components/overlays/payment/ExamDownloadCheckoutOverlay", () => ({ ExamDownloadCheckoutOverlay: ({ isOpen }: OpenProps) => isOpen ? <output>download</output> : null }))
vi.mock("@/components/overlays/payment/WhiteLabelInquiryOverlay", () => ({ WhiteLabelInquiryOverlay: ({ isOpen }: OpenProps) => isOpen ? <output>white-label</output> : null }))
vi.mock("./component", () => ({ PricingPageBase: ({ catalog: Catalog }: ViewProps) => <Catalog /> }))
import { PricingPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.token = undefined; m.error = undefined })
describe("PricingPage", () => {
    it("opens sign-in before membership for a guest", () => { render(<PricingPage />); fireEvent.click(screen.getByText("choose")); expect(screen.getByText("signin")).toBeTruthy() })
    it("opens membership directly for an authenticated viewer", () => { m.token = "token"; render(<PricingPage />); fireEvent.click(screen.getByText("choose")); expect(screen.getByText("membership")).toBeTruthy() })
})
