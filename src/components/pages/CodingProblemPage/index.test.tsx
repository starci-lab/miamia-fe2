import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ problem: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, socket: { verdict: undefined as unknown, isConnected: true }, submit: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/swr/useQueryCodingProblemSwr", () => ({ useQueryCodingProblemSwr: () => m.problem }))
vi.mock("@/hooks/socketio/useJobVerdictSocketIo", () => ({ useJobVerdictSocketIo: () => m.socket }))
vi.mock("@/modules/api/graphql/mutations/mutation-submit-coding-solution", () => ({ mutationSubmitCodingSolution: m.submit }))
type CodingProps = { readonly on: Record<string, (...args: ReadonlyArray<unknown>) => void> }
vi.mock("./component", () => ({ CodingProblemPageBase: ({ on }: CodingProps) => <><output data-testid="state">rendered</output><button onClick={on.submit}>submit</button><button onClick={on.verdictAct}>retry</button></> }))
import { CodingProblemPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.problem.data = undefined; m.problem.error = undefined })
describe("CodingProblemPage", () => { it("renders loading/error presentation", () => { const view = render(<CodingProblemPage slug="two-sum" />); expect(screen.getByTestId("state")).toHaveTextContent("rendered"); m.problem.error = new Error("offline"); view.rerender(<CodingProblemPage slug="two-sum" />); expect(screen.getByTestId("state")).toHaveTextContent("rendered") }); it("retries verdict and submits a ready problem", async () => { m.problem.data = { title: "Two Sum", statement: "Solve", difficulty: "easy", points: 10, timeLimitMs: 1000, memoryLimitKb: 1024, tags: [], starterCodes: [] }; m.submit.mockResolvedValue({ data: { submitCodingSolution: { data: { jobId: "job-1" } } } }); render(<CodingProblemPage slug="two-sum" />); fireEvent.click(screen.getByText("retry")); fireEvent.click(screen.getByText("submit")); await Promise.resolve(); expect(m.problem.mutate).toHaveBeenCalled(); expect(m.submit).toHaveBeenCalled() }) })
