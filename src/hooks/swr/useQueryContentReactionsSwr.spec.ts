/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryContentReactionsSwr } from "./useQueryContentReactionsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-content-reactions", () => ({ queryContentReactions: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const summary = { total: 2, reactions: [{ type: "LIKE", count: 2 }] }

beforeEach(() => { setSessionToken("reaction-viewer"); mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { contentReactions: { data: summary } } }) })

describe("useQueryContentReactionsSwr", () => {
    it("does not fetch without content or viewer scope", () => {
        const { result } = renderHook(() => useQueryContentReactionsSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })
    it("requests the content reaction summary", async () => {
        const { result } = renderHook(() => useQueryContentReactionsSwr("content"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(summary))
        expect(mocks.query).toHaveBeenCalledWith({ request: { contentId: "content" } })
    })
    it("returns null when no summary exists", async () => {
        mocks.query.mockResolvedValue({ data: { contentReactions: undefined } })
        const { result } = renderHook(() => useQueryContentReactionsSwr("content"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
