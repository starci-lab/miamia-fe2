import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

type StudyCatalogPageProps = { readonly surface: ComponentType }
/** Owns the main landmark around the Study catalogue. */
export const StudyCatalogPageBase = ({ surface: Surface }: StudyCatalogPageProps) => <Grammar layout="routed-page-main" render={layoutNode("routed-page-main", { page: renderLeaf("page", {}, () => <Surface />) })} />
/** Declares the pure Study catalogue page. */
