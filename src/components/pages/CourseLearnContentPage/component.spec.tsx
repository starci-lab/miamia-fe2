import { fireEvent, render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { CourseLearnContentPageBase, type CourseLearnContentPageData } from "./component"

const labels: CourseLearnContentPageData["labels"] = {
    navCourse: "Course",
    navModule: "Module",
    facesLabel: "Lesson faces",
    searchPlaceholder: "Search contents",
    searchLabel: "Search contents",
    searchClearLabel: "Clear search",
    outlineTitle: "On this page",
    pageLabel: "Page",
    previousLabel: "Previous",
    nextLabel: "Next",
    reactionsLabel: "Reactions",
    reactionPrompt: "Was this useful?",
    nextTitle: "Up next",
}

const discussion = {
    state: "ready" as const,
    props: {
        labels: {
            title: "Discussion",
            composerLabel: "Comment",
            placeholder: "Share a question",
            submit: "Post comment",
            submitting: "Posting",
            empty: "No comments yet.",
            failed: "Comments could not be loaded.",
            retry: "Try again",
        },
        draft: "A question",
        draftKey: 0,
        comments: [{ id: "comment-1", author: "Ada", meta: "Today", body: "Helpful context" }],
    },
}

describe("CourseLearnContentPageBase", () => {
    it("shows one selected mobile panel and keeps all three panels on desktop", () => {
        const props: CourseLearnContentPageData = {
            labels,
            title: "Current lesson",
            body: "Lesson body",
            modules: [{ id: "module-1", title: "Module one", isOpen: true }],
            outline: [{ id: "heading-1", label: "Heading" }],
        }
        const { container, rerender } = render(
            <CourseLearnContentPageBase state="ready" props={props} />,
        )

        expect(container.querySelector(".layout-name-content-map-panel")).not.toBeNull()
        expect(container.querySelector(".layout-name-learn-content-page")).not.toBeNull()
        expect(container.querySelector(".layout-name-content-outline-rail")).not.toBeNull()

        const cases = [
            ["contents", "content-map-panel"],
            ["lesson", "learn-content-page"],
            ["outline", "content-outline-rail"],
        ] as const
        for (const [mobileView, node] of cases) {
            rerender(
                <CourseLearnContentPageBase state="ready" props={{ ...props, mobileView }} />,
            )
            expect(container.firstElementChild?.className).toContain(`layout-name-${node}`)
            expect(container.querySelectorAll(".layout-name-content-map-panel")).toHaveLength(mobileView === "contents" ? 1 : 0)
            expect(container.querySelectorAll(".layout-name-learn-content-page")).toHaveLength(mobileView === "lesson" ? 1 : 0)
            expect(container.querySelectorAll(".layout-name-content-outline-rail")).toHaveLength(mobileView === "outline" ? 1 : 0)
        }
    })

    it("opens a module-map content through the page-owned action", () => {
        const openContent = vi.fn()
        render(
            <CourseLearnContentPageBase
                state="ready"
                props={{
                    labels,
                    title: "Current lesson",
                    body: "Lesson body",
                    modules: [{
                        id: "module-1",
                        title: "Module one",
                        isOpen: true,
                        contents: [
                            { id: "content-1", title: "Current lesson", isCurrent: true },
                            { id: "content-2", title: "Next lesson" },
                        ],
                    }],
                }}
                on={{ openContent }}
            />,
        )

        fireEvent.click(screen.getByText("Next lesson"))
        expect(openContent).toHaveBeenCalledWith("content-2")
    })

    it("routes both breadcrumb identities through named actions", () => {
        const goCourse = vi.fn()
        const goModule = vi.fn()
        render(
            <CourseLearnContentPageBase
                state="ready"
                props={{ labels, title: "Current lesson", body: "Lesson body" }}
                on={{ goCourse, goModule }}
            />,
        )

        fireEvent.click(screen.getByText("Course"))
        fireEvent.click(screen.getByText("Module"))
        expect(goCourse).toHaveBeenCalledTimes(1)
        expect(goModule).toHaveBeenCalledTimes(1)
    })

    it("offers the failed reader recovery action", () => {
        const act = vi.fn()
        render(
            <CourseLearnContentPageBase
                state="failed"
                props={{
                    labels,
                    noticeMessage: "Could not load lesson",
                    noticeActionLabel: "Retry",
                }}
                on={{ act }}
            />,
        )

        fireEvent.click(screen.getByText("Retry"))
        expect(act).toHaveBeenCalledTimes(1)
    })

    it("keeps the visible discussion inside the unlocked lesson footer", () => {
        const submitDiscussion = vi.fn()
        const { container } = render(
            <CourseLearnContentPageBase
                state="ready"
                props={{ labels, title: "Current lesson", body: "Lesson body", discussion }}
                on={{ submitDiscussion }}
            />,
        )

        expect(container.querySelector(".layout-name-content-reader-footer")).toBeTruthy()
        expect(container.querySelector(".layout-name-content-discussion-panel")).toBeTruthy()
        expect(screen.getByText("Helpful context")).toBeInTheDocument()
        fireEvent.click(screen.getByRole("button", { name: "Post comment" }))
        expect(submitDiscussion).toHaveBeenCalledTimes(1)
    })

    it("keeps a locked preview inside its paper and omits reading actions", () => {
        const { container } = render(<CourseLearnContentPageBase state="locked" props={{ labels, title: "Locked lesson", body: "Preview", noticeMessage: "Unlock this lesson" }} />)
        expect(screen.getByText("Unlock this lesson")).toBeInTheDocument()
        expect(container.querySelector(".layout-name-content-reader-footer")).toBeNull()
    })
})


describe("CourseLearnContentPageBase additional states", () => {
    it("draws a ready reader with tabs, footer, map and outline", () => {
        const markup = renderToStaticMarkup(<CourseLearnContentPageBase state="ready" props={{ labels, title: "Promises", faces: [{ id: "reading", label: "Read" }, { id: "challenge", label: "Challenge", locked: true }], languages: [{ id: "ts", label: "TypeScript" }, { id: "py", label: "Python" }], selectedFace: "reading", selectedLanguage: "ts", body: "## Hello\n\nRead this.", selectionHint: "Select text to explain", nextSteps: [{ id: "next", label: "Async" }], page: 1, totalPages: 2, courseProgress: { label: "Progress", value: 3, total: 5 }, modules: [{ id: "m1", title: "Module", isOpen: true, contents: [{ id: "c1", title: "Promises", isCurrent: true, isComplete: true }] }], outline: [{ id: "h", label: "Hello", isCurrent: true, depth: 2 }] }} />)
        expect(markup).toContain("Promises")
        expect(markup).toContain("Select text to explain")
        expect(markup).toContain("Async")
        expect(markup).toContain("Hello")
    })

    it("keeps locked content inside its paper and uses failure/mobile projections", () => {
        const locked = renderToStaticMarkup(<CourseLearnContentPageBase state="locked" props={{ labels, title: "Premium", body: "Preview", noticeMessage: "Unlock this lesson", noticeActionLabel: "Buy", nextSteps: [{ id: "n", label: "Next" }] }} />)
        expect(locked).toContain("Unlock this lesson")
        expect(locked).not.toContain("content-reader-footer")
        const failed = renderToStaticMarkup(<CourseLearnContentPageBase state="failed" props={{ labels, title: "Broken", noticeMessage: "Try again", noticeActionLabel: "Retry", outline: [{ id: "x", label: "Hidden" }] }} />)
        expect(failed).toContain("Try again")
        expect(renderToStaticMarkup(<CourseLearnContentPageBase state="pending" props={{ labels, title: "Lesson", body: "Text", mobileView: "contents" }} />)).toContain("Search contents")
        expect(renderToStaticMarkup(<CourseLearnContentPageBase state="ready" props={{ labels, title: "Lesson", body: "Text", mobileView: "outline", outline: [{ id: "o", label: "On page" }] }} />)).toContain("On page")
    })
})
