import { beforeEach, describe, expect, it, vi } from "vitest"
import { print } from "graphql"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryLearnTopics } from "./query-learn-topics"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryLearnTopics", () => { it("uses the public client and requests catalogue fields", async () => { await queryLearnTopics(); expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: false }); expect(print(mocks.query.mock.calls[0][0].query)).toContain("phraseCount") }) })
