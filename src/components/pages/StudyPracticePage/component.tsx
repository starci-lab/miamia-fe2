import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

type StudyPracticePageProps = { readonly surface: ComponentType }
/** Owns the main landmark around the persistent practice surface. */
export const StudyPracticePageBase = ({ surface: Surface }: StudyPracticePageProps) => <Grammar contract="routed-page-main" render={createGrammarNode("routed-page-main", { page: createLeafNode("page", {}, () => <Surface />) })} />
/** Declares the pure Study practice page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
