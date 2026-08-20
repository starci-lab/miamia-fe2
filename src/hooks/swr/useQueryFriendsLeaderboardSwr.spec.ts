/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryFriendsLeaderboardSwr } from "./useQueryFriendsLeaderboardSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-friends-leaderboard", () => ({ queryFriendsLeaderboard: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { setSessionToken("viewer"); m.query.mockReset(); m.query.mockResolvedValue({ data: { friendsLeaderboard: { data: [{ id: "friend" }] } } }) })
describe("useQueryFriendsLeaderboardSwr", () => {
    it("does not fetch when disabled", () => { const { result } = renderHook(() => useQueryFriendsLeaderboardSwr(false), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("reads the enabled viewer leaderboard", async () => { const { result } = renderHook(() => useQueryFriendsLeaderboardSwr(), { wrapper }); await waitFor(() => expect(result.current.data).toEqual([{ id: "friend" }])); expect(m.query).toHaveBeenCalledWith() })
})
