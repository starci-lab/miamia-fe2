/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { CodingProblemPageData } from "./component"
type BlockProps = { readonly state: string }
vi.mock("@/components/blocks/coding/JudgeStatusStrip/component", () => ({ JudgeStatusStripBase: (p: BlockProps) => <output>{p.state}</output> })); vi.mock("@/components/blocks/coding/ProblemReadingColumn/component", () => ({ ProblemReadingColumnBase: (p: BlockProps) => <output>{p.state}</output> })); vi.mock("@/components/blocks/coding/SolutionEditor/component", () => ({ SolutionEditorBase: (p: BlockProps) => <output>{p.state}</output> })); import { CodingProblemPageBase } from "./component"
const data = { reading: { state: "ready", props: {} }, verdict: { state: "idle", props: {} }, editor: { state: "ready", props: {} } } as unknown as CodingProblemPageData
describe("CodingProblemPageBase", () => { it("projects reading, verdict and editor blocks", () => { render(<CodingProblemPageBase props={data} on={{}} />); expect(screen.getAllByText("ready")).toHaveLength(2); expect(screen.getByText("idle")).toBeTruthy() }) })
