/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryFoundationsSwr } from "./useQueryFoundationsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-foundations", () => ({ queryFoundations: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const page = { count: 1, data: [{ id: "foundation-1", title: "Graphs" }] }

beforeEach(() => { mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { foundations: { data: page } } }) })

describe("useQueryFoundationsSwr", () => {
    it("does not fetch until category scope exists", () => {
        const { result } = renderHook(() => useQueryFoundationsSwr({}), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })
    it("uses defaults and omits an empty search", async () => {
        const { result } = renderHook(() => useQueryFoundationsSwr({ categoryId: "category" }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { categoryId: "category", filters: { pageNumber: 1, limit: 24, search: undefined, sorts: [{ by: "sortIndex", order: "ASC" }] } } })
    })
    it("passes search and paging overrides", async () => {
        const { result } = renderHook(() => useQueryFoundationsSwr({ categoryId: "category", search: "graph", pageNumber: 2, limit: 5 }), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(page))
        expect(mocks.query).toHaveBeenCalledWith({ request: { categoryId: "category", filters: { pageNumber: 2, limit: 5, search: "graph", sorts: [{ by: "sortIndex", order: "ASC" }] } } })
    })
})
