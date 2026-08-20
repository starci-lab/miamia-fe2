/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryCourseLeaderboardSwr } from "./useQueryCourseLeaderboardSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-course-leaderboard", () => ({ queryCourseLeaderboard: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const leaderboard = { entries: [{ rank: 1, username: "ada", score: 100 }] }

beforeEach(() => { setSessionToken("leaderboard-viewer"); mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { courseLeaderboard: { data: leaderboard } } }) })

describe("useQueryCourseLeaderboardSwr", () => {
    it("does not fetch without course or viewer scope", () => {
        const { result } = renderHook(() => useQueryCourseLeaderboardSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })
    it("requests the first hundred leaderboard entries", async () => {
        const { result } = renderHook(() => useQueryCourseLeaderboardSwr("course"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(leaderboard))
        expect(mocks.query).toHaveBeenCalledWith({ request: { courseId: "course", limit: 100 } })
    })
    it("returns null when the endpoint omits leaderboard data", async () => {
        mocks.query.mockResolvedValue({ data: { courseLeaderboard: undefined } })
        const { result } = renderHook(() => useQueryCourseLeaderboardSwr("course"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
