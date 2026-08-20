/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryContentSwr } from "./useQueryContentSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-content", () => ({ queryContent: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { setSessionToken("viewer"); m.query.mockReset(); m.query.mockResolvedValue({ data: { content: { data: { id: "content" } } } }) })
describe("useQueryContentSwr", () => {
    it("does not fetch without id", () => { const { result } = renderHook(() => useQueryContentSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("passes id and unwraps content", async () => { const { result } = renderHook(() => useQueryContentSwr({ id: "content" }), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ id: "content" })); expect(m.query).toHaveBeenCalledWith({ request: { id: "content" } }) })
})
