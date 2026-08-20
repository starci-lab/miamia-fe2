import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const socket = { on: vi.fn(), off: vi.fn(), emit: vi.fn(), disconnect: vi.fn() }
vi.mock("socket.io-client", () => ({ io: vi.fn(() => socket) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: vi.fn(() => "token-1") }))
import { usePlaygroundSocketIo } from "./usePlaygroundSocketIo"

describe("usePlaygroundSocketIo", () => {
    beforeEach(() => { socket.on.mockReset(); socket.off.mockReset(); socket.emit.mockReset(); socket.disconnect.mockReset() })
    it("connects, subscribes and verifies the active session", () => {
        const { result } = renderHook(() => usePlaygroundSocketIo())
        const handlers = Object.fromEntries(socket.on.mock.calls.map(([event, handler]) => [event, handler]))
        act(() => { handlers.connect() })
        act(() => { result.current.subscribe("session-1"); result.current.verify() })
        expect(socket.emit).toHaveBeenCalledWith("browser:subscribe", { sessionId: "session-1" })
        expect(socket.emit).toHaveBeenCalledWith("verify:now", { sessionId: "session-1" })
    })
    it("deduplicates and sorts verified step indexes", () => {
        const { result } = renderHook(() => usePlaygroundSocketIo())
        const handlers = Object.fromEntries(socket.on.mock.calls.map(([event, handler]) => [event, handler]))
        act(() => { handlers["step:verified"]({ data: { stepIndex: 3 } }); handlers["step:verified"]({ data: { stepIndex: 1 } }); handlers["step:verified"]({ data: { stepIndex: 3 } }) })
        expect(result.current.verifiedStepIndex).toBe(3)
        expect(result.current.passedStepIndexes).toEqual([1, 3])
    })
    it("maps disconnect and agent connection events", () => {
        const { result } = renderHook(() => usePlaygroundSocketIo())
        const handlers = Object.fromEntries(socket.on.mock.calls.map(([event, handler]) => [event, handler]))
        act(() => { handlers["agent:connected"]({ connected: true }); handlers.disconnect() })
        expect(result.current.state).toBe("reconnecting")
        expect(result.current.agentConnected).toBe(false)
    })
})
