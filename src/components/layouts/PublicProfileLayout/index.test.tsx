import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
const profile = { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada" }) }))
vi.mock("@/i18n/navigation", () => ({ usePathname: () => "/profile/ada", useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => profile }))
vi.mock("@/hooks/swr/useQueryMeSwr", () => ({ useQueryMeSwr: () => ({ data: { id: "viewer" } }) }))
type ProfileProps = { readonly state: string }
vi.mock("./component", () => ({ _PublicProfileLayout: ({ state }: ProfileProps) => <output data-testid="state">{state}</output> }))
import { PublicProfileLayout } from "./index"
describe("PublicProfileLayout", () => { it("renders loading and failed profile states", () => { const view = render(<PublicProfileLayout content={<div />} />); expect(screen.getByTestId("state")).toHaveTextContent("loading"); profile.error = new Error("offline"); view.rerender(<PublicProfileLayout content={<div />} />); expect(screen.getByTestId("state")).toHaveTextContent("failed") }) })
