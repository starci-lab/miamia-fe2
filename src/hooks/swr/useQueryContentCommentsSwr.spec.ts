/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import {
    QUERY_CONTENT_COMMENTS_SWR_KEY,
    useQueryContentCommentsSwr,
} from "./useQueryContentCommentsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-content-comments", () => ({ queryContentComments: mocks.query }))

const wrapper = ({ children }: PropsWithChildren) => createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0 } },
    children,
)
const page = { count: 1, data: [{ id: "comment-1", body: "Hello" }] }

beforeEach(() => {
    setSessionToken("comments-viewer")
    mocks.query.mockReset()
    mocks.query.mockResolvedValue({ data: { contentComments: { data: page } } })
})

describe("useQueryContentCommentsSwr", () => {
    it("publishes a stable cache prefix", () => {
        expect(QUERY_CONTENT_COMMENTS_SWR_KEY).toBe("QUERY_CONTENT_COMMENTS_SWR")
    })

    it("does not fetch before a content id or viewer exists", () => {
        const { result } = renderHook(() => useQueryContentCommentsSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })

    it("requests top-level comments with default paging", async () => {
        const { result } = renderHook(() => useQueryContentCommentsSwr({ contentId: "content" }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { contentId: "content", parentCommentId: null, page: 1, limit: 20 } })
    })

    it("keeps reply scope and caller paging in the request", async () => {
        const { result } = renderHook(() => useQueryContentCommentsSwr({
            contentId: "content",
            parentCommentId: "comment-1",
            page: 4,
            limit: 10,
        }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { contentId: "content", parentCommentId: "comment-1", page: 4, limit: 10 } })
    })

    it("returns null when the server omits the comments page", async () => {
        mocks.query.mockResolvedValue({ data: { contentComments: undefined } })
        const { result } = renderHook(() => useQueryContentCommentsSwr({ contentId: "content" }), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
