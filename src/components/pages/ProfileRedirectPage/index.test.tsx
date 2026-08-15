import { render, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useRouter } from "@/i18n/navigation"
import { useSessionRefresh } from "@/hooks/auth/useSessionRefresh"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { queryMe } from "@/modules/api/graphql/queries/query-me"
import { ProfileRedirectPage } from "./index"

vi.mock("@/i18n/navigation", () => ({ useRouter: vi.fn() }))
vi.mock("@/hooks/auth/useSessionRefresh", () => ({ useSessionRefresh: vi.fn() }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: vi.fn() }))
vi.mock("@/modules/api/graphql/queries/query-me", () => ({ queryMe: vi.fn() }))

describe("ProfileRedirectPage", () => {
    const replace = vi.fn()

    beforeEach(() => {
        replace.mockReset()
        vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>)
        vi.mocked(useSessionToken).mockReturnValue("session-token")
        vi.mocked(useSessionRefresh).mockReturnValue({ isRestoring: false })
    })

    it("redirects an authenticated learner to the public profile", async () => {
        vi.mocked(queryMe).mockResolvedValue({ data: { me: { data: { username: "minh" } } } } as Awaited<ReturnType<typeof queryMe>>)
        render(<ProfileRedirectPage />)
        await waitFor(() => expect(replace).toHaveBeenCalledWith("/profile/minh"))
    })

    it("redirects an authenticated learner when identity bootstrap fails", async () => {
        vi.mocked(queryMe).mockRejectedValue(new Error("Unauthorized"))
        render(<ProfileRedirectPage />)
        await waitFor(() => expect(replace).toHaveBeenCalledWith("/authentication?returnTo=/profile"))
    })

    it("redirects a learner after an anonymous session restore settles", async () => {
        vi.mocked(useSessionToken).mockReturnValue(undefined)
        render(<ProfileRedirectPage />)
        await waitFor(() => expect(replace).toHaveBeenCalledWith("/authentication?returnTo=/profile"))
    })

    it("uses the backend-compatible email handle while the me query settles", async () => {
        const payload = window.btoa(JSON.stringify({ email: "learner@miamia.test" }))
        vi.mocked(useSessionToken).mockReturnValue(`header.${payload}.signature`)
        vi.mocked(queryMe).mockResolvedValue({ data: { me: { data: { email: "learner@miamia.test" } } } } as Awaited<ReturnType<typeof queryMe>>)
        render(<ProfileRedirectPage />)
        await waitFor(() => expect(replace).toHaveBeenCalledWith("/profile/learner"))
    })
})
