/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
type SurfaceProps = { readonly isLoading?: boolean }
vi.mock("@/components/branches/SurfaceListCard", () => ({ SurfaceListCard: (p: SurfaceProps) => <output>{p.isLoading ? "loading" : "ready"}</output> })); import { WhoToFollowBase } from "./component"
const props = { label: "Follow", title: "Follow", users: [{ id: "u1", name: "Ada", followLabel: "Follow", followingLabel: "Following" }] }
describe("WhoToFollowBase", () => { it("hides settled absence", () => { const { container } = render(<WhoToFollowBase state="hidden" props={props} />); expect(container).toBeEmptyDOMElement() }); it("renders pending skeleton state", () => { render(<WhoToFollowBase state="pending" props={props} />); expect(screen.getByText("loading")).toBeTruthy() }); it("renders ready suggestions", () => { render(<WhoToFollowBase state="ready" props={props} />); expect(screen.getByText("ready")).toBeTruthy() }) })
