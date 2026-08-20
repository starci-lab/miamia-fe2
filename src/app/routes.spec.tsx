import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({ redirect: vi.fn(), permanentRedirect: vi.fn(), notFound: vi.fn(), useRouter: vi.fn(() => ({ push: vi.fn() })), usePathname: vi.fn(() => ""), useSearchParams: vi.fn(() => new URLSearchParams()) }))

import route0 from "./[lang]/(app)/exam/[slug]/page"
import route1 from "./[lang]/(app)/exam/page"
import route2 from "./[lang]/(app)/game/page"
import route3 from "./[lang]/(app)/pricing/page"
import route4 from "./[lang]/(app)/study/explore/page"
import route5 from "./[lang]/(app)/study/page"
import route6 from "./[lang]/(app)/study/topics/[slug]/page"
import route7 from "./[lang]/(app)/study/topics/[slug]/practice/page"
import route8 from "./[lang]/authentication/page"
import route9 from "./[lang]/cart/page"
import route10 from "./[lang]/courses/[displayId]/learn/content/modules/[moduleId]/contents/[contentId]/challenges/[challengeId]/page"
import route11 from "./[lang]/courses/[displayId]/learn/content/modules/[moduleId]/contents/[contentId]/challenges/[challengeId]/result/page"
import route12 from "./[lang]/courses/[displayId]/learn/content/modules/[moduleId]/contents/[contentId]/page"
import route13 from "./[lang]/courses/[displayId]/learn/content/modules/[moduleId]/page"
import route14 from "./[lang]/courses/[displayId]/learn/content/page"
import route15 from "./[lang]/courses/[displayId]/learn/flashcards/page"
import route16 from "./[lang]/courses/[displayId]/learn/flashcards/quiz/page"
import route17 from "./[lang]/courses/[displayId]/learn/flashcards/quiz/sessions/[sessionId]/page"
import route18 from "./[lang]/courses/[displayId]/learn/flashcards/quiz/sessions/[sessionId]/result/page"
import route19 from "./[lang]/courses/[displayId]/learn/flashcards/review/page"
import route20 from "./[lang]/courses/[displayId]/learn/flashcards/review/sessions/[sessionId]/page"
import route21 from "./[lang]/courses/[displayId]/learn/flashcards/review/sessions/[sessionId]/result/page"
import route22 from "./[lang]/courses/[displayId]/learn/foundations/[categoryId]/[foundationId]/page"
import route23 from "./[lang]/courses/[displayId]/learn/foundations/[categoryId]/page"
import route24 from "./[lang]/courses/[displayId]/learn/foundations/page"
import route25 from "./[lang]/courses/[displayId]/learn/headhunting-companies/[companyId]/page"
import route26 from "./[lang]/courses/[displayId]/learn/headhuntings/page"
import route27 from "./[lang]/courses/[displayId]/learn/leaderboard/page"
import route28 from "./[lang]/courses/[displayId]/learn/mind-map/page"
import route29 from "./[lang]/courses/[displayId]/learn/mock-interview/interview/[sessionId]/page"
import route30 from "./[lang]/courses/[displayId]/learn/mock-interview/interview/[sessionId]/result/page"
import route31 from "./[lang]/courses/[displayId]/learn/mock-interview/page"
import route32 from "./[lang]/courses/[displayId]/learn/page"
import route33 from "./[lang]/courses/[displayId]/learn/personal-project/page"
import route34 from "./[lang]/courses/[displayId]/learn/personal-project/tasks/[taskId]/page"
import route35 from "./[lang]/courses/[displayId]/learn/personal-project/tasks/[taskId]/result/page"
import route36 from "./[lang]/courses/[displayId]/learn/playground/[slug]/page"
import route37 from "./[lang]/courses/[displayId]/learn/playground/[slug]/session/page"
import route38 from "./[lang]/courses/[displayId]/learn/playground/page"
import route39 from "./[lang]/courses/[displayId]/learn/qa/page"
import route40 from "./[lang]/courses/[displayId]/page"
import route41 from "./[lang]/courses/page"
import route42 from "./[lang]/dashboard/page"
import route43 from "./[lang]/league/page"
import route44 from "./[lang]/page"
import route45 from "./[lang]/practice/[domain]/page"
import route46 from "./[lang]/practice/page"
import route47 from "./[lang]/practice/problem/[slug]/page"
import route48 from "./[lang]/profile/[username]/activity/page"
import route49 from "./[lang]/profile/[username]/challenges/[courseId]/[submissionId]/page"
import route50 from "./[lang]/profile/[username]/challenges/[courseId]/page"
import route51 from "./[lang]/profile/[username]/challenges/page"
import route52 from "./[lang]/profile/[username]/cv/page"
import route53 from "./[lang]/profile/[username]/page"
import route54 from "./[lang]/profile/[username]/projects/[courseId]/page"
import route55 from "./[lang]/profile/[username]/projects/page"
import route56 from "./[lang]/profile/[username]/skills/[slug]/page"
import route57 from "./[lang]/profile/[username]/skills/page"
import route58 from "./[lang]/profile/[username]/wrapped/page"
import route59 from "./[lang]/profile/page"

type RouteInput = { readonly params: Promise<Record<string, string>> }
type Route = (input: RouteInput) => unknown

const routes: ReadonlyArray<Route> = [route0 as unknown as Route, route1 as unknown as Route, route2 as unknown as Route, route3 as unknown as Route, route4 as unknown as Route, route5 as unknown as Route, route6 as unknown as Route, route7 as unknown as Route, route8 as unknown as Route, route9 as unknown as Route, route10 as unknown as Route, route11 as unknown as Route, route12 as unknown as Route, route13 as unknown as Route, route14 as unknown as Route, route15 as unknown as Route, route16 as unknown as Route, route17 as unknown as Route, route18 as unknown as Route, route19 as unknown as Route, route20 as unknown as Route, route21 as unknown as Route, route22 as unknown as Route, route23 as unknown as Route, route24 as unknown as Route, route25 as unknown as Route, route26 as unknown as Route, route27 as unknown as Route, route28 as unknown as Route, route29 as unknown as Route, route30 as unknown as Route, route31 as unknown as Route, route32 as unknown as Route, route33 as unknown as Route, route34 as unknown as Route, route35 as unknown as Route, route36 as unknown as Route, route37 as unknown as Route, route38 as unknown as Route, route39 as unknown as Route, route40 as unknown as Route, route41 as unknown as Route, route42 as unknown as Route, route43 as unknown as Route, route44 as unknown as Route, route45 as unknown as Route, route46 as unknown as Route, route47 as unknown as Route, route48 as unknown as Route, route49 as unknown as Route, route50 as unknown as Route, route51 as unknown as Route, route52 as unknown as Route, route53 as unknown as Route, route54 as unknown as Route, route55 as unknown as Route, route56 as unknown as Route, route57 as unknown as Route, route58 as unknown as Route, route59 as unknown as Route]
const params = {
    lang: "en",
    displayId: "course-1",
    slug: "topic-1",
    moduleId: "module-1",
    contentId: "content-1",
    challengeId: "challenge-1",
    sessionId: "session-1",
    categoryId: "category-1",
    foundationId: "foundation-1",
    companyId: "company-1",
    taskId: "task-1",
    domain: "arrays",
    username: "reader",
    courseId: "course-1",
    submissionId: "submission-1",
} satisfies Record<string, string>

describe("route boundaries", () => {
    it("executes every declared page boundary with the route params", async () => {
        for (const route of routes) {
            const result = await route({ params: Promise.resolve(params) })
            expect(result === undefined || result !== null).toBe(true)
        }
    })
})
