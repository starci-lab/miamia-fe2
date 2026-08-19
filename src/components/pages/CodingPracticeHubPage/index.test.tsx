import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ token: "token" as string | undefined, summary: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, progress: { data: undefined as unknown, error: undefined as unknown }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => m.token }))
vi.mock("@/hooks/swr/useQueryCodingDomainSummarySwr", () => ({ useQueryCodingDomainSummarySwr: () => m.summary }))
vi.mock("@/hooks/swr/useQueryMyCodingProgressSwr", () => ({ useQueryMyCodingProgressSwr: () => m.progress }))
type HubProps = { readonly on: Record<string, () => void> }
vi.mock("./component", () => ({ _CodingPracticeHubPage: ({ on }: HubProps) => <><output data-testid="state">rendered</output><button onClick={on.goHome}>home</button><button onClick={() => on.openDomain("arrays")}>domain</button><button onClick={on.recoverDomains}>recover</button></> }))
import { CodingPracticeHubPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.token = "token"; m.summary.data = undefined; m.summary.error = undefined; m.progress.data = undefined; m.progress.error = undefined })
describe("CodingPracticeHubPage", () => {
    it("evaluates pending, guest, failed and empty branches", () => { const view = render(<CodingPracticeHubPage />); expect(screen.getByTestId("state")).toHaveTextContent("rendered"); m.summary.data = { domains: [] }; m.token = undefined; view.rerender(<CodingPracticeHubPage />); m.token = "token"; m.summary.error = new Error("offline"); view.rerender(<CodingPracticeHubPage />); m.summary.error = undefined; view.rerender(<CodingPracticeHubPage />); expect(screen.getByTestId("state")).toHaveTextContent("rendered") })
    it("opens domains, homes and retries catalog", () => { m.summary.data = { domains: [{ domain: "arrays", total: 3 }] }; m.progress.data = { byDomain: [{ domain: "arrays", solved: 1 }] }; render(<CodingPracticeHubPage />); fireEvent.click(screen.getByText("domain")); fireEvent.click(screen.getByText("home")); fireEvent.click(screen.getByText("recover")); expect(m.push).toHaveBeenCalledWith("/practice/arrays"); expect(m.push).toHaveBeenCalledWith("/dashboard"); expect(m.summary.mutate).toHaveBeenCalled() })
})
