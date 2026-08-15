import type { ComponentType } from "react"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"

type StudyTopicPageProps = { readonly surface: ComponentType }
/** Owns the main landmark around one Study topic. */
export const _StudyTopicPage = ({ surface: Surface }: StudyTopicPageProps) => <Tree contract="routed-page-main" render={defineContractComponent("routed-page-main", { page: defineLeafComponent("page", {}, () => <Surface />) })} />
/** Declares the pure Study topic page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
