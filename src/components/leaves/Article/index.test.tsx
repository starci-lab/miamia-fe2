import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Article } from "./index"

describe("Article markdown leaf", () => {
    it("renders the supported markdown block and inline vocabulary", () => {
        const body = [
            "## Section",
            "### Subsection",
            "A **strong** and *emphasis* word with `code` and [link](https://example.test).  ",
            "next line.",
            "> A quoted paragraph",
            "",
            "1. Ordered item",
            "2. Second item",
            "",
            "- Unordered item",
            "",
            "```ts",
            "const value = 1",
            "```",
        ].join("\n")
        const markup = renderToStaticMarkup(<Article props={{ body }} />)
        expect(markup).toContain("Section")
        expect(markup).toContain("strong")
        expect(markup).toContain("https://example.test")
        expect(markup).toContain("A quoted paragraph")
        expect(markup).toContain("const value = 1")
        expect(markup).toContain("list-disc")
    })

    it("draws deterministic resting lines while body data is absent or loading", () => {
        const absent = renderToStaticMarkup(<Article props={{}} />)
        const loading = renderToStaticMarkup(<Article props={{ body: "## Hidden" }} isLoading />)
        expect(absent).toContain("data-resting=\"true\"")
        expect(loading).toContain("data-resting=\"true\"")
        expect(loading).not.toContain("Hidden")
    })
})
