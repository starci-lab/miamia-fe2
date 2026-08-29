import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

type StudyTopicPageProps = { readonly surface: ComponentType }
/** Owns the main landmark around one Study topic. */
export const StudyTopicPageBase = ({ surface: Surface }: StudyTopicPageProps) => <Grammar layout="routed-page-main" render={layoutNode("routed-page-main", { page: renderLeaf("page", {}, () => <Surface />) })} />
/** Declares the pure Study topic page. */
