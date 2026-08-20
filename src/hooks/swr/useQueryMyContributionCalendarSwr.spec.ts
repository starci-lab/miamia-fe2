/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryMyContributionCalendarSwr } from "./useQueryMyContributionCalendarSwr"

const mocks = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-my-contribution-calendar", () => ({ queryMyContributionCalendar: mocks.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
const calendar = [{ date: "2026-08-20", count: 3 }]

beforeEach(() => { setSessionToken("calendar-viewer"); mocks.query.mockReset(); mocks.query.mockResolvedValue({ data: { myContributionCalendar: { data: calendar } } }) })

describe("useQueryMyContributionCalendarSwr", () => {
    it("does not fetch while nobody is signed in", () => {
        setSessionToken(undefined)
        const { result } = renderHook(() => useQueryMyContributionCalendarSwr(), { wrapper })
        expect(result.current.data).toBeUndefined()
        expect(mocks.query).not.toHaveBeenCalled()
    })
    it("requests the current calendar when no year is selected", async () => {
        const { result } = renderHook(() => useQueryMyContributionCalendarSwr(), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(calendar))
        expect(mocks.query).toHaveBeenCalledWith({ request: undefined })
    })
    it("passes an explicit year and unwraps the days", async () => {
        const { result } = renderHook(() => useQueryMyContributionCalendarSwr(2025), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual(calendar))
        expect(mocks.query).toHaveBeenCalledWith({ request: { year: 2025 } })
    })
    it("returns an empty list for an absent response", async () => {
        mocks.query.mockResolvedValue({ data: { myContributionCalendar: undefined } })
        const { result } = renderHook(() => useQueryMyContributionCalendarSwr(), { wrapper })
        await waitFor(() => expect(result.current.data).toEqual([]))
    })
})
