import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** Surface mounted by the session page owner. */
export type ExamSessionPageProps = { readonly surface: ComponentType }
/** Own the document main landmark around the exam runner. */
export const ExamSessionPageBase = ({ surface: Surface }: ExamSessionPageProps) => <Grammar layout="routed-page-main" render={layoutNode("routed-page-main", {
    page: renderLeaf("page", {}, () => <Surface />),
})} />
/** Source-level page marker. */
