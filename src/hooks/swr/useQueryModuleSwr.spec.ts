/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryModuleSwr } from "./useQueryModuleSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-module", () => ({ queryModule: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { setSessionToken("viewer"); m.query.mockReset(); m.query.mockResolvedValue({ data: { module: { data: { id: "module" } } } }) })
describe("useQueryModuleSwr", () => {
    it("does not fetch without id", () => { const { result } = renderHook(() => useQueryModuleSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("passes module id and unwraps the result", async () => { const { result } = renderHook(() => useQueryModuleSwr({ id: "module" }), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ id: "module" })); expect(m.query).toHaveBeenCalledWith({ request: { id: "module" } }) })
})
