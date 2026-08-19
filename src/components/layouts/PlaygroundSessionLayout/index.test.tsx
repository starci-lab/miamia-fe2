import { render, screen, waitFor } from "@testing-library/react"
import type { ComponentType } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { usePlaygroundSession, PlaygroundSessionLayout } from "./index"

const m = vi.hoisted(() => ({ playground: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, start: { isMutating: false, trigger: vi.fn() }, socket: { state: "idle", agentConnected: false, verifiedStepIndex: null as number | null, passedStepIndexes: [] as ReadonlyArray<number>, subscribe: vi.fn(), verify: vi.fn() }, frame: undefined as unknown }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/swr/useQueryPlaygroundSwr", () => ({ useQueryPlaygroundSwr: () => m.playground }))
vi.mock("@/hooks/swr/useMutateStartPlaygroundSessionSwr", () => ({ useMutateStartPlaygroundSessionSwr: () => m.start }))
vi.mock("@/hooks/socketio/usePlaygroundSocketIo", () => ({ usePlaygroundSocketIo: () => m.socket }))
vi.mock("./component", () => ({ _PlaygroundSessionLayout: (input: unknown) => { m.frame = input; const frame = input as { surface: ComponentType; onRetry?: () => void }; const Surface = frame.surface; return <><Surface /><button onClick={frame.onRetry}>retry-frame</button></> } }))

const Probe = () => { const value = usePlaygroundSession(); return <><output data-testid="state">{value.isLoading ? "pending" : value.failed ? "failed" : value.session ? "session" : "ready"}</output><button onClick={() => void value.start()}>start</button><button onClick={value.verify}>verify</button><button onClick={value.retry}>retry-context</button></> }

beforeEach(() => { vi.clearAllMocks(); m.playground.data = undefined; m.playground.error = undefined; m.playground.mutate.mockResolvedValue(undefined); m.start.isMutating = false; m.start.trigger.mockResolvedValue({ data: { createPlaygroundSession: { data: { id: "session-1" } } } }); m.socket.state = "idle"; m.socket.agentConnected = false; m.socket.verifiedStepIndex = null; m.socket.passedStepIndexes = [] })

describe("PlaygroundSessionLayout connected owner", () => {
    it("keeps the context pending and retries both frame and owner query", () => { render(<PlaygroundSessionLayout displayId="course" slug="playground" surface={Probe} />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); screen.getByText("retry-frame").click(); screen.getByText("retry-context").click(); expect(m.playground.mutate).toHaveBeenCalledTimes(2) })
    it("starts a session, subscribes the relay and exposes verify", async () => {
        m.playground.data = { id: "playground-1", slug: "playground" }; m.socket.agentConnected = true; m.socket.verifiedStepIndex = 1; m.socket.passedStepIndexes = [0]
        render(<PlaygroundSessionLayout displayId="course" slug="playground" surface={Probe} />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); screen.getByText("verify").click(); screen.getByText("start").click(); await waitFor(() => expect(m.start.trigger).toHaveBeenCalledWith({ playgroundId: "playground-1", mode: "guided" })); expect(m.socket.subscribe).toHaveBeenCalledWith("session-1"); expect(screen.getByTestId("state")).toHaveTextContent("session"); expect(m.socket.verify).toHaveBeenCalledOnce()
    })
    it("reports null and thrown start responses as start failures", async () => {
        m.playground.data = { id: "playground-1" }; m.start.trigger.mockResolvedValueOnce({ data: { createPlaygroundSession: { data: null } } }).mockRejectedValueOnce(new Error("offline")); render(<PlaygroundSessionLayout displayId="course" slug="playground" surface={Probe} />); screen.getByText("start").click(); await waitFor(() => expect(m.start.trigger).toHaveBeenCalledOnce()); screen.getByText("start").click(); await waitFor(() => expect(m.start.trigger).toHaveBeenCalledTimes(2)); expect(m.socket.subscribe).not.toHaveBeenCalled()
    })
    it("renders a failed frame when the playground query errors", () => { m.playground.error = new Error("offline"); render(<PlaygroundSessionLayout displayId="course" slug="playground" surface={Probe} />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); expect(screen.getByText("retry-frame")).toBeInTheDocument() })
})
