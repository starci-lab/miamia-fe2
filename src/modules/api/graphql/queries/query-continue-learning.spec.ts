import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ query: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { queryContinueLearning } from "./query-continue-learning"
beforeEach(() => { mocks.query.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ query: mocks.query }) })
describe("queryContinueLearning", () => { it("uses authentication for private resume data", async () => { await queryContinueLearning(); expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true }) }) })
