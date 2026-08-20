/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryCodingProblemSwr } from "./useQueryCodingProblemSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-coding-problem", () => ({ queryCodingProblem: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { m.query.mockReset(); m.query.mockResolvedValue({ data: { codingProblem: { data: { slug: "two-sum" } } } }) })
describe("useQueryCodingProblemSwr", () => {
    it("does not fetch without slug", () => { const { result } = renderHook(() => useQueryCodingProblemSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("passes slug and unwraps the problem", async () => { const { result } = renderHook(() => useQueryCodingProblemSwr("two-sum"), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ slug: "two-sum" })); expect(m.query).toHaveBeenCalledWith({ request: { slug: "two-sum" } }) })
})
