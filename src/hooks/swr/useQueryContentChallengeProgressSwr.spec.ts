/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryContentChallengeProgressSwr } from "./useQueryContentChallengeProgressSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-content-challenge-progress", () => ({ queryContentChallengeProgress: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const progress = [{ contentId: "content-1", completed: true }]

beforeEach(() => { setSessionToken("progress-viewer"); mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { challengeSubmissionProgress: { data: { completionTasks: progress } } } }) })

describe("useQueryContentChallengeProgressSwr", () => {
    it("does not fetch for an unsigned or unscoped viewer", () => {
        const { result } = renderHook(() => useQueryContentChallengeProgressSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })
    it("requests one course and unwraps completion tasks", async () => {
        const { result } = renderHook(() => useQueryContentChallengeProgressSwr("course"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(progress))
        expect(mocks.query).toHaveBeenCalledWith({ request: { courseId: "course" } })
    })
    it("returns null when progress has no data body", async () => {
        mocks.query.mockResolvedValue({ data: { challengeSubmissionProgress: undefined } })
        const { result } = renderHook(() => useQueryContentChallengeProgressSwr("course"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
