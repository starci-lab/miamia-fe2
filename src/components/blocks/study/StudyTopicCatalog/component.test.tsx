import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { _StudyTopicCatalog } from "./component"
const props = { title: "Chủ đề", description: "Mô tả", searchLabel: "Tìm", searchPlaceholder: "Tìm…", clearLabel: "Xóa", filterLabel: "Lọc", selectedLevel: "all", levels: [{ id: "all", label: "Tất cả" }], topics: [{ id: "1", slug: "travel", level: "B1", title: "Du lịch", body: "Đi xa", fact: "4 cụm từ", actionLabel: "Xem" }], empty: "Trống", filteredEmpty: "Không khớp", failed: "Lỗi", retry: "Thử lại" }
describe("_StudyTopicCatalog", () => { it("opens the selected real topic", () => { vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} }); const open = vi.fn(); render(<_StudyTopicCatalog state="ready" props={props} on={{ "open:1": open }} />); fireEvent.click(screen.getByRole("button", { name: "Xem" })); expect(open).toHaveBeenCalledOnce() }) })
