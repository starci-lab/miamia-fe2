/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
type BaseProps = { readonly state: string }
vi.mock("@/hooks", () => ({ useQueryProgressSummarySwr: () => ({ data: { completed: 2 }, error: undefined }) })); vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => "token" })); vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key })); vi.mock("./component", () => ({ StudyProgressBase: (p: BaseProps) => <output>{p.state}</output> })); import { StudyProgress } from "./index"
describe("StudyProgress", () => { it("renders connected progress", () => { render(<StudyProgress onBrowse={vi.fn()} onRequireSignIn={vi.fn()} />); expect(screen.getByText(/pending|ready/)).toBeTruthy() }) })
