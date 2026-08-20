import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ params: { submission: "s1", attempt: "a1" }, content: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, module: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, attempts: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, feedbacks: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn() }))
vi.mock("next/navigation", () => ({ useSearchParams: () => ({ get: (key: string) => mocks.params[key as "submission" | "attempt"] ?? null }) }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryContentSwr", () => ({ useQueryContentSwr: () => mocks.content }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => mocks.course }))
vi.mock("@/hooks/swr/useQueryModuleSwr", () => ({ useQueryModuleSwr: () => mocks.module }))
vi.mock("@/hooks/swr/useQueryContentChallengeAttemptsSwr", () => ({ useQueryContentChallengeAttemptsSwr: () => mocks.attempts }))
vi.mock("@/hooks/swr/useQueryContentChallengeFeedbacksSwr", () => ({ useQueryContentChallengeFeedbacksSwr: () => mocks.feedbacks }))
type ResultStubProps = { readonly state: string; readonly props: { readonly title: string }; readonly on: { readonly reload: () => void; readonly retry: () => void; readonly next: () => void } }
vi.mock("@/components/pages/CourseLearnChallengeResultPage/component", () => ({ CourseLearnChallengeResultPageBase: (input: ResultStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="title">{input.props.title}</output><button onClick={input.on.reload}>reload</button><button onClick={input.on.retry}>retry</button><button onClick={input.on.next}>next</button></> }))
import { CourseLearnChallengeResultPage } from "@/components/pages/CourseLearnChallengeResultPage/index"

describe("CourseLearnChallengeResultPage states", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.params.submission = "s1"; mocks.params.attempt = "a1"; mocks.content.data = undefined; mocks.content.error = undefined; mocks.course.data = undefined; mocks.course.error = undefined; mocks.module.data = undefined; mocks.module.error = undefined; mocks.attempts.data = undefined; mocks.attempts.error = undefined; mocks.feedbacks.data = undefined; mocks.feedbacks.error = undefined })
    it("resolves pending, failed and ready attempt feedback", async () => {
        const view = render(<CourseLearnChallengeResultPage displayId="course" moduleId="module" contentId="content" challengeId="challenge" />); expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.params.submission = undefined as unknown as string; view.rerender(<CourseLearnChallengeResultPage displayId="course" moduleId="module" contentId="content" challengeId="challenge" />); expect(screen.getByTestId("state")).toHaveTextContent("failed")
        mocks.params.submission = "s1"; mocks.content.data = { challenges: [{ id: "challenge", displayId: "challenge", title: "Challenge", score: 10, submissions: [{ id: "s1", title: "Submission", description: "Done", score: 10 }] }] }; mocks.course.data = { id: "course" }; mocks.module.data = { contents: [{ id: "content", orderIndex: 0 }, { id: "next", orderIndex: 1 }] }; mocks.attempts.data = [{ id: "a1", processedAt: "today", score: 9, shortFeedback: "Good" }]; mocks.feedbacks.data = [{ id: "f", sortIndex: 0, message: "Strong", severity: "Strong" }]; view.rerender(<CourseLearnChallengeResultPage displayId="course" moduleId="module" contentId="content" challengeId="challenge" />); await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready")); expect(screen.getByTestId("title")).toHaveTextContent("Submission"); fireEvent.click(screen.getByRole("button", { name: "reload" })); fireEvent.click(screen.getByRole("button", { name: "retry" })); fireEvent.click(screen.getByRole("button", { name: "next" })); expect(mocks.content.mutate).toHaveBeenCalled(); expect(mocks.push).toHaveBeenCalled()
    })
})
