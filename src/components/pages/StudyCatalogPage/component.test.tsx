import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _StudyCatalogPage } from "./component"
describe("_StudyCatalogPage", () => { it("mounts one catalogue surface", () => { render(<_StudyCatalogPage surface={() => <>catalogue</>} />); expect(screen.getByText("catalogue")).toBeTruthy() }) })
