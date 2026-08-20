import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
    problems: { data: undefined as unknown, error: undefined as unknown },
    progress: { data: undefined as unknown, error: undefined as unknown },
    push: vi.fn(),
}))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryCodingProblemsSwr", () => ({ useQueryCodingProblemsSwr: () => mocks.problems }))
vi.mock("@/hooks/swr/useQueryMyCodingProgressSwr", () => ({ useQueryMyCodingProgressSwr: () => mocks.progress }))
type DomainStubProps = { readonly props: { readonly problems: { readonly state: string; readonly items?: ReadonlyArray<{ readonly slug: string; readonly fact: string; readonly isSolved: boolean }> } }; readonly on?: { readonly openProblem?: (slug: string) => void; readonly goPractice?: () => void } }
vi.mock("./component", () => ({ CodingDomainPageBase: (input: DomainStubProps) => <><output data-testid="domain-state">{input.props.problems.state}</output><output data-testid="facts">{input.props.problems.items?.map((item) => item.fact).join("|")}</output><button onClick={() => input.on?.openProblem?.("two-pointers")}>open</button><button onClick={input.on?.goPractice}>practice</button></> }))

import { CodingDomainPage } from "./index"

describe("CodingDomainPage connected state", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.problems.data = undefined; mocks.problems.error = undefined; mocks.progress.data = undefined; mocks.progress.error = undefined })

    it("resolves pending, empty and all-solved catalog states", async () => {
        const view = render(<CodingDomainPage domain="arrays" />)
        expect(screen.getByTestId("domain-state")).toHaveTextContent("pending")
        mocks.problems.data = { total: 0, problems: [] }; view.rerender(<CodingDomainPage domain="arrays" />)
        await waitFor(() => expect(screen.getByTestId("domain-state")).toHaveTextContent("empty"))
        mocks.problems.data = { total: 2, problems: [{ id: "a", slug: "a", title: "A", difficulty: "easy", points: 10 }, { id: "b", slug: "b", title: "B", difficulty: "hard", points: 20 }] }; mocks.progress.data = { solvedProblemIds: ["a", "b"], attemptedProblemIds: [] }; view.rerender(<CodingDomainPage domain="arrays" />)
        await waitFor(() => expect(screen.getByTestId("domain-state")).toHaveTextContent("all-solved"))
    })

    it("joins solved and attempted progress and routes actions", async () => {
        mocks.problems.data = { total: 2, problems: [{ id: "a", slug: "a", title: "A", difficulty: "easy", points: 10 }, { id: "b", slug: "b", title: "B", difficulty: "hard", points: 20 }] }; mocks.progress.data = { solvedProblemIds: ["a"], attemptedProblemIds: ["b"] }
        render(<CodingDomainPage domain="arrays" />)
        await waitFor(() => expect(screen.getByTestId("domain-state")).toHaveTextContent("ready"))
        expect(screen.getByTestId("facts")).toHaveTextContent("rowFact")
        expect(screen.getByTestId("facts")).toHaveTextContent("rowFactAttempted")
        fireEvent.click(screen.getByRole("button", { name: "open" })); fireEvent.click(screen.getByRole("button", { name: "practice" }))
        expect(mocks.push).toHaveBeenCalledWith("/practice/problem/two-pointers")
        expect(mocks.push).toHaveBeenCalledWith("/practice")
    })
})
