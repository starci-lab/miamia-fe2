/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryCodingProblemsSwr } from "./useQueryCodingProblemsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-coding-problems", () => ({ queryCodingProblems: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const page = { count: 1, data: [{ id: "problem-1", title: "Two Sum" }] }

beforeEach(() => { mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { codingProblems: { data: page } } }) })

describe("useQueryCodingProblemsSwr", () => {
    it("uses default paging inputs", async () => {
        const { result } = renderHook(() => useQueryCodingProblemsSwr(), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { filters: { domain: undefined, page: undefined, limit: undefined } } })
    })
    it("passes domain and paging filters", async () => {
        const { result } = renderHook(() => useQueryCodingProblemsSwr({ domain: "arrays", page: 2, limit: 10 }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { filters: { domain: "arrays", page: 2, limit: 10 } } })
    })
    it("returns null when the endpoint has no payload", async () => {
        mocks.query.mockResolvedValue({ data: { codingProblems: undefined } })
        const { result } = renderHook(() => useQueryCodingProblemsSwr(), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
