import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ profile: { data: undefined as unknown, isLoading: true }, query: { data: undefined as unknown, error: undefined as unknown, isLoading: false }, push: vi.fn() }))
vi.mock("next/navigation", () => ({ useParams: () => ({ username: "ada", courseId: "course-1" }) }))
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/hooks/swr/useQueryUserProfileSwr", () => ({ useQueryUserProfileSwr: () => mocks.profile }))
vi.mock("@/hooks/swr/useQueryProfileEvidenceSwr", () => ({ useQueryProfileEvidenceSwr: () => mocks.query }))
type ChallengeStubProps = { readonly state: string; readonly courseTitle?: string; readonly query: string; readonly filterLabel: string; readonly rows: ReadonlyArray<{ readonly id: string; readonly title: string }>; readonly on: { readonly back: () => void; readonly search: (value: string) => void; readonly filter: () => void; readonly select: (id: string) => void } }
vi.mock("./component", () => ({ ProfileChallengeManagePageBase: (input: ChallengeStubProps) => <><output data-testid="state">{input.state}</output><output data-testid="rows">{input.rows.map((row) => row.title).join("|")}</output><output data-testid="filter">{input.filterLabel}</output><button onClick={() => input.on.search("two")}>search</button><button onClick={input.on.filter}>filter</button><button onClick={input.on.back}>back</button><button onClick={() => input.on.select("s1")}>select</button></> }))

import { ProfileChallengeManagePage } from "./index"

describe("ProfileChallengeManagePage connected filtering", () => {
    beforeEach(() => { vi.clearAllMocks(); mocks.profile.data = undefined; mocks.profile.isLoading = true; mocks.query.data = undefined; mocks.query.error = undefined; mocks.query.isLoading = false })

    it("resolves pending, error and filtered course evidence", async () => {
        const view = render(<ProfileChallengeManagePage />)
        expect(screen.getByTestId("state")).toHaveTextContent("pending")
        mocks.profile.data = { id: "u1" }; mocks.profile.isLoading = false; mocks.query.error = new Error("offline"); view.rerender(<ProfileChallengeManagePage />)
        await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("error"))
        mocks.query.error = undefined; mocks.query.data = [{ id: "s1", title: "Two pointers", courseGlobalId: "course-1", courseTitle: "Algorithms", difficulty: "easy", passedAt: "today" }, { id: "s2", title: "Graphs", courseSlug: "course-1", courseTitle: "Algorithms", difficulty: "hard", passedAt: "today" }, { id: "s3", title: "Other", courseGlobalId: "other", passedAt: "today" }]; view.rerender(<ProfileChallengeManagePage />)
        await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("ready"))
        expect(screen.getByTestId("rows")).toHaveTextContent("Two pointers|Graphs")
        fireEvent.click(screen.getByRole("button", { name: "search" })); expect(screen.getByTestId("rows")).toHaveTextContent("Two pointers")
        fireEvent.click(screen.getByRole("button", { name: "filter" })); expect(screen.getByTestId("filter")).toHaveTextContent("easy")
        fireEvent.click(screen.getByRole("button", { name: "select" })); fireEvent.click(screen.getByRole("button", { name: "back" }))
        expect(mocks.push).toHaveBeenCalledWith("/profile/ada/challenges/course-1/s1")
        expect(mocks.push).toHaveBeenCalledWith("/profile/ada/challenges")
    })
})
