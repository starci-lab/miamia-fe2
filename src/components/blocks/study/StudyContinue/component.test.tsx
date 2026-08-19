import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StudyContinueBase } from "./component"
const props = { eyebrow: "Học tiếp", title: "Chủ đề", body: "Mô tả", actionLabel: "Tiếp tục", browseLabel: "Khám phá" }
describe("StudyContinueBase", () => { it("emits the response-backed resume intent", () => { const resume = vi.fn(); render(<StudyContinueBase state="ready" props={props} on={{ resume }} />); fireEvent.click(screen.getByRole("button", { name: "Tiếp tục" })); expect(resume).toHaveBeenCalledOnce() }) })
