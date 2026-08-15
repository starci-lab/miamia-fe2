import { createElement, StrictMode, type ReactNode } from "react"; import { renderHook, waitFor } from "@testing-library/react"; import { describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ leave: vi.fn(), connect: vi.fn() }))
vi.mock("@/modules/games/colyseus/client", () => ({ GameClient: class { static classifyError = vi.fn(); connect = mocks.connect } }))
import { useGameSession } from "./useGameSession"
type StrictWrapperProps = { readonly children: ReactNode }
const stop = () => undefined
const connection = () => ({ onSnapshot: vi.fn(() => stop), onAnswerResult: vi.fn(() => stop), onError: vi.fn(() => stop), onLeave: vi.fn(() => stop), answer: vi.fn(), restart: vi.fn(), leave: mocks.leave })
describe("useGameSession", () => {
    it("leaves its one connection exactly once on unmount", async () => { mocks.leave.mockReset(); mocks.connect.mockReset(); mocks.connect.mockResolvedValue(connection()); const hook = renderHook(() => useGameSession({ game: "match_pairs", mode: "COUPLE", character: "MIA" }, "token")); await waitFor(() => expect(mocks.connect).toHaveBeenCalledOnce()); hook.unmount(); await waitFor(() => expect(mocks.leave).toHaveBeenCalledOnce()) })
    it("reuses the pending room reservation across the StrictMode probe", async () => { mocks.leave.mockReset(); mocks.connect.mockReset(); mocks.connect.mockResolvedValue(connection()); const wrapper = ({ children }: StrictWrapperProps) => createElement(StrictMode, null, children); const hook = renderHook(() => useGameSession({ game: "vocab_defense", mode: "COUPLE", character: "MAX", roomCode: "room" }, "token"), { wrapper }); await waitFor(() => expect(mocks.connect).toHaveBeenCalledOnce()); hook.unmount(); await waitFor(() => expect(mocks.leave).toHaveBeenCalledOnce()) })
})
