import type { ComponentType } from "react"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"

type StudyPracticePageProps = { readonly surface: ComponentType }
/** Owns the main landmark around the persistent practice surface. */
export const StudyPracticePageBase = ({ surface: Surface }: StudyPracticePageProps) => <Tree contract="routed-page-main" render={defineContractComponent("routed-page-main", { page: defineLeafComponent("page", {}, () => <Surface />) })} />
/** Declares the pure Study practice page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
