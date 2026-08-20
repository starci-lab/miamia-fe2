/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryCourseQaCommentsSwr } from "./useQueryCourseQaCommentsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-course-qa-comments", () => ({ queryCourseQaComments: mocks.query }))

const wrapper = ({ children }: PropsWithChildren) => createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0 } },
    children,
)
const page = { count: 1, data: [{ id: "question-1", body: "How?" }] }

beforeEach(() => {
    setSessionToken("qa-viewer")
    mocks.query.mockReset()
    mocks.query.mockResolvedValue({ data: { contentComments: { data: page } } })
})

describe("useQueryCourseQaCommentsSwr", () => {
    it("does not request an unscoped discussion", () => {
        const { result } = renderHook(() => useQueryCourseQaCommentsSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })

    it("reads top-level course questions with default paging", async () => {
        const { result } = renderHook(() => useQueryCourseQaCommentsSwr({ courseId: "course" }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { courseId: "course", parentCommentId: null, page: 1, limit: 20 } })
    })

    it("reads direct replies with caller paging and without a course field", async () => {
        const { result } = renderHook(() => useQueryCourseQaCommentsSwr({
            courseId: "course",
            parentCommentId: "question-1",
            page: 3,
            limit: 5,
        }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { parentCommentId: "question-1", page: 3, limit: 5 } })
    })

    it("returns null when the server omits the comments page", async () => {
        mocks.query.mockResolvedValue({ data: { contentComments: undefined } })
        const { result } = renderHook(() => useQueryCourseQaCommentsSwr({ courseId: "course" }), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
