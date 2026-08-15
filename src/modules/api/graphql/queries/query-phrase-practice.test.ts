import { beforeEach, describe, expect, it, vi } from "vitest"
import { print } from "graphql"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryPhrasePractice } from "./query-phrase-practice"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryPhrasePractice", () => { it("keeps practice public and requests option identities", async () => { await queryPhrasePractice("travel"); expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: false }); expect(print(mocks.query.mock.calls[0][0].query)).toContain("promptPhraseId") }) })
