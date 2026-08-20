import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
    content: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    module: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    reactions: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    comments: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    react: { isMutating: false, trigger: vi.fn() },
    submit: { isMutating: false, trigger: vi.fn() },
    router: { push: vi.fn() },
}))
vi.mock("next-intl", () => ({ useLocale: () => "en", useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => mocks.router }))
vi.mock("@/hooks/swr/useQueryContentSwr", () => ({ useQueryContentSwr: () => mocks.content }))
vi.mock("@/hooks/swr/useQueryModuleSwr", () => ({ useQueryModuleSwr: () => mocks.module }))
vi.mock("@/hooks/swr/useQueryContentReactionsSwr", () => ({ useQueryContentReactionsSwr: () => mocks.reactions }))
vi.mock("@/hooks/swr/useMutateReactContentSwr", () => ({ useMutateReactContentSwr: () => mocks.react }))
vi.mock("@/hooks/swr/useQueryContentCommentsSwr", () => ({ useQueryContentCommentsSwr: () => mocks.comments }))
vi.mock("@/hooks/swr/useMutateSubmitContentCommentSwr", () => ({ useMutateSubmitContentCommentSwr: () => mocks.submit }))
vi.mock("@/components/layouts/LearnShellLayout", () => ({ useLearnMobileView: () => ({ view: "contents" }) }))
type ReaderActions = { readonly goCourse: () => void; readonly goModule: () => void; readonly changePage: (page: number) => void; readonly changeDiscussionDraft: (value: string) => void; readonly submitDiscussion: () => void; readonly retryDiscussion: () => void; readonly selectChallenge: () => void; readonly selectReaction: (type: "like") => void; readonly openContent: (id: string) => void; readonly act?: () => void }
type ReaderProps = { readonly state: string; readonly props: { readonly mobileView?: string; readonly title?: string; readonly noticeActionLabel?: string }; readonly on: ReaderActions }
vi.mock("@/components/pages/CourseLearnContentPage/component", () => ({ CourseLearnContentPageBase: (input: ReaderProps) => <><output data-testid="state">{input.state}</output><output data-testid="view">{input.props.mobileView}</output><output data-testid="title">{input.props.title}</output><button onClick={input.on.goCourse}>course</button><button onClick={input.on.goModule}>module</button><button onClick={() => input.on.changePage(2)}>page</button><button onClick={() => input.on.openContent("next")}>content</button><button onClick={input.on.selectChallenge}>challenge</button><button onClick={() => input.on.selectReaction("like")}>react</button><button onClick={() => input.on.changeDiscussionDraft("hello")}>draft</button><button onClick={input.on.submitDiscussion}>submit</button><button onClick={input.on.retryDiscussion}>retry-discussion</button><button onClick={input.on.act}>act</button></> }))
import { CourseLearnContentPage } from "@/components/pages/CourseLearnContentPage/index"

describe("CourseLearnContentPage callback branches", () => {
    beforeEach(() => {
        vi.clearAllMocks(); mocks.content.error = undefined; mocks.module.error = undefined; mocks.reactions.error = undefined; mocks.comments.error = undefined
        mocks.content.data = { id: "content", title: "Lesson", body: "## Intro\n### Detail", isPremium: false, module: { title: "Module" }, challenges: [{ id: "challenge", title: "Try", orderIndex: 1 }] }
        mocks.module.data = { id: "module", title: "Module", numContents: 2, contents: [{ id: "content", title: "Lesson", orderIndex: 1 }, { id: "next", title: "Next", orderIndex: 2 }] }
        mocks.reactions.data = { total: 1, myReaction: null }; mocks.comments.data = { comments: [{ id: "comment", author: { username: "Ada" }, createdAt: "2026-01-01T00:00:00Z", replyCount: 1, body: "Hello" }] }
        mocks.react.trigger.mockResolvedValue({ data: { reactToContent: { data: { total: 2, myReaction: "like" } } } }); mocks.submit.trigger.mockResolvedValue({ data: { createComment: { success: true } } })
        Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }) })
    })
    it("wires mobile view, content navigation, reaction and discussion actions", async () => {
        render(<CourseLearnContentPage displayId="course" moduleId="module" contentId="content" />)
        expect(screen.getByTestId("state")).toHaveTextContent("ready"); expect(screen.getByTestId("view")).toHaveTextContent("contents")
        fireEvent.click(screen.getByRole("button", { name: "course" })); fireEvent.click(screen.getByRole("button", { name: "module" })); fireEvent.click(screen.getByRole("button", { name: "page" })); fireEvent.click(screen.getByRole("button", { name: "content" })); fireEvent.click(screen.getByRole("button", { name: "challenge" })); fireEvent.click(screen.getByRole("button", { name: "react" }))
        expect(mocks.router.push).toHaveBeenCalledWith("/courses/course"); expect(mocks.router.push).toHaveBeenCalledWith("/courses/course/learn/content/modules/module"); expect(mocks.router.push).toHaveBeenCalledWith("/courses/course/learn/content/modules/module/contents/next"); expect(mocks.router.push).toHaveBeenCalledWith("/courses/course/learn/content/modules/module/contents/content/challenges/challenge")
        fireEvent.click(screen.getByRole("button", { name: "draft" })); fireEvent.click(screen.getByRole("button", { name: "submit" })); await waitFor(() => expect(mocks.submit.trigger).toHaveBeenCalledWith({ contentId: "content", parentCommentId: null, body: "hello" })); fireEvent.click(screen.getByRole("button", { name: "retry-discussion" })); expect(mocks.comments.mutate).toHaveBeenCalled(); await waitFor(() => expect(mocks.react.trigger).toHaveBeenCalledWith({ contentId: "content", type: "like" }))
    })
})
