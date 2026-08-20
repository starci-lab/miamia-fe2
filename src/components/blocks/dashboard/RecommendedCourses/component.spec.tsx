/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"; import { describe, expect, it, vi } from "vitest"
type CardProps = { readonly props?: { readonly label?: string } }
vi.mock("@/components/branches/SurfaceCard", () => ({ SurfaceCard: (p: CardProps) => <output>{p.props?.label ?? "failed"}</output> })); vi.mock("@/components/branches/SurfaceListCard", () => ({ SurfaceListCard: () => <output>ready</output> })); import { RecommendedCoursesBase } from "./component"
const props = { label: "Courses", rows: [] }
describe("RecommendedCoursesBase", () => { it("hides", () => { const { container } = render(<RecommendedCoursesBase state="hidden" props={props} />); expect(container).toBeEmptyDOMElement() }); it("renders failed", () => { render(<RecommendedCoursesBase state="failed" props={{ ...props, errorMessage: "offline" }} />); expect(screen.getByText("Courses")).toBeTruthy() }); it("renders ready", () => { render(<RecommendedCoursesBase state="ready" props={props} />); expect(screen.getByText("ready")).toBeTruthy() }) })
