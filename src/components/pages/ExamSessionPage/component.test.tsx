import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _ExamSessionPage } from "./component"

describe("_ExamSessionPage", () => {
    it("mounts the authenticated session surface without a second frame", () => {
        const Surface = () => <div>session surface</div>
        render(<_ExamSessionPage surface={Surface} />)
        expect(screen.getByText("session surface")).toBeTruthy()
    })
})
