import { render, screen } from "@testing-library/react"; import { describe, expect, it, vi } from "vitest"
vi.mock("@/hooks/auth/useSessionToken", () => ({ useSessionToken: () => undefined })); vi.mock("@/hooks/swr/useQueryFriendsLeaderboardSwr", () => ({ useQueryFriendsLeaderboardSwr: () => ({ data: undefined }) }))
import { GameFriendStanding } from "./index"
describe("GameFriendStanding", () => { it("settles to the guest rivalry promise", () => { render(<GameFriendStanding onChooseGame={vi.fn()} onRequireSignIn={vi.fn()} />); expect(screen.getByText("Rủ bạn vào một phòng MiaMia")).toBeInTheDocument() }) })
