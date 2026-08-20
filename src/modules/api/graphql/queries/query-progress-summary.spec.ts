import { beforeEach, describe, expect, it, vi } from "vitest"
import { print } from "graphql"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryProgressSummary } from "./query-progress-summary"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryProgressSummary", () => {
    it("uses authentication and requests the exact learning totals", async () => {
        await queryProgressSummary()
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        const document = print(mocks.query.mock.calls[0][0].query)
        expect(document).toContain("progressSummary")
        expect(document).toContain("xpForNextLevel")
        expect(document).not.toContain("username")
    })
})
