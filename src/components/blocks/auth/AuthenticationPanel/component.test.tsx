/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { AuthenticationPanelBase, type AuthenticationPanelProps } from "./component"

afterEach(cleanup)

const signUpProps: Extract<AuthenticationPanelProps, { state: "details" }> = {
    state: "details",
    props: {
        mode: "signUp",
        title: "Sign Up",
        subtitle: "Create an account to continue",
        statusMessage: "",
        isError: false,
        isPending: false,
        hasAgreedToTerms: true,
        rememberMe: false,
        emailLabel: "Email",
        emailPlaceholder: "Enter your email",
        passwordLabel: "Choose a password",
        passwordPlaceholder: "Enter your password",
        passwordHint: "Password hint",
        revealLabel: "Show password",
        hideLabel: "Hide password",
        confirmPasswordLabel: "Confirm password",
        confirmPasswordPlaceholder: "Confirm your password",
        confirmPasswordMismatch: "Passwords must match",
        submitLabel: "Create account",
        orLabel: "OR",
        oauthGoogle: "Sign In With Google",
        oauthGithub: "Sign In With GitHub",
        rememberMeLabel: "Remember me",
        forgotPassword: "Forgot Password?",
        agreeToTerms: "I agree to the terms",
        agreeToTermsPrefix: "I have read and agree to the",
        termsLabel: "Terms of Service",
        andLabel: "and",
        privacyLabel: "Privacy Policy",
        promptQuestion: "Already have an account?",
        promptAction: "Sign In",
    },
}

describe("AuthenticationPanelBase", () => {
    it("ports the legacy sign-up anatomy: two password fields and a real checkbox", () => {
        const openLegal = vi.fn()
        const { container } = render(<AuthenticationPanelBase {...signUpProps} on={{ openLegal }} />)

        expect(screen.getByLabelText("Choose a password").getAttribute("autocomplete")).toBe("new-password")
        expect(screen.getByLabelText("Confirm password").getAttribute("autocomplete")).toBe("new-password")
        expect(screen.getByRole("checkbox", { name: "I agree to the terms" })).toBeTruthy()
        expect(container.querySelector("[data-slot='checkbox-control']")).toBeTruthy()
        expect(screen.getByRole("link", { name: "Terms of Service" }).getAttribute("href")).toBeNull()
        expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBeNull()
        fireEvent.click(screen.getByRole("link", { name: "Terms of Service" }))
        expect(openLegal).toHaveBeenCalledWith("terms")
    })

    it("does not submit sign-up until the confirmation matches", () => {
        const submitDetails = vi.fn()
        render(<AuthenticationPanelBase {...signUpProps} on={{ submitDetails }} />)

        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reader@example.com" } })
        fireEvent.change(screen.getByLabelText("Choose a password"), { target: { value: "correct-secret" } })
        fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "wrong-secret" } })
        fireEvent.click(screen.getByRole("button", { name: "Create account" }))

        expect(submitDetails).not.toHaveBeenCalled()
        expect(screen.getByText("Passwords must match")).toBeTruthy()

        fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "correct-secret" } })
        fireEvent.click(screen.getByRole("button", { name: "Create account" }))
        expect(submitDetails).toHaveBeenCalledWith({ email: "reader@example.com", password: "correct-secret" })
    })

    it("puts pending feedback on the submit action itself", () => {
        const pending = {
            ...signUpProps,
            props: { ...signUpProps.props, isPending: true },
        } satisfies typeof signUpProps
        const { container } = render(<AuthenticationPanelBase {...pending} />)

        const submit = screen.getByRole("button", { name: "Create account" })
        expect(submit.getAttribute("data-action-pending")).toBe("true")
        expect(container.querySelector("[data-slot='spinner']")).toBeTruthy()
    })

    it("separates independent credential blocks with the local gap", () => {
        const { container } = render(<AuthenticationPanelBase {...signUpProps} />)
        const credentials = container.querySelector("[data-node='stacked-peer-controls']")

        // The controls are small blocks of one function inside one block, so their seam
        // out-ranks the gap-3 each of them uses between its own label and control.
        expect(credentials?.className).toContain("gap-4")
        expect(credentials?.className).not.toContain("gap-2")
        expect(container.querySelector("[data-node='label-field-hint']")?.className).toContain("gap-3")
    })
    it("submits a code, resends and returns to another email", () => {
        const submitCode = vi.fn(); const resend = vi.fn(); const changeMode = vi.fn()
        const props: AuthenticationPanelProps = { state: "code", props: { title: "Verify", subtitle: "Enter the code", statusMessage: "Code sent", isError: false, isPending: false, codeLabel: "Code", codePlaceholder: "123456", codeHint: "Expires soon", submitLabel: "Verify", resendLabel: "Resend", useAnotherEmailLabel: "Use another email" } }
        render(<AuthenticationPanelBase {...props} on={{ submitCode, resend, changeMode }} />)
        fireEvent.change(screen.getByLabelText("Code"), { target: { value: "654321" } }); fireEvent.click(screen.getByRole("button", { name: "Verify" })); fireEvent.click(screen.getByRole("link", { name: "Resend" })); fireEvent.click(screen.getByRole("link", { name: "Use another email" })); expect(submitCode).toHaveBeenCalledWith({ otp: "654321" }); expect(resend).toHaveBeenCalledOnce(); expect(changeMode).toHaveBeenCalledWith("signIn")
    })
    it("renders done status and sign-in shortcuts", () => {
        const oauthPress = vi.fn(); const props: AuthenticationPanelProps = { state: "done", props: { title: "Done", subtitle: "Welcome", statusMessage: "Signed in", isError: false, isPending: false, doneTitle: "Welcome back", doneHint: "Continue learning" } }
        render(<AuthenticationPanelBase {...props} />); expect(screen.getByText("Welcome back")).toBeInTheDocument(); expect(screen.getByText("Signed in")).toBeInTheDocument()
        const signIn = { ...signUpProps, props: { ...signUpProps.props, mode: "signIn" as const, hasAgreedToTerms: false } }; render(<AuthenticationPanelBase {...signIn} on={{ oauthPress }} />); fireEvent.click(screen.getByRole("button", { name: "Sign In With GitHub" })); expect(oauthPress).toHaveBeenCalledWith("github")
    })
})
