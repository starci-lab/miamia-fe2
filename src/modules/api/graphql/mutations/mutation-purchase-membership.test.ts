import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ mutate: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))

import { mutationPurchaseMembership } from "./mutation-purchase-membership"

beforeEach(() => {
    mocks.mutate.mockReset().mockResolvedValue({ data: undefined })
    mocks.createApolloClient.mockReset().mockReturnValue({ mutate: mocks.mutate })
})

describe("mutationPurchaseMembership", () => {
    it("keeps the PayOS return boundary in the request", async () => {
        const request = { paymentType: "payos" as const, payosReturnUrl: "https://miamia.test/return", payOSCancelUrl: "https://miamia.test/cancel" }
        await mutationPurchaseMembership(request)
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        expect(mocks.mutate.mock.calls[0][0].variables).toEqual({ request })
    })
})
