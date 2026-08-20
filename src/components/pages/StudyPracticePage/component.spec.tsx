import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StudyPracticePageBase } from "./component"
describe("StudyPracticePageBase", () => { it("mounts one persistent practice surface", () => { render(<StudyPracticePageBase surface={() => <>practice</>} />); expect(screen.getByText("practice")).toBeTruthy() }) })
