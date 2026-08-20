/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryFoundationCategoriesSwr } from "./useQueryFoundationCategoriesSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-foundation-categories", () => ({ queryFoundationCategories: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { m.query.mockReset(); m.query.mockResolvedValue({ data: { foundationCategories: { data: { count: 0, data: [] } } } }) })
describe("useQueryFoundationCategoriesSwr", () => {
    it("uses defaults and omits an empty search", async () => { const { result } = renderHook(() => useQueryFoundationCategoriesSwr(), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ count: 0, data: [] })); expect(m.query).toHaveBeenCalledWith({ request: { search: undefined, pageNumber: 1, limit: 24 } }) })
    it("passes search and paging", async () => { const { result } = renderHook(() => useQueryFoundationCategoriesSwr({ search: "web", pageNumber: 2, limit: 5 }), { wrapper }); await waitFor(() => expect(result.current.data).toBeTruthy()); expect(m.query).toHaveBeenCalledWith({ request: { search: "web", pageNumber: 2, limit: 5 } }) })
})
