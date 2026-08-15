import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ endpoint: "", create: vi.fn() }))
vi.mock("colyseus.js", () => ({ Client: class { constructor(endpoint: string) { mocks.endpoint = endpoint } create = mocks.create } }))
import { GameClient } from "./client"
describe("GameClient", () => { beforeEach(() => { mocks.create.mockReset(); mocks.create.mockResolvedValue({ roomId: "room", onMessage: vi.fn(), onError: Object.assign(vi.fn(), { remove: vi.fn() }), onLeave: Object.assign(vi.fn(), { remove: vi.fn() }), send: vi.fn(), leave: vi.fn() }) }); it("sends token, uppercase mode and character to the separate endpoint", async () => { const client = new GameClient("ws://localhost:2638"); await client.connect({ game: "match_pairs", mode: "COUPLE", character: "MIA" }, "token"); expect(mocks.endpoint).toBe("ws://localhost:2638"); expect(mocks.create).toHaveBeenCalledWith("match_pairs", { token: "token", mode: "COUPLE", character: "MIA" }) }) })
