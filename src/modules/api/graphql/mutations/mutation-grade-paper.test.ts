import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ mutate: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))

import { mutationGradePaper } from "./mutation-grade-paper"

beforeEach(() => {
    mocks.mutate.mockReset().mockResolvedValue({ data: undefined })
    mocks.createApolloClient.mockReset().mockReturnValue({ mutate: mocks.mutate })
})

describe("mutationGradePaper", () => {
    it("submits nullable answers through an authenticated client", async () => {
        const request = { paperSlug: "de-thu-01", answers: [{ questionId: "q1", selected: null, secondsSpent: null }] }
        await mutationGradePaper(request)
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        expect(mocks.mutate.mock.calls[0][0].variables).toEqual({ request })
    })
})
