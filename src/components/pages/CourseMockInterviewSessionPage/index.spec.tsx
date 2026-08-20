type TestPageInput = { state: string; on: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ locale: "en", course: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, session: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, attempt: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, sync: { isMutating: false, trigger: vi.fn().mockResolvedValue({ data: { syncMockInterviewSessionTurns: { success: true } } }) }, grade: { isMutating: false, trigger: vi.fn().mockResolvedValue({ data: { gradeMockInterviewSession: { success: true, data: {} } } }) }, router: { push: vi.fn(), replace: vi.fn() }, socket: { isConnected: true, isStreaming: false, state: "connected", ask: vi.fn(), abort: vi.fn() } }))
vi.mock("next-intl", () => ({ useLocale: () => m.locale }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => m.router }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => m.course }))
vi.mock("@/hooks/swr/useQueryMyInProgressMockInterviewSessionSwr", () => ({ useQueryMyInProgressMockInterviewSessionSwr: () => m.session }))
vi.mock("@/hooks/swr/useQueryMockInterviewAttemptBySessionSwr", () => ({ useQueryMockInterviewAttemptBySessionSwr: () => m.attempt }))
vi.mock("@/hooks/swr/useMutateSyncMockInterviewSessionTurnsSwr", () => ({ useMutateSyncMockInterviewSessionTurnsSwr: () => m.sync }))
vi.mock("@/hooks/swr/useMutateGradeMockInterviewSessionSwr", () => ({ useMutateGradeMockInterviewSessionSwr: () => m.grade }))
vi.mock("@/hooks/socketio/useMockInterviewSocketIo", () => ({ useMockInterviewSocketIo: () => m.socket }))
vi.mock("./component", () => ({ CourseMockInterviewSessionPageBase: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><button onClick={() => on.answer("candidate answer")}>answer</button><button onClick={on.ask}>ask</button><button onClick={on.retry}>retry</button><button onClick={on.leave}>leave</button><button onClick={on.abort}>abort</button><button onClick={on.finish}>finish</button></> }))
import { CourseMockInterviewSessionPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); m.locale = "en"; m.course.data = undefined; m.course.error = undefined; m.session.data = undefined; m.session.error = undefined; m.attempt.data = undefined; m.attempt.error = undefined; m.sync.isMutating = false; m.grade.isMutating = false; m.socket.isConnected = true; m.socket.isStreaming = false; m.socket.state = "connected"; m.sync.trigger.mockResolvedValue({ data: { syncMockInterviewSessionTurns: { success: true } } }); m.grade.trigger.mockResolvedValue({ data: { gradeMockInterviewSession: { success: true, data: {} } } }) })
describe("CourseMockInterviewSessionPage route", () => {
    it("reports connecting and failed restoration states", () => { const view = render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); expect(screen.getByTestId("state")).toHaveTextContent("connecting"); m.course.error = new Error("offline"); view.rerender(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); expect(screen.getByTestId("state")).toHaveTextContent("failed") })
    it("retries, aborts and leaves through route actions", () => { render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); fireEvent.click(screen.getByText("retry")); fireEvent.click(screen.getByText("abort")); fireEvent.click(screen.getByText("leave")); expect(m.course.mutate).toHaveBeenCalled(); expect(m.socket.abort).toHaveBeenCalled(); expect(m.router.push).toHaveBeenCalledWith("/courses/course/learn/mock-interview") })
    it("finishes a hydrated interview through the grading mutation", async () => { m.course.data = { id: "course" }; m.session.data = { sessionId: "s1", mode: "design", promptId: "p", promptTitle: "Interview", level: "B1", deadlineAt: new Date(Date.now() + 60000).toISOString(), source: "ai", phaseIndex: 0, questionIndex: 0, turns: [{ role: "interviewer", phase: "requirements", content: "Question" }], seedQuestions: [] }; m.attempt.data = null; m.grade.trigger.mockResolvedValue({ data: { gradeMockInterviewSession: { success: true, data: {} } } }); render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); fireEvent.click(screen.getByText("finish")); await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.grade.trigger).toHaveBeenCalled(); expect(m.router.replace).toHaveBeenCalled() })
    it("streams a design question, syncs the transcript and submits a candidate answer", async () => {
        m.course.data = { id: "course" }; m.attempt.data = null; m.session.data = { sessionId: "s1", mode: "design", promptId: "p", promptTitle: "Design", level: "B1", difficulty: "mid", deadlineAt: new Date(Date.now() + 60000).toISOString(), source: "ai", phaseIndex: 0, questionIndex: 0, updatedAt: new Date().toISOString(), turns: [], seedQuestions: [] }
        render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />)
        await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.socket.ask).toHaveBeenCalledOnce()
        const ask = m.socket.ask.mock.calls[0][0] as { onDelta: (delta: string) => void; onDone: (error?: string) => void }
        ask.onDelta("How would you scale it?"); ask.onDone(); await new Promise((resolve) => setTimeout(resolve, 0))
        fireEvent.click(screen.getByText("answer")); fireEvent.click(screen.getByText("ask")); fireEvent.click(screen.getByText("finish")); await new Promise((resolve) => setTimeout(resolve, 0))
        expect(m.sync.trigger).toHaveBeenCalled(); expect(m.grade.trigger).toHaveBeenCalled()
    })
    it("uses an interview-bank seed without opening the socket and handles sync failure", async () => {
        m.course.data = { id: "course" }; m.attempt.data = null; m.session.data = { sessionId: "s1", mode: "practice", promptId: "p", promptTitle: "Bank", level: null, difficulty: "easy", deadlineAt: new Date(Date.now() + 60000).toISOString(), source: "interview-bank", phaseIndex: 0, questionIndex: 0, updatedAt: new Date().toISOString(), turns: [], seedQuestions: [{ cardId: "card", kind: "system", title: "Explain queues", givenCodes: [{ lang: "ts", code: "queue" }] }] }
        m.sync.trigger.mockRejectedValue(new Error("offline"))
        render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />)
        await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.socket.ask).not.toHaveBeenCalled()
        fireEvent.click(screen.getByText("answer")); fireEvent.click(screen.getByText("ask")); await new Promise((resolve) => setTimeout(resolve, 0)); expect(screen.getByTestId("state")).toHaveTextContent("live")
    })
    it("classifies socket failures and auto-grades an expired session", async () => {
        m.course.data = { id: "course" }; m.attempt.data = null; m.session.data = { sessionId: "s1", mode: "design", promptId: "p", promptTitle: "Expired", level: "B1", difficulty: "mid", deadlineAt: new Date(Date.now() - 1000).toISOString(), source: "ai", phaseIndex: 0, questionIndex: 0, updatedAt: new Date().toISOString(), turns: [], seedQuestions: [] }
        render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />)
        await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.socket.abort).toHaveBeenCalled(); expect(m.grade.trigger).toHaveBeenCalled()
    })
    it("renders Vietnamese countdown copy and handles socket expiry/error plus grade failures", async () => {
        m.locale = "vi"; m.course.data = { id: "course" }; m.attempt.data = null; m.session.data = { sessionId: "s1", mode: "design", promptId: "p", promptTitle: "Design", level: "B1", difficulty: "mid", deadlineAt: new Date(Date.now() + 60000).toISOString(), source: "ai", phaseIndex: 0, questionIndex: 0, updatedAt: new Date().toISOString(), turns: [], seedQuestions: [] }
        m.grade.trigger.mockResolvedValue({ data: { gradeMockInterviewSession: { success: false, error: "NO_GRADE" } } })
        render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); await new Promise((resolve) => setTimeout(resolve, 0))
        const ask = m.socket.ask.mock.calls[0][0] as { onDone: (error?: string) => void }; ask.onDone("SESSION_EXPIRED"); ask.onDone("SOCKET_DOWN"); fireEvent.click(screen.getByText("finish")); await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.grade.trigger).toHaveBeenCalled()
    })
    it("advances a bank interview to its second seeded question", async () => {
        m.course.data = { id: "course" }; m.attempt.data = null; m.session.data = { sessionId: "s1", mode: "practice", promptId: "p", promptTitle: "Bank", level: "B1", difficulty: "easy", deadlineAt: new Date(Date.now() + 60000).toISOString(), source: "interview-bank", phaseIndex: 0, questionIndex: 0, updatedAt: new Date().toISOString(), turns: [], seedQuestions: [{ cardId: "one", kind: "system", title: "One", givenCodes: [] }, { cardId: "two", kind: "system", title: "Two", givenCodes: [] }] }
        render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); await new Promise((resolve) => setTimeout(resolve, 0)); fireEvent.click(screen.getByText("answer")); fireEvent.click(screen.getByText("ask")); await new Promise((resolve) => setTimeout(resolve, 0)); expect(m.socket.ask).not.toHaveBeenCalled()
    })
    it("covers empty socket outcomes, reconnect guards, result restoration and grading errors", async () => {
        m.course.data = { id: "course" }; m.attempt.data = null; m.session.data = { sessionId: "s1", mode: "design", promptId: "p", promptTitle: "Design", level: "B1", difficulty: "mid", deadlineAt: new Date(Date.now() + 60000).toISOString(), source: "ai", phaseIndex: 0, questionIndex: 0, updatedAt: new Date().toISOString(), turns: [], seedQuestions: [] }
        m.socket.isConnected = false; m.grade.isMutating = true; m.socket.isStreaming = true; render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); await new Promise((resolve) => setTimeout(resolve, 0)); fireEvent.click(screen.getByText("ask")); fireEvent.click(screen.getAllByText("finish")[0])
        m.socket.isConnected = true; m.grade.isMutating = false; m.socket.isStreaming = false; m.grade.trigger.mockRejectedValue(new Error("offline")); const view = render(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); await new Promise((resolve) => setTimeout(resolve, 0)); const ask = m.socket.ask.mock.calls.at(-1)?.[0] as { onDone: (error?: string) => void }; ask.onDone("ABORTED"); ask.onDone(); fireEvent.click(screen.getAllByText("finish")[1]); await new Promise((resolve) => setTimeout(resolve, 0)); expect(view).toBeTruthy()
        m.session.data = null; m.attempt.data = { id: "attempt" }; view.rerender(<CourseMockInterviewSessionPage displayId="course" sessionId="s1" />); expect(m.router.replace).toHaveBeenCalled()
    })
})





