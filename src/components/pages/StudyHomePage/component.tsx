import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createGrammarProjection } from "@/components/contracts/props"

type StudyHomePageProps = { readonly continueSurface: ComponentType; readonly progressSurface: ComponentType }

/** Keeps resume before progress in the Study landing reading order. */
export const StudyHomePageBase = ({ continueSurface: ContinueSurface, progressSurface: ProgressSurface }: StudyHomePageProps) => <Grammar contract="study-home-grid" render={createGrammarNode("study-home-grid", {
    resume: createGrammarProjection("study-resume-hero", () => <ContinueSurface />),
    progress: createGrammarProjection("study-progress-card", () => <ProgressSurface />),
})} />

/** Declares the pure Study landing page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
