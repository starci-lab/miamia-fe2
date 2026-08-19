import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ query: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, me: { data: { username: "me", avatar: null } }, follow: vi.fn(), push: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks", () => ({ useQueryGlobalLeaderboardSwr: () => m.query, useQueryMeSwr: () => m.me, useMutateSetFollowSwr: () => ({ trigger: m.follow }) }))
type LearnerProps = { readonly state: string; readonly on?: Record<string, () => void> }
vi.mock("./component", () => ({ TopLearnersBase: ({ state, on }: LearnerProps) => <><output data-testid="state">{state}</output><button onClick={on?.retry}>retry</button><button onClick={on?.seeMore}>more</button></> }))
import { TopLearners } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.query.data = undefined; m.query.error = undefined })
describe("TopLearners", () => { it("renders pending, failed and empty states", () => { const view = render(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.query.error = new Error("offline"); view.rerender(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); m.query.error = undefined; m.query.data = { entries: [], myRank: 0, myPoints: 0 }; view.rerender(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("empty") }); it("shows ready actions and retry/more callbacks", () => { m.query.data = { entries: [{ userGlobalId: "gid://User/1", username: "Ada", avatar: null, points: 10, rank: 1, isFollowing: false }], myRank: 2, myPoints: 8 }; render(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); fireEvent.click(screen.getByText("more")); expect(m.push).toHaveBeenCalledWith("/league") }) })
