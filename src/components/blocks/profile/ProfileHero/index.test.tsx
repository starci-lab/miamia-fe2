import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
    params: {} as Record<string, string>,
    profile: { data: undefined as unknown, mutate: vi.fn() },
    viewer: { data: undefined as unknown },
    follow: { isMutating: false, trigger: vi.fn() },
    push: vi.fn(),
}))

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("next/navigation", () => ({ useParams: () => mocks.params }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => mocks.profile }))
vi.mock("@/hooks/swr/useQueryMeSwr", () => ({ useQueryMeSwr: () => mocks.viewer }))
vi.mock("@/hooks/swr/useMutateSetFollowSwr", () => ({ useMutateSetFollowSwr: () => mocks.follow }))
type HeroStubProps = { readonly state: string; readonly props: { readonly primaryLabel: string }; readonly on?: { readonly primary?: () => void; readonly share?: () => void } }
vi.mock("./component", () => ({
    ProfileHeroBase: (input: HeroStubProps) => (
        <><output data-testid="hero-state">{input.state}</output><output data-testid="primary-label">{input["props"]["primaryLabel"]}</output><button onClick={input.on?.primary}>primary</button><button onClick={input.on?.share}>share</button></>
    ),
}))

import { ProfileHero } from "./index"

describe("ProfileHero connected identity", () => {
    beforeEach(() => {
        vi.clearAllMocks(); mocks.params = { username: "reader" }; mocks.profile.data = undefined; mocks.viewer.data = undefined; mocks.follow.isMutating = false
        Object.defineProperty(navigator, "share", { configurable: true, value: undefined })
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn() } })
    })

    it("shows pending, then routes the self profile to edit", async () => {
        const view = render(<ProfileHero />)
        expect(screen.getByTestId("hero-state")).toHaveTextContent("pending")
        mocks.profile.data = { id: "u1", username: "reader", displayName: " Reader ", createdAt: "invalid" }; mocks.viewer.data = { id: "u1" }
        view.rerender(<ProfileHero />)
        await waitFor(() => expect(screen.getByTestId("primary-label")).toHaveTextContent("actions.edit"))
        fireEvent.click(screen.getByRole("button", { name: "primary" }))
        expect(mocks.push).toHaveBeenCalledWith("/profile/settings/edit")
    })

    it("follows another profile and uses the clipboard share fallback", async () => {
        mocks.profile.data = { id: "u2", username: "other", displayName: "Other", isFollowedByMe: false, createdAt: "2020-01-01", followerCount: 2, followingCount: 3 }
        mocks.follow.trigger.mockResolvedValue(undefined)
        render(<ProfileHero />)
        await waitFor(() => expect(screen.getByTestId("primary-label")).toHaveTextContent("actions.follow"))
        fireEvent.click(screen.getByRole("button", { name: "primary" })); await waitFor(() => expect(mocks.profile.mutate).toHaveBeenCalled())
        expect(mocks.follow.trigger).toHaveBeenCalledWith({ userId: "u2", follow: true })
        fireEvent.click(screen.getByRole("button", { name: "share" }))
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href)
    })
})
