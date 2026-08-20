import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StudyTopicPageBase } from "./component"
describe("StudyTopicPageBase", () => { it("mounts one topic surface", () => { render(<StudyTopicPageBase surface={() => <>topic</>} />); expect(screen.getByText("topic")).toBeTruthy() }) })
