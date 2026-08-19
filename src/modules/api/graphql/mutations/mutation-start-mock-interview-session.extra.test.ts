import { describe, expect, it, vi } from "vitest"
const mutate = vi.fn(); vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ mutate })) }))
import { mutationStartMockInterviewSession } from "./mutation-start-mock-interview-session"
describe("mock interview start mutation", () => { it("forwards optional session configuration", async () => { mutate.mockResolvedValue({ data: {} }); const request = { courseId: "c", level: "B2", mode: "practice", langs: ["en"], questionCount: 5, countsToReadiness: true }; await mutationStartMockInterviewSession(request); expect(mutate.mock.calls[0][0].variables).toEqual({ request }) }) })
