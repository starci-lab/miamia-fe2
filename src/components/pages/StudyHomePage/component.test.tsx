import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _StudyHomePage } from "./component"
describe("_StudyHomePage", () => { it("keeps resume before progress", () => { render(<_StudyHomePage continueSurface={() => <>resume</>} progressSurface={() => <>progress</>} />); const text = document.body.textContent ?? ""; expect(text.indexOf("resume")).toBeLessThan(text.indexOf("progress")) }) })
