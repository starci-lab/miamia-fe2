import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ refresh: vi.fn(), token: vi.fn<() => string | undefined>(() => undefined), setToken: vi.fn() }))
vi.mock("@/modules/api/graphql/mutations/mutation-refresh-token", () => ({ mutationRefreshToken: mocks.refresh }))
vi.mock("./useSessionToken", () => ({ useSessionToken: mocks.token, setSessionToken: mocks.setToken }))
import { mutationRefreshToken } from "@/modules/api/graphql/mutations/mutation-refresh-token"
import { useSessionRefresh } from "./useSessionRefresh"
describe("useSessionRefresh", () => {
    beforeEach(() => { vi.mocked(mutationRefreshToken).mockReset(); mocks.token.mockReturnValue(undefined) })
    it("restores a token from a successful refresh", async () => { vi.mocked(mutationRefreshToken).mockResolvedValue({ data: { refreshToken: { success: true, data: { accessToken: "token" } } } } as never); const { result } = renderHook(() => useSessionRefresh()); await waitFor(() => expect(result.current.isRestoring).toBe(false)); expect(mutationRefreshToken).toHaveBeenCalledWith({ minValiditySeconds: 45 }) })
    it("settles restoration after a failed refresh", async () => { vi.mocked(mutationRefreshToken).mockRejectedValue(new Error("offline")); const { result } = renderHook(() => useSessionRefresh()); await waitFor(() => expect(result.current.isRestoring).toBe(false)); expect(result.current.isRestoring).toBe(false) })
    it("does not refresh when an access token already exists", async () => { mocks.token.mockReturnValue("invalid-token"); const { result } = renderHook(() => useSessionRefresh()); await waitFor(() => expect(result.current.isRestoring).toBe(false)); expect(mutationRefreshToken).not.toHaveBeenCalled() })
})
