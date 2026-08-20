/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useQueryMyPaymentStatusSwr } from "./useQueryMyPaymentStatusSwr"

const mocks = vi.hoisted(() => ({ queryMyPaymentStatus: vi.fn() }))
vi.mock("@/modules/api/graphql/queries/query-my-payment-status", () => ({ queryMyPaymentStatus: mocks.queryMyPaymentStatus }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => mocks.queryMyPaymentStatus.mockReset().mockResolvedValue({ data: { myPaymentStatus: { success: true, message: "ok", data: { referenceId: "ref-1", status: "succeeded" } } } }))
describe("useQueryMyPaymentStatusSwr", () => {
    it("stays disabled without a reference", () => {
        renderHook(() => useQueryMyPaymentStatusSwr(), { wrapper })
        expect(mocks.queryMyPaymentStatus).not.toHaveBeenCalled()
    })
    it("unwraps persisted status for one reference", async () => {
        const { result } = renderHook(() => useQueryMyPaymentStatusSwr("ref-1"), { wrapper })
        await waitFor(() => expect(result.current.data?.status).toBe("succeeded"))
        expect(mocks.queryMyPaymentStatus).toHaveBeenCalledWith({ referenceId: "ref-1" })
    })
    it("surfaces a refused lookup instead of presenting it as pending", async () => {
        mocks.queryMyPaymentStatus.mockResolvedValue({ data: { myPaymentStatus: { success: false, message: "Not found" } } })
        const { result } = renderHook(() => useQueryMyPaymentStatusSwr("missing"), { wrapper })
        await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
        expect(result.current.data).toBeUndefined()
    })
})
