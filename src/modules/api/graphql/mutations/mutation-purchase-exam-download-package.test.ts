import { beforeEach, describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ mutate: vi.fn(), createApolloClient: vi.fn() }))
vi.mock("../clients/create-apollo-client", () => ({ createApolloClient: mocks.createApolloClient }))
import { mutationPurchaseExamDownloadPackage } from "./mutation-purchase-exam-download-package"
beforeEach(() => { mocks.mutate.mockReset().mockResolvedValue({ data: undefined }); mocks.createApolloClient.mockReset().mockReturnValue({ mutate: mocks.mutate }) })
describe("mutationPurchaseExamDownloadPackage", () => {
    it("sends the package and return boundary without a client amount", async () => {
        const request = { packageId: "commercial" as const, paymentType: "payos" as const, payosReturnUrl: "https://miamia.test/return", payosCancelUrl: "https://miamia.test/cancel" }
        await mutationPurchaseExamDownloadPackage(request)
        expect(mocks.createApolloClient).toHaveBeenCalledWith({ withAuth: true })
        expect(mocks.mutate.mock.calls[0][0].variables).toEqual({ request })
        expect(mocks.mutate.mock.calls[0][0].variables.request.amount).toBeUndefined()
    })
})

