import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

type StudyTopicPageProps = { readonly surface: ComponentType }
/** Owns the main landmark around one Study topic. */
export const StudyTopicPageBase = ({ surface: Surface }: StudyTopicPageProps) => <Grammar contract="routed-page-main" render={createGrammarNode("routed-page-main", { page: createLeafNode("page", {}, () => <Surface />) })} />
/** Declares the pure Study topic page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
