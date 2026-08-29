import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** Surface mounted by the catalogue page owner. */
export type ExamCatalogPageProps = { readonly surface: ComponentType }
/** Own the document main landmark around the catalogue block. */
export const ExamCatalogPageBase = ({ surface: Surface }: ExamCatalogPageProps) => <Grammar layout="routed-page-main" render={layoutNode("routed-page-main", {
    page: renderLeaf("page", {}, () => <Surface />),
})} />
/** Source-level page marker. */
