/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ paper: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, grade: { trigger: vi.fn(), isMutating: false } }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "en" }))
vi.mock("@/hooks/swr/useQueryPaperDetailSwr", () => ({ useQueryPaperDetailSwr: () => m.paper })); vi.mock("@/hooks/swr/useMutateGradePaperSwr", () => ({ useMutateGradePaperSwr: () => m.grade }))
type BaseProps = { readonly state: string; readonly props: { readonly title: string } }
vi.mock("./component", () => ({ ExamSessionBase: (p: BaseProps) => <output>{p.state}:{p.props.title}</output> })); import { ExamSession } from "./index"
describe("ExamSession", () => { it("renders loading paper state", () => { m.paper = { data: undefined, error: undefined, mutate: vi.fn() }; render(<ExamSession slug="paper" onExit={vi.fn()} />); expect(screen.getByText(/loading/)).toBeTruthy() }); it("renders failed paper state", () => { m.paper = { data: null, error: undefined, mutate: vi.fn() }; render(<ExamSession slug="paper" onExit={vi.fn()} />); expect(screen.getByText(/failed/)).toBeTruthy() }); it("renders ready paper state", () => { m.paper = { data: { slug: "paper", titleEn: "Paper", titleVi: "Bai", questions: [] }, error: undefined, mutate: vi.fn() }; render(<ExamSession slug="paper" onExit={vi.fn()} />); expect(screen.getByText(/ready/)).toBeTruthy() }) })
