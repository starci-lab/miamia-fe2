/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
type SurfaceProps = { readonly surface: React.ComponentType }; type OverlayProps = { readonly isOpen: boolean }
const m = vi.hoisted(() => ({ token: "token", push: vi.fn() })); vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) })); vi.mock("@/components/blocks/study/PhrasePractice", () => ({ PhrasePractice: () => <output>practice</output> })); vi.mock("@/components/overlays/auth/SignInOverlay", () => ({ SignInOverlay: (p: OverlayProps) => p.isOpen ? <output>signin</output> : null })); vi.mock("./component", () => ({ StudyPracticePageBase: (p: SurfaceProps) => <p.surface /> })); import { StudyPracticePage } from "./index"
describe("StudyPracticePage", () => { it("mounts phrase practice through the page surface", () => { render(<StudyPracticePage slug="topic" />); expect(screen.getByText("practice")).toBeTruthy() }) })
