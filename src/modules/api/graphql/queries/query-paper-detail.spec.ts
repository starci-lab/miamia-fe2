import { beforeEach, describe, expect, it, vi } from "vitest"
import { print } from "graphql"

const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))

import { queryPaperDetail } from "./query-paper-detail"

beforeEach(() => {
    mocks.query.mockReset().mockResolvedValue({ data: undefined })
    mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query })
})

describe("queryPaperDetail", () => {
    it("uses authentication and never asks for an answer key", async () => {
        await queryPaperDetail("de-thu-01")
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        expect(mocks.query.mock.calls[0][0].variables).toEqual({ slug: "de-thu-01" })
        const document = print(mocks.query.mock.calls[0][0].query)
        expect(document).toContain("paperDetail(slug: $slug)")
        expect(document).toContain("optionD")
        expect(document).not.toContain("correctAnswer")
    })
})
