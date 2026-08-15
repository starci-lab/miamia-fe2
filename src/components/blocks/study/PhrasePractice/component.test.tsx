import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _PhrasePractice } from "./component"
const props = { title: "Luyện", position: "1/1", prompt: "làm thủ tục", questionLabel: "Chọn", options: [{ id: "p1", label: "check in" }], previousLabel: "Trước", nextLabel: "Tiếp", submitLabel: "Ghi kết quả", exitLabel: "Thoát", loading: "Tải", failed: "Lỗi", empty: "Trống", retry: "Thử", resultTitle: "Xong", resultStats: [], repeatLabel: "Lại", backLabel: "Về" }
describe("_PhrasePractice", () => { it("keeps answer selection and emits one submit intent", () => { const select = vi.fn(); const submit = vi.fn(); render(<_PhrasePractice state="answering" props={props} on={{ select, submit }} />); fireEvent.click(screen.getByText("check in")); fireEvent.click(screen.getByRole("button", { name: "Ghi kết quả" })); expect(select).toHaveBeenCalledWith("p1"); expect(submit).toHaveBeenCalledOnce() }) })
