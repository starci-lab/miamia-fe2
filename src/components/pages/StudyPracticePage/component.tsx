import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

type StudyPracticePageProps = { readonly surface: ComponentType }
/** Owns the main landmark around the persistent practice surface. */
export const StudyPracticePageBase = ({ surface: Surface }: StudyPracticePageProps) => <Grammar layout="routed-page-main" render={layoutNode("routed-page-main", { page: renderLeaf("page", {}, () => <Surface />) })} />
/** Declares the pure Study practice page. */
