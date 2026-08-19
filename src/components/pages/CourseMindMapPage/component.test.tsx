import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CourseMindMapPageBase, type CourseMindMapPageProps } from "./component"

const input = (): CourseMindMapPageProps => ({
    state: "ready",
    props: {
        title: "Concept map",
        description: "Course concepts",
        searchLabel: "Search concepts",
        searchPlaceholder: "Type a keyword",
        clearSearchLabel: "Clear search",
        emptyText: "No map",
        noResultsText: "No results",
        failedText: "Map failed",
        retryLabel: "Try again",
        openLabel: "Open content",
        graphFact: "0 connections",
        nodes: [{ id: "node-1", label: "Containers", left: 50, top: 50, canOpen: true }],
        selectedId: "node-1",
    },
    on: { search: vi.fn(), select: vi.fn(), openContent: vi.fn(), retry: vi.fn() },
})

describe("CourseMindMapPageBase", () => {
    it("forwards search, selection and real-content navigation actions", () => {
        const props = input()
        render(<CourseMindMapPageBase {...props} />)

        fireEvent.change(screen.getByRole("searchbox", { name: "Search concepts" }), { target: { value: "container" } })
        fireEvent.submit(screen.getByRole("search"))
        fireEvent.click(screen.getByRole("link", { name: "Containers" }))
        fireEvent.click(screen.getByRole("button", { name: "Open content" }))

        expect(props.on.search).toHaveBeenCalledWith("container")
        expect(props.on.select).toHaveBeenCalledWith("node-1")
        expect(props.on.openContent).toHaveBeenCalledWith("node-1")
    })
    it("draws failed, empty and no-result notices with a selected detail", () => {
        const props = { ...input(), state: "ready" as const, props: { ...input().props, nodes: [{ id: "node-1", label: "Containers", detail: "A useful detail", left: 50, top: 50, canOpen: false }] } }
        render(<CourseMindMapPageBase {...props} />); expect(screen.getByText("A useful detail")).toBeInTheDocument()
        const noResults = { ...input(), props: { ...input().props, nodes: [] } }; render(<CourseMindMapPageBase {...noResults} />); expect(screen.getByText("No results")).toBeInTheDocument()
        const empty = { ...input(), state: "empty" as const, props: { ...input().props, nodes: [] } }; render(<CourseMindMapPageBase {...empty} />); expect(screen.getByText("No map")).toBeInTheDocument()
        const failed = { ...input(), state: "failed" as const, props: { ...input().props, nodes: [] } }; render(<CourseMindMapPageBase {...failed} />); fireEvent.click(screen.getByRole("button", { name: "Try again" })); expect(failed.on.retry).toHaveBeenCalledOnce()
    })
})
