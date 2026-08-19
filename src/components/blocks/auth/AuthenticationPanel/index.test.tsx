import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AuthenticationPanel } from "./index"

const m = vi.hoisted(() => { const makePanel = () => ({ mode: "signIn", step: "details", sentCount: 0, hasAgreedToTerms: false, rememberMe: false, isPending: false, isResending: false, onSubmitDetails: vi.fn(), onSubmitCode: vi.fn(), onResend: vi.fn(), onChangeMode: vi.fn(), onChangeAgreedToTerms: vi.fn(), onChangeRememberMe: vi.fn(), onOauthPress: vi.fn() }); return { locale: "en", panel: makePanel(), makePanel, args: undefined as unknown, push: vi.fn() } })
vi.mock("next-intl", () => ({ useLocale: () => m.locale, useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/auth/useAuthPanel", () => ({ useAuthPanel: (args: unknown) => { m.args = args; return m.panel } }))
vi.mock("./component", () => ({
    AuthenticationPanelBase: (input: unknown) => {
        const view = input as { state: string; on?: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
        return <><output data-testid="state">{view.state}</output><button onClick={() => view.on?.submitDetails?.({ email: "a@example.com", password: "secret" })}>details</button><button onClick={() => view.on?.submitCode?.({ otp: "123456" })}>code</button><button onClick={() => view.on?.resend?.()}>resend</button><button onClick={() => view.on?.changeMode?.("signUp")}>sign-up</button><button onClick={() => view.on?.changeAgreedToTerms?.(true)}>agree</button><button onClick={() => view.on?.changeRememberMe?.(true)}>remember</button><button onClick={() => view.on?.openLegal?.("terms")}>terms</button><button onClick={() => view.on?.openLegal?.("privacy")}>privacy</button><button onClick={() => view.on?.oauthPress?.("google")}>oauth</button></>
    },
}))

beforeEach(() => { vi.clearAllMocks(); m.locale = "en"; m.panel = m.makePanel(); m.args = undefined })

describe("AuthenticationPanel connected half", () => {
    it("resolves details state and forwards all journey actions", () => {
        const signedIn = vi.fn(); render(<AuthenticationPanel initialMode="signIn" onSignedIn={signedIn} />)
        expect(screen.getByTestId("state")).toHaveTextContent("details"); fireEvent.click(screen.getByRole("button", { name: "details" })); fireEvent.click(screen.getByText("sign-up")); fireEvent.click(screen.getByText("agree")); fireEvent.click(screen.getByText("remember")); fireEvent.click(screen.getByText("terms")); fireEvent.click(screen.getByText("privacy")); fireEvent.click(screen.getByText("oauth"))
        expect(m.panel.onSubmitDetails).toHaveBeenCalledWith({ email: "a@example.com", password: "secret" }); expect(m.panel.onChangeMode).toHaveBeenCalledWith("signUp"); expect(m.panel.onChangeAgreedToTerms).toHaveBeenCalledWith(true); expect(m.panel.onChangeRememberMe).toHaveBeenCalledWith(true); expect(m.push).toHaveBeenCalledWith("https://academy.starci.org/en/terms"); expect(m.push).toHaveBeenCalledWith("https://academy.starci.org/en/privacy"); expect(m.panel.onOauthPress).toHaveBeenCalledWith("google"); expect(m.args).toEqual({ initialMode: "signIn", onSignedIn: signedIn })
    })
    it("builds code copy for seconds, minutes, resend and transport failures", () => {
        m.panel = { ...m.makePanel(), step: "code", mode: "forgotPassword", email: "reader@example.com", expiresInSeconds: 30, sentCount: 1, failure: { isTransport: true } }; const view = render(<AuthenticationPanel />); expect(screen.getByTestId("state")).toHaveTextContent("code"); fireEvent.click(screen.getByRole("button", { name: "code" })); fireEvent.click(screen.getByText("resend")); m.panel = { ...m.panel, expiresInSeconds: 120, sentCount: 2, failure: { isTransport: false, message: "Rejected" }, isResending: true }; view.rerender(<AuthenticationPanel />); expect(screen.getByTestId("state")).toHaveTextContent("code")
    })
    it("renders done and covers pending, settled and status branches", () => {
        m.panel = { ...m.makePanel(), step: "done", mode: "signUp" }; const view = render(<AuthenticationPanel />); expect(screen.getByTestId("state")).toHaveTextContent("done"); m.panel = { ...m.makePanel(), step: "details", isPending: true }; view.rerender(<AuthenticationPanel />); m.panel = { ...m.makePanel(), step: "code", sentCount: 2, isPending: true }; view.rerender(<AuthenticationPanel />); m.panel = { ...m.makePanel(), step: "details", failure: { isTransport: false } }; view.rerender(<AuthenticationPanel />); expect(screen.getByTestId("state")).toHaveTextContent("details")
    })
})
