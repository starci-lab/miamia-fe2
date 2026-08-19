import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ExamCatalogPageBase } from "./component"

describe("ExamCatalogPageBase", () => {
    it("mounts the connected catalogue surface without a second frame", () => {
        const Surface = () => <div>catalogue surface</div>
        render(<ExamCatalogPageBase surface={Surface} />)
        expect(screen.getByText("catalogue surface")).toBeTruthy()
    })
})
