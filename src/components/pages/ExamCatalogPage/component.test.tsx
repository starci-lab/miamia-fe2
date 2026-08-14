import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { _ExamCatalogPage } from "./component"

describe("_ExamCatalogPage", () => {
    it("mounts the connected catalogue surface without a second frame", () => {
        const Surface = () => <div>catalogue surface</div>
        render(<_ExamCatalogPage surface={Surface} />)
        expect(screen.getByText("catalogue surface")).toBeTruthy()
    })
})
