import { render, screen } from "@testing-library/react"; import { describe, expect, it, vi } from "vitest"; import { GameCatalog } from "./index"
describe("GameCatalog", () => { it("binds the canonical catalog", () => { render(<GameCatalog onPickGame={vi.fn()} />); expect(screen.getByText("Thủ thành từ vựng")).toBeInTheDocument(); expect(screen.getByText("Đấu đôi")).toBeInTheDocument() }) })
