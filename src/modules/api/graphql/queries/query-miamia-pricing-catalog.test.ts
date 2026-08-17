import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryMiaMiaPricingCatalog } from "./query-miamia-pricing-catalog"

beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryMiaMiaPricingCatalog", () => {
    it("uses the anonymous client and sends no user-controlled price", async () => {
        await queryMiaMiaPricingCatalog()
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: false })
        expect(mocks.query.mock.calls[0][0].variables).toBeUndefined()
    })
})

