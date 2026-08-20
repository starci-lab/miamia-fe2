import { describe, expect, it, vi } from "vitest"
const mutate = vi.fn(); vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ mutate })) }))
import { mutationCreateCourseQuestion } from "./mutation-create-course-question"
describe("course question mutation", () => { it("keeps question text and course scope together", async () => { mutate.mockResolvedValue({ data: {} }); await mutationCreateCourseQuestion({ request: { courseId: "course-1", body: "How?" } }); expect(mutate.mock.calls[0][0].variables).toEqual({ request: { courseId: "course-1", body: "How?" } }) }) })
