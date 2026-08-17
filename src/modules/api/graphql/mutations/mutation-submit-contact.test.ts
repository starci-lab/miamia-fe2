import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ mutate: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { mutationSubmitContact } from "./mutation-submit-contact"
beforeEach(() => { mocks.mutate.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ mutate: mocks.mutate }) })
describe("mutationSubmitContact", () => {
    it("fixes the anonymous inquiry category to partnership", async () => {
        await mutationSubmitContact({ name: "Mia Center", email: "hello@example.com", message: "White-label for our learners" })
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: false })
        expect(mocks.mutate.mock.calls[0][0].variables.request).toEqual({ name: "Mia Center", email: "hello@example.com", message: "White-label for our learners", category: "partnership" })
    })
})

