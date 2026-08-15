import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryTopicDetail } from "./query-topic-detail"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryTopicDetail", () => { it("passes a public topic slug once", async () => { await queryTopicDetail("daily-life"); expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: false }); expect(mocks.query.mock.calls[0][0].variables).toEqual({ slug: "daily-life" }) }) })
