import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, layoutContent } from "@/modules/types/layout"

type StudyHomePageProps = { readonly continueSurface: ComponentType; readonly progressSurface: ComponentType }

/** Keeps resume before progress in the Study landing reading order. */
export const StudyHomePageBase = ({ continueSurface: ContinueSurface, progressSurface: ProgressSurface }: StudyHomePageProps) => <Grammar layout="study-home-grid" render={layoutNode("study-home-grid", {
    resume: layoutContent("study-resume-hero", () => <ContinueSurface />),
    progress: layoutContent("study-progress-card", () => <ProgressSurface />),
})} />

/** Declares the pure Study landing page. */
