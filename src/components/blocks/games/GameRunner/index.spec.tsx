/** @vitest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
type RunnerProps = { readonly state: string; readonly on: { readonly exit?: () => void; readonly copyCode?: () => void } }
const m = vi.hoisted(() => ({ session: { state: "connecting", snapshot: undefined as unknown, answer: vi.fn(), restart: vi.fn(), retry: vi.fn(), leave: vi.fn().mockResolvedValue(undefined) }, exited: vi.fn() }))
vi.mock("@/hooks/games/useGameSession", () => ({ useGameSession: () => m.session })); vi.mock("./component", () => ({ GameRunnerBase: (p: RunnerProps) => <><output>{p.state}</output>{p.on.exit && <button onClick={p.on.exit}>exit</button>}{p.on.copyCode && <button onClick={p.on.copyCode}>copy</button>}</> })); import { GameRunner } from "./index"
const config = { game: "match_pairs", mode: "COUPLE", character: "MIA" } as const
describe("GameRunner", () => { it("connects an approved launch config", () => { m.session.state = "connecting"; render(<GameRunner config={config} token="token" onExit={m.exited} />); expect(screen.getByText("connecting")).toBeInTheDocument() }); it("leaves and reports exit", async () => { m.session.state = "waiting"; render(<GameRunner config={config} token="token" onExit={m.exited} />); fireEvent.click(screen.getByText("exit")); await vi.waitFor(() => expect(m.exited).toHaveBeenCalled()) }) })
