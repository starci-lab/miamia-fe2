import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { ReactElement } from "react"

const mocks = vi.hoisted(() => ({ token: undefined as string | undefined, push: vi.fn() }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => mocks.token }))
type CatalogProps = { readonly onOpenPaper: (slug: string) => void; readonly onRequestPremium: () => void }
vi.mock("@/components/blocks/exam/ExamCatalog", () => ({ ExamCatalog: (input: CatalogProps) => <><button onClick={() => input.onOpenPaper("paper-1")}>paper</button><button onClick={input.onRequestPremium}>premium</button></> }))
type PageProps = { readonly surface: () => ReactElement }
vi.mock("@/components/pages/ExamCatalogPage/component", () => ({ ExamCatalogPageBase: (input: PageProps) => <input.surface /> }))
type OverlayProps = { readonly isOpen: boolean; readonly onDismiss: () => void }
vi.mock("@/components/overlays/auth/SignInOverlay", () => ({ SignInOverlay: (input: OverlayProps) => <><output data-testid="sign-in">{String(input.isOpen)}</output><button onClick={input.onDismiss}>sign-dismiss</button></> }))
vi.mock("@/components/overlays/membership/MembershipCheckoutOverlay", () => ({ MembershipCheckoutOverlay: (input: OverlayProps) => <output data-testid="checkout">{String(input.isOpen)}</output> }))
import { ExamCatalogPage } from "@/components/pages/ExamCatalogPage/index"

describe("ExamCatalogPage deferred intents", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.token = undefined })
    it("defers guest paper/premium actions and resumes after sign-in", async () => {
        const view = render(<ExamCatalogPage />); fireEvent.click(screen.getByRole("button", { name: "paper" })); expect(screen.getByTestId("sign-in")).toHaveTextContent("true"); fireEvent.click(screen.getByRole("button", { name: "sign-dismiss" })); mocks.token = "token"; view.rerender(<ExamCatalogPage />); await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/exam/paper-1"))
        mocks.token = undefined; view.rerender(<ExamCatalogPage />); fireEvent.click(screen.getByRole("button", { name: "premium" })); expect(screen.getByTestId("sign-in")).toHaveTextContent("true"); fireEvent.click(screen.getByRole("button", { name: "sign-dismiss" })); mocks.token = "token"; view.rerender(<ExamCatalogPage />); await waitFor(() => expect(screen.getByTestId("checkout")).toHaveTextContent("true"))
    })
    it("opens authenticated paper and checkout flows directly", () => { mocks.token = "token"; render(<ExamCatalogPage />); fireEvent.click(screen.getByRole("button", { name: "paper" })); fireEvent.click(screen.getByRole("button", { name: "premium" })); expect(mocks.push).toHaveBeenCalledWith("/exam/paper-1"); expect(screen.getByTestId("checkout")).toHaveTextContent("true") })
})
