import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ mutate: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { mutationRecordPractice } from "./mutation-record-practice"
beforeEach(() => { mocks.mutate.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ mutate: mocks.mutate }) })
describe("mutationRecordPractice", () => { it("submits one topic-linked batch through auth", async () => { const request = { topicSlug: "travel", results: [{ phraseId: "00000000-0000-0000-0000-000000000001", correct: true }] }; await mutationRecordPractice(request); expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true }); expect(mocks.mutate.mock.calls[0][0].variables).toEqual({ request }) }) })
