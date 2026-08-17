import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryMyPaymentStatus } from "./query-my-payment-status"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryMyPaymentStatus", () => {
    it("looks up persisted owner state with a network-only authenticated query", async () => {
        await queryMyPaymentStatus({ referenceId: "ref-1" })
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        expect(mocks.query.mock.calls[0][0]).toMatchObject({ variables: { request: { referenceId: "ref-1" } }, fetchPolicy: "network-only" })
    })
})

