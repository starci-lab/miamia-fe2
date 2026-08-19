import type { ComponentType } from "react"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"

type StudyHomePageProps = { readonly continueSurface: ComponentType; readonly progressSurface: ComponentType }

/** Keeps resume before progress in the Study landing reading order. */
export const StudyHomePageBase = ({ continueSurface, progressSurface }: StudyHomePageProps) => <Tree contract="study-home-grid" render={defineContractComponent("study-home-grid", {
    resume: defineContractProjection("study-resume-hero", () => {
        const ContinueSurface = continueSurface
        return <ContinueSurface />
    }),
    progress: defineContractProjection("study-progress-card", () => {
        const ProgressSurface = progressSurface
        return <ProgressSurface />
    }),
})} />

/** Declares the pure Study landing page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
