import { describe, expect, it, vi } from "vitest"
const mutate = vi.fn(); vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ mutate })) }))
import { mutationCompleteFlashcardSession } from "./mutation-complete-flashcard-session"
describe("complete flashcard session mutation", () => { it("forwards the durable session identity", async () => { mutate.mockResolvedValue({ data: { completeFlashcardQuizSession: { data: null } } }); await mutationCompleteFlashcardSession({ mode: "quiz", sessionId: "session-1", answers: [] }); expect(mutate.mock.calls[0][0].variables).toEqual({ request: { sessionId: "session-1", answers: [] } }) }) })
