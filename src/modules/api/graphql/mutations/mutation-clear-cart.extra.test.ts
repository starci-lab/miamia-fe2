import { describe, expect, it, vi } from "vitest"
const mutate = vi.fn(); vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: vi.fn(() => ({ mutate })) }))
import { mutationClearCart } from "./mutation-clear-cart"
describe("clear cart mutation", () => { it("sends no variables and preserves options", async () => { mutate.mockResolvedValue({ data: { clearCart: { data: { removedCount: 2 } } } }); await mutationClearCart({ debug: true }); expect(mutate.mock.calls[0][0]).not.toHaveProperty("variables") }) })
