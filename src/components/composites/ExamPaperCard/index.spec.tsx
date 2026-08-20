import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ExamPaperCard } from "."

describe("ExamPaperCard", () => {
    it("keeps entitlement, facts and one honest action together", () => {
        const open = vi.fn()
        render(<ExamPaperCard props={{ id: "paper-1", title: "Đề số 1", level: "B2", questionCount: 40, levelLabel: "Trình độ", questionCountLabel: "Số câu", badgeLabel: "Premium", actionLabel: "Mở khóa", isLocked: true }} on={{ open }} />)
        expect(screen.getByText("Premium")).toBeTruthy()
        expect(screen.getByText("40")).toBeTruthy()
        fireEvent.click(screen.getByRole("button", { name: "Mở khóa" }))
        expect(open).toHaveBeenCalledOnce()
    })
})
