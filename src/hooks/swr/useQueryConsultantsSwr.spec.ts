/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryConsultantsSwr } from "./useQueryConsultantsSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-consultants", () => ({ queryConsultants: mocks.query }))

const wrapper = ({ children }: PropsWithChildren) => createElement(
    SWRConfig,
    { value: { provider: () => new Map(), dedupingInterval: 0 } },
    children,
)
const consultants = { count: 1, data: [{ id: "consultant-1", name: "Ada" }] }

beforeEach(() => {
    setSessionToken("consultant-viewer")
    mocks.query.mockReset()
    mocks.query.mockResolvedValue({ data: { consultants: { data: consultants } } })
})

describe("useQueryConsultantsSwr", () => {
    it("does not request a company before its id or viewer exists", () => {
        const { result } = renderHook(() => useQueryConsultantsSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })

    it("uses the fixed page and sort for an unfiltered directory", async () => {
        const { result } = renderHook(() => useQueryConsultantsSwr("company"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(consultants))
        expect(mocks.query).toHaveBeenCalledWith({ request: {
            companyId: "company",
            filters: { pageNumber: 1, limit: 100, sorts: [{ by: "sortIndex", order: "ASC" }] },
        } })
    })

    it("includes a non-empty search in the request and cache scope", async () => {
        const { result } = renderHook(() => useQueryConsultantsSwr("company", "Ada"), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(consultants))
        expect(mocks.query).toHaveBeenCalledWith({ request: {
            companyId: "company",
            filters: { pageNumber: 1, limit: 100, search: "Ada", sorts: [{ by: "sortIndex", order: "ASC" }] },
        } })
    })

    it("returns null for an empty response envelope", async () => {
        mocks.query.mockResolvedValue({ data: { consultants: undefined } })
        const { result } = renderHook(() => useQueryConsultantsSwr("company"), { wrapper })
        await waitFor(() => expect(result.current.data).toBeNull())
    })
})
