import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ExamSessionPageBase } from "./component"

describe("ExamSessionPageBase", () => {
    it("mounts the authenticated session surface without a second frame", () => {
        const Surface = () => <div>session surface</div>
        render(<ExamSessionPageBase surface={Surface} />)
        expect(screen.getByText("session surface")).toBeTruthy()
    })
})
