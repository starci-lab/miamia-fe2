/** @vitest-environment jsdom */
import { createElement, type PropsWithChildren } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { setSessionToken } from "../auth/useSessionToken"
import { useQueryCoursePersonalProjectSwr } from "./useQueryCoursePersonalProjectSwr"
const m = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock("../../modules/api/graphql/queries/query-course-personal-project", () => ({ queryCoursePersonalProject: m.query }))
const wrapper = ({ children }: PropsWithChildren) => createElement(SWRConfig, { value: { provider: () => new Map(), dedupingInterval: 0 } }, children)
beforeEach(() => { setSessionToken("viewer"); m.query.mockReset(); m.query.mockResolvedValue({ id: "project" }) })
describe("useQueryCoursePersonalProjectSwr", () => {
    it("does not fetch without display id", () => { const { result } = renderHook(() => useQueryCoursePersonalProjectSwr(), { wrapper }); expect(result.current.data).toBeUndefined(); expect(m.query).not.toHaveBeenCalled() })
    it("reads the project by display id", async () => { const { result } = renderHook(() => useQueryCoursePersonalProjectSwr("course"), { wrapper }); await waitFor(() => expect(result.current.data).toEqual({ id: "project" })); expect(m.query).toHaveBeenCalledWith("course") })
})
