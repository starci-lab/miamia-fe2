import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StudyCatalogPageBase } from "./component"
describe("StudyCatalogPageBase", () => { it("mounts one catalogue surface", () => { render(<StudyCatalogPageBase surface={() => <>catalogue</>} />); expect(screen.getByText("catalogue")).toBeTruthy() }) })
