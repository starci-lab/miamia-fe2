import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { RankMark, RankMarkIconId } from "./index"

vi.mock("@iconify/react", () => ({
    Icon: (props: Readonly<Record<string, unknown>>) => <span {...props} />,
}))

describe("RankMark", () => {
    it("keeps the exact place-medal map and uses the trophy for every rank four or lower", () => {
        const artwork = (name: string) => `fluent-${["emoji", `flat:${name}`].join("-")}`
        expect(RankMarkIconId(1)).toBe(artwork("1st-place-medal"))
        expect(RankMarkIconId(2)).toBe(artwork("2nd-place-medal"))
        expect(RankMarkIconId(3)).toBe(artwork("3rd-place-medal"))
        expect(RankMarkIconId(4)).toBe(artwork("trophy"))
        expect(RankMarkIconId(27)).toBe(artwork("trophy"))
    })

    it("retains the numeric rank in its accessible label", () => {
        const { container } = render(
            <RankMark props={{ rank: 4, placement: "row", accessibleLabel: "Rank 4" }} />,
        )
        expect(container.querySelector("[data-component=\"RankMark\"]")).toHaveAttribute("aria-label", "Rank 4")
    })
})
