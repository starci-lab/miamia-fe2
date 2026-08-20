import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ query: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, me: { data: undefined as unknown }, mutation: { trigger: vi.fn() }, push: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string, values?: Record<string, unknown>) => values ? `${key}:${String(values.rank ?? values.count ?? "")}` : key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks", () => ({ useQueryGlobalLeaderboardSwr: () => mocks.query, useQueryMeSwr: () => mocks.me, useMutateSetFollowSwr: () => mocks.mutation }))
type TopStubProps = { readonly state: string; readonly props: { readonly rows: ReadonlyArray<{ readonly id: string; readonly name: string; readonly isMe: boolean }> }; readonly on?: Record<string, () => Promise<void> | void> }
vi.mock("@/components/blocks/dashboard/TopLearners/component", () => ({ TopLearnersBase: (input: TopStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="rows">{input.props.rows.map((row) => `${row.id}:${row.name}`).join("|")}</output><button onClick={input.on?.seeMore}>more</button><button onClick={() => { const key = Object.keys(input.on ?? {}).find((item) => item.startsWith("open:")); if (key) void input.on?.[key]?.() }}>open</button><button onClick={() => { const key = Object.keys(input.on ?? {}).find((item) => item.startsWith("follow:")); if (key) void input.on?.[key]?.() }}>follow</button><button onClick={input.on?.retry}>retry</button></> }))
import { TopLearners } from "@/components/blocks/dashboard/TopLearners/index"

describe("TopLearners connected preview", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.query.data = undefined; mocks.query.error = undefined; mocks.me.data = undefined; mocks.mutation.trigger.mockResolvedValue({ data: { setFollow: { success: true } } }) })
    it("resolves loading/error/empty and optimistic ready rows", async () => {
        const view = render(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.query.error = new Error("offline"); view.rerender(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("failed")
        mocks.query.error = undefined; mocks.query.data = null; view.rerender(<TopLearners />); expect(screen.getByTestId("state")).toHaveTextContent("empty")
        const id = btoa("User:u1"); mocks.me.data = { username: "viewer", avatar: null }; mocks.query.data = { entries: [{ userGlobalId: id, username: "Ada", avatar: null, points: 10, rank: 1, isFollowing: false }], myPoints: 5, myRank: 2 }; view.rerender(<TopLearners />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready")); expect(screen.getByTestId("rows")).toHaveTextContent("viewer")
        fireEvent.click(screen.getByRole("button", { name: "more" })); fireEvent.click(screen.getByRole("button", { name: "open" })); fireEvent.click(screen.getByRole("button", { name: "follow" })); await waitFor(() => expect(mocks.mutation.trigger).toHaveBeenCalledWith({ userId: "u1", follow: true })); expect(mocks.push).toHaveBeenCalledWith("/league")
    })
})
