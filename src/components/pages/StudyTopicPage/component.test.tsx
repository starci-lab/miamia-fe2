import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _StudyTopicPage } from "./component"
describe("_StudyTopicPage", () => { it("mounts one topic surface", () => { render(<_StudyTopicPage surface={() => <>topic</>} />); expect(screen.getByText("topic")).toBeTruthy() }) })
