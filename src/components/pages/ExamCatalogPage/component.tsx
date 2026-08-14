import type { ComponentType } from "react"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"

/** Surface mounted by the catalogue page owner. */
export type ExamCatalogPageProps = { readonly surface: ComponentType }
/** Own the document main landmark around the catalogue block. */
export const _ExamCatalogPage = ({ surface: Surface }: ExamCatalogPageProps) => <Tree contract="routed-page-main" render={defineContractComponent("routed-page-main", {
    page: defineLeafComponent("page", {}, () => <Surface />),
})} />
/** Source-level page marker. */
export const meta = { shape: "page", world: "pure", domain: "exam" } as const
