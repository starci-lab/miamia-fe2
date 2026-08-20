import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ profile: { data: undefined as unknown }, viewer: { data: undefined as unknown }, cv: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn() }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada" }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/swr/useQueryMeSwr", () => ({ useQueryMeSwr: () => mocks.viewer }))
vi.mock("@/hooks/swr/useQueryPublicUserCvSwr", () => ({ useQueryPublicUserCvSwr: () => mocks.cv }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => mocks.profile }))
type CvStubProps = { readonly state: string; readonly props: { readonly isSelf: boolean; readonly pdfUrl?: string }; readonly on: { readonly edit: () => void; readonly retry: () => void } }
vi.mock("@/components/pages/ProfilePublicCvPage/component", () => ({ ProfilePublicCvPageBase: (input: CvStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="self">{String(input.props.isSelf)}</output><output data-testid="pdf">{input.props.pdfUrl}</output><button onClick={input.on.edit}>edit</button><button onClick={input.on.retry}>retry</button></> }))
import { ProfilePublicCvPage } from "@/components/pages/ProfilePublicCvPage/index"

describe("ProfilePublicCvPage connected states", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.profile.data = undefined; mocks.viewer.data = undefined; mocks.cv.data = undefined; mocks.cv.error = undefined })
    it("distinguishes loading/error/empty/uncompiled/ready and self edit", async () => {
        const view = render(<ProfilePublicCvPage />); expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.cv.error = new Error("offline"); view.rerender(<ProfilePublicCvPage />); expect(screen.getByTestId("state")).toHaveTextContent("error")
        mocks.cv.error = undefined; mocks.cv.data = null; view.rerender(<ProfilePublicCvPage />); expect(screen.getByTestId("state")).toHaveTextContent("empty")
        mocks.cv.data = { label: "CV", pdfUrl: null }; view.rerender(<ProfilePublicCvPage />); expect(screen.getByTestId("state")).toHaveTextContent("uncompiled")
        mocks.profile.data = { id: "u1" }; mocks.viewer.data = { id: "u1" }; mocks.cv.data = { label: "CV", pdfUrl: "https://cv.test/cv.pdf" }; view.rerender(<ProfilePublicCvPage />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready")); expect(screen.getByTestId("self")).toHaveTextContent("true"); fireEvent.click(screen.getByRole("button", { name: "edit" })); fireEvent.click(screen.getByRole("button", { name: "retry" })); expect(mocks.push).toHaveBeenCalledWith("/profile/cv"); expect(mocks.cv.mutate).toHaveBeenCalled()
    })
})
