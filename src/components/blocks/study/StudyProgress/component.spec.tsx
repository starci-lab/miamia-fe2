import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StudyProgressBase } from "./component"
const props = { title: "Tiến độ", stats: [], levelTitle: "Cấp 1", levelPercent: 0, levelFact: "0/10 XP", notice: "Đăng nhập", actionLabel: "Đăng nhập" }
describe("StudyProgressBase", () => { it("shows an honest guest state", () => { render(<StudyProgressBase state="guest" props={props} />); expect(screen.getByRole("button", { name: "Đăng nhập" })).toBeTruthy() }) })
