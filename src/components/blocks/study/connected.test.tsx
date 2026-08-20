import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
    token: undefined as string | undefined,
    continueQuery: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
    progressQuery: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() },
}))

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => mocks.token }))
vi.mock("@/hooks", () => ({
    useQueryContinueLearningSwr: () => mocks.continueQuery,
    useQueryProgressSummarySwr: () => mocks.progressQuery,
}))
type ContinueStubProps = { readonly state: string; readonly on?: { readonly resume?: () => void; readonly browse?: () => void } }
vi.mock("./StudyContinue/component", () => ({
    StudyContinueBase: ({ state, on }: ContinueStubProps) => (
        <><output data-testid="continue-state">{state}</output><button onClick={on?.resume}>resume</button><button onClick={on?.browse}>browse</button></>
    ),
}))
type ProgressStubProps = { readonly state: string; readonly on?: { readonly retry?: () => void } }
vi.mock("./StudyProgress/component", () => ({
    StudyProgressBase: ({ state, on }: ProgressStubProps) => (
        <><output data-testid="progress-state">{state}</output><button onClick={on?.retry}>retry</button></>
    ),
}))

import { StudyContinue } from "./StudyContinue"
import { StudyProgress } from "./StudyProgress"

describe("connected Study blocks", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.token = undefined
        mocks.continueQuery.data = undefined
        mocks.continueQuery.error = undefined
        mocks.progressQuery.data = undefined
        mocks.progressQuery.error = undefined
    })

    it("keeps Continue empty for a guest, then exposes ready and failed journeys", async () => {
        const browse = vi.fn(); const resume = vi.fn()
        const view = render(<StudyContinue onBrowse={browse} onResumeTopic={resume} />)
        await waitFor(() => expect(screen.getByTestId("continue-state")).toHaveTextContent("empty"))
        mocks.token = "token"; mocks.continueQuery.data = { topic: { slug: "travel" } }
        view.rerender(<StudyContinue onBrowse={browse} onResumeTopic={resume} />)
        await waitFor(() => expect(screen.getByTestId("continue-state")).toHaveTextContent("ready"))
        fireEvent.click(screen.getByRole("button", { name: "resume" })); expect(resume).toHaveBeenCalledWith("travel")
        mocks.continueQuery.error = new Error("offline"); view.rerender(<StudyContinue onBrowse={browse} onResumeTopic={resume} />)
        await waitFor(() => expect(screen.getByTestId("continue-state")).toHaveTextContent("failed"))
    })

    it("separates progress guest, failed, loading and ready states", async () => {
        const view = render(<StudyProgress onBrowse={vi.fn()} onRequireSignIn={vi.fn()} />)
        await waitFor(() => expect(screen.getByTestId("progress-state")).toHaveTextContent("guest"))
        mocks.token = "token"; mocks.progressQuery.data = null
        view.rerender(<StudyProgress onBrowse={vi.fn()} onRequireSignIn={vi.fn()} />)
        await waitFor(() => expect(screen.getByTestId("progress-state")).toHaveTextContent("failed"))
        mocks.progressQuery.data = { currentStreak: 4, phrasesKnown: 10, attemptsCount: 3, level: 2, xpIntoLevel: 50, xpForNextLevel: 40 }
        mocks.progressQuery.error = undefined
        view.rerender(<StudyProgress onBrowse={vi.fn()} onRequireSignIn={vi.fn()} />)
        await waitFor(() => expect(screen.getByTestId("progress-state")).toHaveTextContent("ready"))
    })
})
