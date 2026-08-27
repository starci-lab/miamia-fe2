import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

/** Surface mounted by the catalogue page owner. */
export type ExamCatalogPageProps = { readonly surface: ComponentType }
/** Own the document main landmark around the catalogue block. */
export const ExamCatalogPageBase = ({ surface: Surface }: ExamCatalogPageProps) => <Grammar contract="routed-page-main" render={createGrammarNode("routed-page-main", {
    page: createLeafNode("page", {}, () => <Surface />),
})} />
/** Source-level page marker. */
export const meta = { shape: "page", world: "pure", domain: "exam" } as const
