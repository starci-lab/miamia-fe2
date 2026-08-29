import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ query: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, reviews: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() }, push: vi.fn(), token: "token" as string | undefined }))
vi.mock("next-intl", () => ({ useLocale: () => "en", useTranslations: () => (key: string) => key }))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: m.push, replace: m.push }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: m.push }) }))
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => m.token }))
vi.mock("@/hooks/swr/useQueryCourseSwr", () => ({ useQueryCourseSwr: () => m.query }))
vi.mock("@/hooks", () => ({ useQueryCourseSwr: () => m.query, useQueryCourseReviewsSwr: () => m.reviews }))
type MockPageProps = { readonly state: string; readonly on?: Record<string, (...args: ReadonlyArray<unknown>) => unknown> }
vi.mock("./component", () => ({ CourseDetailPageBase: ({ state, on }: MockPageProps) => <><output data-testid="state">{state}</output><button onClick={on?.retry}>retry</button><button onClick={on?.act}>act</button><button onClick={on?.navigateHome}>home</button><button onClick={on?.navigateCourses}>courses</button><button onClick={() => on?.selectSection?.("overview")}>overview</button><button onClick={() => on?.selectSection?.("curriculum")}>curriculum</button><button onClick={() => on?.selectSection?.("reviews")}>reviews</button><button onClick={() => on?.selectSection?.("faq")}>faq</button></> }))
import { CourseDetailPage } from "./index"
const course = { id: "course", title: "Course", description: "Learn", originalPrice: 0, enrollmentCount: 0, pricingPhases: [], modules: [], valuePropositions: [], prerequisites: [], qnas: [] }
beforeEach(() => { vi.clearAllMocks(); m.query.data = undefined; m.query.error = undefined; m.reviews.data = undefined; m.reviews.error = undefined; m.token = "token"; HTMLElement.prototype.scrollIntoView = vi.fn() })
describe("CourseDetailPage route", () => {
    it("settles loading, failed and ready states", () => { const view = render(<CourseDetailPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("pending"); m.query.error = new Error("offline"); view.rerender(<CourseDetailPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("failed"); fireEvent.click(screen.getByText("retry")); expect(m.query.mutate).toHaveBeenCalledOnce(); m.query.error = undefined; m.query.data = null; view.rerender(<CourseDetailPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("not-found"); m.query.data = course; view.rerender(<CourseDetailPage displayId="course" />); expect(screen.getByTestId("state")).toHaveTextContent("ready") })
    it("renders a resolved course and wires navigation, section scrolling and enrolment", () => {
        m.query.data = { ...course, displayId: "course", description: "Learn", currentPhase: "early", originalPrice: 100000, pricingPhases: [{ id: "phase", phase: "early", price: 80000, slotAvailable: 3, orderIndex: 1 }], modules: [{ id: "module", title: "Module", orderIndex: 1, contentTier: "core", contents: [{ id: "content", minutesRead: 120, numChallenges: 2 }], previewContents: [{ id: "preview", text: "Preview", orderIndex: 1 }] }, { id: "module-2", title: "Module 2", orderIndex: 2, contentTier: "core", contents: [], previewContents: [] }], valuePropositions: [{ id: "value", text: "Build" , orderIndex: 1 }], prerequisites: [{ id: "prereq", text: "Basics", orderIndex: 1 }], qnas: [{ id: "faq", question: "Q", answer: "A", orderIndex: 1 }], isEnrolled: true }
        m.reviews.data = { averageScore: 4.5, total: 2, nodes: [{ id: "review", userId: "Ada", score: 5, body: "Great" }] }
        const sectionNodes = Array.from({ length: 5 }, () => { const node = document.createElement("div"); node.className = "layout-name-course-section"; node.scrollIntoView = vi.fn(); document.body.append(node); return node })
        render(<CourseDetailPage displayId="course" />)
        const hero = document.createElement("div"); hero.className = "layout-name-course-hero-heading"; hero.scrollIntoView = vi.fn(); document.body.append(hero)
        fireEvent.click(screen.getByText("act")); fireEvent.click(screen.getByText("home")); fireEvent.click(screen.getByText("courses")); fireEvent.click(screen.getByText("overview")); fireEvent.click(screen.getByText("curriculum")); fireEvent.click(screen.getByText("reviews")); fireEvent.click(screen.getByText("faq"))
        expect(m.push).toHaveBeenCalledWith("/courses/course/learn")
        expect(m.push).toHaveBeenCalledWith("/"); expect(m.push).toHaveBeenCalledWith("/courses")
        expect(sectionNodes.some((node) => vi.mocked(node.scrollIntoView).mock.calls.length > 0)).toBe(true)
        sectionNodes.forEach((node) => node.remove())
        hero.remove()
    })
})
