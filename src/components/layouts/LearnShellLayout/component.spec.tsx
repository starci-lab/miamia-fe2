import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { LearnShellLayoutBase, type LearnShellLayoutData } from "./component"

const Surface = () => <div>Reader surface</div>

const spine: LearnShellLayoutData["spine"] = {
    lockedLabel: "Locked",
    groups: [{
        id: "path",
        label: "Path",
        rows: [{ id: "content", label: "Modules", icon: "course", isCurrent: true }],
    }],
}

describe("LearnShellLayoutBase", () => {
    it("keeps the course spine beside an ordinary routed surface", () => {
        const { container } = render(
            <LearnShellLayoutBase props={{ spine, isFullBleed: false }} surface={Surface} />,
        )

        expect(screen.getByText("Reader surface")).toBeTruthy()
        expect(container.querySelector("[data-node=learn-spine-column]")).not.toBeNull()
    })

    it("removes course furniture for a focused full-bleed session", () => {
        const { container } = render(
            <LearnShellLayoutBase props={{ spine, isFullBleed: true }} surface={Surface} />,
        )

        expect(screen.getByText("Reader surface")).toBeTruthy()
        expect(container.querySelector("[data-node=learn-spine-column]")).toBeNull()
    })

    it("reports mobile view changes through the dedicated action", () => {
        const openMobileTab = vi.fn()
        render(
            <LearnShellLayoutBase
                props={{
                    spine,
                    isFullBleed: false,
                    mobileTabs: [
                        { id: "contents", label: "Contents", icon: "explore" },
                        { id: "lesson", label: "Lesson", icon: "course", isCurrent: true },
                        { id: "outline", label: "This page", icon: "blog" },
                    ],
                }}
                on={{ openMobileTab }}
                surface={Surface}
            />,
        )

        fireEvent.click(screen.getByText("Contents"))
        expect(openMobileTab).toHaveBeenCalledWith("contents")
    })
})
