/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryProfileEvidenceSwr } from "./useQueryProfileEvidenceSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-profile-evidence", () => ({ queryProfileEvidence: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { m.query.mockReset(); m.query.mockResolvedValue({ id: "evidence" }) })
describe("useQueryProfileEvidenceSwr", () => {
    it("does not fetch without a profile", () => { const { result } = renderHook(() => useQueryProfileEvidenceSwr("activity", null), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("wraps activity requests and returns evidence", async () => { const { result } = renderHook(() => useQueryProfileEvidenceSwr("activity", "profile", { page: 1 }), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ id: "evidence" })); expect(m.query).toHaveBeenCalledWith("activity", { request: { userId: "profile", page: 1 } }) })
    it("uses the flat request for non-detail evidence", async () => { const { result } = renderHook(() => useQueryProfileEvidenceSwr("coding-skills", "profile"), { wrapper }); await waitFor(() => expect(result.current.data).toBeTruthy()); expect(m.query).toHaveBeenCalledWith("coding-skills", { userId: "profile" }) })
})
