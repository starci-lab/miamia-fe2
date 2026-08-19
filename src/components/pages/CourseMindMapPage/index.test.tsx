type TestPageInput = { state: string; on: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ data: undefined as unknown, error: undefined as unknown, mutate: vi.fn(), push: vi.fn(), replace: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => "en", useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push, replace: m.replace }) }))

vi.mock("@/hooks/swr/useQueryCourseMindMapSwr", () => ({ useQueryCourseMindMapSwr: () => ({ data: m.data, error: m.error, mutate: m.mutate }) }))
vi.mock("./component", () => ({ _CourseMindMapPage: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><button onClick={() => on.search("lesson")}>search</button><button onClick={() => on.select("lesson")}>select</button><button onClick={() => on.openContent("lesson")}>open</button><button onClick={() => on.openContent("course")}>open-course</button><button onClick={() => on.openContent("module")}>open-module</button><button onClick={() => on.openContent("milestone")}>open-milestone</button><button onClick={() => on.openContent("flashcard")}>open-flashcard</button><button onClick={() => on.openContent("interview")}>open-interview</button><button onClick={on.retry}>retry</button></> }))
import { CourseMindMapPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.data = undefined; m.error = undefined })
describe("CourseMindMapPage route", () => {
    it("renders loading then failed transport states", () => { const view = render(<CourseMindMapPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent(/pending|loading|connecting/); m.error = new Error("offline"); view.rerender(<CourseMindMapPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent(/failed|error/) })
    it("filters positioned nodes, selects the active node and opens its linked lesson", () => {
        m.data = {
            nodes: [
                { id: "course", position: { x: 0, y: 0 }, data: { label: "Overview", kind: "course", entityId: null, moduleId: null, displayId: null, desc: null, popularity: "popular", links: [] } },
                { id: "module", position: { x: 1, y: 1 }, data: { label: "Module", kind: "module", entityId: "module-1", moduleId: null, displayId: null, desc: null, popularity: null, links: [] } },
                { id: "milestone", position: { x: 2, y: 2 }, data: { label: "Milestone", kind: "milestone", entityId: null, moduleId: null, displayId: null, desc: null, popularity: null, links: [] } },
                { id: "flashcard", position: { x: 3, y: 3 }, data: { label: "Flashcards", kind: "flashcard", entityId: null, moduleId: null, displayId: null, desc: null, popularity: null, links: [] } },
                { id: "interview", position: { x: 4, y: 4 }, data: { label: "Interview", kind: "interview", entityId: null, moduleId: null, displayId: null, desc: null, popularity: null, links: [] } },
                { id: "lesson", position: { x: 10, y: 20 }, data: { label: "Lesson", kind: "unknown", entityId: "lesson-1", moduleId: "module-1", displayId: null, desc: "Distributed systems", popularity: null, links: [{ kind: "lesson", entityId: "lesson-1", moduleId: "module-1", displayId: null }] } },
                { id: "empty", position: { x: 20, y: 5 }, data: { label: "Other", kind: "unknown", entityId: null, moduleId: null, displayId: null, desc: null, popularity: null, links: [] } },
            ],
            edges: [{ id: "edge", source: "course", target: "lesson", type: null, animated: false }],
        }
        const view = render(<CourseMindMapPage displayId="course" />)
        expect(screen.getByTestId("state")).toHaveTextContent("ready")
        fireEvent.click(screen.getByText("search"))
        fireEvent.click(screen.getByText("select")); fireEvent.click(screen.getByText("open")); fireEvent.click(screen.getByText("retry"))
        expect(m.push).toHaveBeenCalledWith("/courses/course/learn/content/modules/module-1/contents/lesson-1")
        fireEvent.click(screen.getByText("open-course")); fireEvent.click(screen.getByText("open-module")); fireEvent.click(screen.getByText("open-milestone")); fireEvent.click(screen.getByText("open-flashcard")); fireEvent.click(screen.getByText("open-interview"))
        expect(m.push).toHaveBeenCalledWith("/courses/course/learn"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/content/modules/module-1"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/personal-project"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/flashcards/review"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/mock-interview")
        expect(m.mutate).toHaveBeenCalledOnce()
        view.rerender(<CourseMindMapPage displayId="course" />)
    })
    it("resolves an empty graph and clears a stale selection", () => {
        m.data = { nodes: [], edges: [] }
        const view = render(<CourseMindMapPage displayId="course" />)
        expect(screen.getByTestId("state")).toHaveTextContent("empty")
        fireEvent.click(screen.getByText("open"))
        expect(m.push).not.toHaveBeenCalled()
        m.data = { nodes: [{ id: "flash", position: { x: 1, y: 1 }, data: { label: "Flash", kind: "flashcard", entityId: null, moduleId: null, displayId: null, desc: null, popularity: null, links: [] } }], edges: [] }
        view.rerender(<CourseMindMapPage displayId="course" />)
        expect(screen.getByTestId("state")).toHaveTextContent("ready")
    })
})





