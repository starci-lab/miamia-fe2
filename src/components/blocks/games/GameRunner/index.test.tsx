import { render, screen } from "@testing-library/react"; import { describe, expect, it, vi } from "vitest"
vi.mock("@/hooks/games/useGameSession", () => ({ useGameSession: () => ({ state: "connecting", answer: vi.fn(), restart: vi.fn(), retry: vi.fn(), leave: vi.fn() }) }))
import { GameRunner } from "./index"
describe("GameRunner", () => { it("connects an approved launch config", () => { render(<GameRunner config={{ game: "match_pairs", mode: "COUPLE", character: "MIA" }} token="token" onExit={vi.fn()} />); expect(screen.getByText("Đang kết nối server trò chơi…")).toBeInTheDocument() }) })
