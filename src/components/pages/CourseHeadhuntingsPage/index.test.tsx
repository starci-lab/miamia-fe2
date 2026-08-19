type TestPageInput = { state: string; on: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ locale: "en", data: undefined as unknown, error: undefined as unknown, mutate: vi.fn(), companies: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, suggestions: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, consultants: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn(), replace: vi.fn() }))
vi.mock("next-intl", () => ({ useLocale: () => m.locale, useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push, replace: m.replace }) }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => ({ data: m.data, error: m.error, mutate: m.mutate }) }))
vi.mock("@/hooks/swr/useQueryHeadhuntingCompaniesSwr", () => ({ useQueryHeadhuntingCompaniesSwr: () => m.companies }))
vi.mock("@/hooks/swr/useQueryHeadhuntingCompanySuggestionsSwr", () => ({ useQueryHeadhuntingCompanySuggestionsSwr: () => m.suggestions }))
vi.mock("@/hooks/swr/useQueryConsultantsSwr", () => ({ useQueryConsultantsSwr: () => m.consultants }))
vi.mock("./component", () => ({ _CourseHeadhuntingsPage: ({ state, on }: TestPageInput) => <><output data-testid="state">{state}</output><button onClick={on.course}>course</button><button onClick={() => on.search("alpha")}>search</button><button onClick={on.retry}>retry</button><button onClick={on["open:c1"]}>open-c1</button><button onClick={on["contact:consult-linkedin"]}>contact-linkedin</button></> }))
import { CourseHeadhuntingsPage } from "./index"
beforeEach(() => { vi.clearAllMocks(); window.open = vi.fn(); m.locale = "en"; m.data = undefined; m.error = undefined; m.companies.data = undefined; m.companies.error = undefined; m.suggestions.data = []; m.suggestions.error = undefined; m.consultants.data = undefined; m.consultants.error = undefined })
describe("CourseHeadhuntingsPage route", () => {
    it("renders pending, failed, empty and ready states with search and navigation", () => { const view = render(<CourseHeadhuntingsPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.data = { id: "course", title: "Course" }; m.companies.data = []; m.suggestions.data = []; m.consultants.data = { data: [] }; view.rerender(<CourseHeadhuntingsPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("empty"); m.companies.error = new Error("offline"); view.rerender(<CourseHeadhuntingsPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); m.companies.error = undefined; m.companies.data = [{ id: "c1", title: "Alpha Corp", description: "Team" }]; m.consultants.data = { data: [{ id: "consult-linkedin", fullName: "Lin", jobTitle: "Recruiter", description: null, cvScoreUnlockThreshold: 80, cvScore: 90, contactUnlocked: true, email: null, linkedinUrl: "https://linkedin.com/in/lin", phoneNumber: null, zaloNumber: null }] }; view.rerender(<CourseHeadhuntingsPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready"); fireEvent.click(screen.getByText("course")); fireEvent.click(screen.getByText("search")); fireEvent.click(screen.getByText("open-c1")); fireEvent.click(screen.getByText("contact-linkedin")); fireEvent.click(screen.getByText("retry")); expect(m.push).toHaveBeenCalledWith("/courses/course"); expect(m.push).toHaveBeenCalledWith("/courses/course/learn/headhunting-companies/c1"); expect(m.companies.mutate).toHaveBeenCalledOnce() })
    it("renders Vietnamese copy and locks consultants without contact data", () => { m.locale = "vi"; m.data = { id: "course", title: "Khóa học" }; m.companies.data = [{ id: "c1", title: "Alpha Corp", description: null }]; m.consultants.data = { data: [{ id: "locked", fullName: "Recruiter", jobTitle: null, description: "Desc", cvScoreUnlockThreshold: 90, cvScore: 40, contactUnlocked: false, email: null, linkedinUrl: null, phoneNumber: null, zaloNumber: null }] }; render(<CourseHeadhuntingsPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready") })
})





