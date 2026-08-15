import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _StudyPracticePage } from "./component"
describe("_StudyPracticePage", () => { it("mounts one persistent practice surface", () => { render(<_StudyPracticePage surface={() => <>practice</>} />); expect(screen.getByText("practice")).toBeTruthy() }) })
