import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import type { ReactNode } from "react"
import type { CoursePricePreview } from "@/modules/api/graphql/queries/types/course-price-preview"

const mocks = vi.hoisted(() => ({ preview: { data: undefined as CoursePricePreview | null | undefined, isLoading: false }, requested: undefined as string | undefined, dismiss: vi.fn() }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "vi-VN" }))
vi.mock("@/hooks", () => ({ useQueryCoursePricePreviewSwr: (courseId: string | undefined) => { mocks.requested = courseId; return mocks.preview } }))
type OverlayStubProps = { readonly isOpen: boolean; readonly onDismiss: () => void; readonly render: { readonly project: () => ReactNode } }
vi.mock("./component", () => ({ CoursePriceOverlayBase: (input: OverlayStubProps) => <><output data-testid="open">{String(input.isOpen)}</output><button onClick={input.onDismiss}>dismiss</button>{input.render.project()}</> }))

import { CoursePriceOverlay } from "./index"

const price = (overrides: Partial<CoursePricePreview> = {}): CoursePricePreview => ({ originalPriceVnd: 1000000, phasePriceVnd: 800000, discountedPriceVnd: 600000, discountPercent: 40, discountReason: "both", enrolledCount: 2, currentPhase: "early", nextPhase: "standard", seatsRemainingInCurrentPhase: 3, nextPhasePriceVnd: 900000, ...overrides })

describe("CoursePriceOverlay connected price story", () => {
    it("renders unavailable and pending states only when opened", () => {
        mocks.preview.data = undefined; mocks.preview.isLoading = false
        expect(renderToStaticMarkup(<CoursePriceOverlay courseId="course-1" title="Course" isOpen={false} onDismiss={mocks.dismiss} />)).toContain("priceDetailGuest")
        expect(mocks.requested).toBeUndefined()
        mocks.preview.isLoading = true
        expect(renderToStaticMarkup(<CoursePriceOverlay courseId="course-1" title="Course" isOpen onDismiss={mocks.dismiss} />)).toContain("data-loading=\"true\"")
    })

    it("draws personal loyalty reason, seats and next-phase price", () => {
        mocks.preview.isLoading = false; mocks.preview.data = price()
        const markup = renderToStaticMarkup(<CoursePriceOverlay courseId="course-1" title="Course" isOpen onDismiss={mocks.dismiss} />)
        expect(markup).toContain("reasonBoth")
        expect(markup).toContain("seatsThenPrice")
        expect(markup).toContain("Course")
    })

    it("omits loyalty copy and uses next-phase copy when no seats are bounded", () => {
        mocks.preview.data = price({ discountedPriceVnd: 800000, discountReason: "none", seatsRemainingInCurrentPhase: null, nextPhasePriceVnd: 900000 })
        const markup = renderToStaticMarkup(<CoursePriceOverlay courseId="course-1" title="Course" isOpen onDismiss={mocks.dismiss} />)
        expect(markup).not.toContain("reasonNone")
        expect(markup).toContain("nextPhase")
    })
})
