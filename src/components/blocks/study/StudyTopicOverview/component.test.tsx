import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _StudyTopicOverview } from "./component"
const props = { title: "Du lịch", description: "B1", backLabel: "Quay lại", startLabel: "Luyện", loading: "Tải", failed: "Lỗi", empty: "Trống", retry: "Thử", phrases: [{ id: "1", phrase: "check in", meaning: "làm thủ tục" }] }
describe("_StudyTopicOverview", () => { it("renders response-backed phrases", () => { render(<_StudyTopicOverview state="ready" props={props} />); expect(screen.getByText("check in")).toBeTruthy(); expect(screen.getByText("làm thủ tục")).toBeTruthy() }) })
