import { beforeEach, describe, expect, it, vi } from "vitest"
import { print } from "graphql"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryWrapped } from "./query-wrapped"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryWrapped", () => {
    it("sends the approved period through the authenticated contract", async () => {
        await queryWrapped("monthly")
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        expect(mocks.query.mock.calls[0][0].variables).toEqual({ period: "monthly" })
        const document = print(mocks.query.mock.calls[0][0].query)
        expect(document).toContain("wrapped(period: $period)")
        expect(document).toContain("hardestPhrase")
    })
})
