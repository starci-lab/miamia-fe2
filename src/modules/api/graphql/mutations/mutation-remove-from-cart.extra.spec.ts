import { describe, expect, it, vi } from "vitest"
const mutate = vi.fn(); vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ mutate })) }))
import { mutationRemoveFromCart } from "./mutation-remove-from-cart"
describe("remove cart mutation", () => { it("targets one course line", async () => { mutate.mockResolvedValue({ data: {} }); await mutationRemoveFromCart({ courseId: "course-1" }); expect(mutate.mock.calls[0][0].variables).toEqual({ request: { courseId: "course-1" } }) }) })
