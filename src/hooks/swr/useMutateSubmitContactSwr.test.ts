/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMutateSubmitContactSwr } from "./useMutateSubmitContactSwr"
const mocks = vi.hoisted(() => ({ mutationSubmitContact: vi.fn() }))
vi.mock("@/modules/api/graphql/mutations/mutation-submit-contact", () => ({ mutationSubmitContact: mocks.mutationSubmitContact }))
beforeEach(() => mocks.mutationSubmitContact.mockReset().mockResolvedValue({ data: { submitContact: { success: true } } }))
describe("useMutateSubmitContactSwr", () => {
    it("reuses the exact form payload when triggered", async () => {
        const input = { name: "Mia Center", email: "hello@example.com", message: "Need a branded learning app" }
        const { result } = renderHook(() => useMutateSubmitContactSwr())
        await act(async () => { await result.current.trigger(input) })
        expect(mocks.mutationSubmitContact).toHaveBeenCalledWith(input)
    })
})

