/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"; import { describe, expect, it, vi } from "vitest"
type CardProps = { readonly props?: { readonly label?: string } }
vi.mock("@/components/branches/SurfaceCard", () => ({ SurfaceCard: (p: CardProps) => <output>{p.props?.label ?? "failed"}</output> })); vi.mock("@/components/branches/SurfaceListCard", () => ({ SurfaceListCard: () => <output>ready</output> })); import { UpcomingLivestreamCardBase } from "./component"
const props = { label: "Streams", rows: [] }
describe("UpcomingLivestreamCardBase", () => { it("hides", () => { const { container } = render(<UpcomingLivestreamCardBase state="hidden" props={props} />); expect(container).toBeEmptyDOMElement() }); it("renders failed", () => { render(<UpcomingLivestreamCardBase state="failed" props={{ ...props, errorMessage: "offline" }} />); expect(screen.getByText("Streams")).toBeTruthy() }); it("renders ready", () => { render(<UpcomingLivestreamCardBase state="ready" props={props} />); expect(screen.getByText("ready")).toBeTruthy() }) })
