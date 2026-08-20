import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StudyHomePageBase } from "./component"
describe("StudyHomePageBase", () => { it("keeps resume before progress", () => { render(<StudyHomePageBase continueSurface={() => <>resume</>} progressSurface={() => <>progress</>} />); const text = document.body.textContent ?? ""; expect(text.indexOf("resume")).toBeLessThan(text.indexOf("progress")) }) })
