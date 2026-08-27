import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

type StudyCatalogPageProps = { readonly surface: ComponentType }
/** Owns the main landmark around the Study catalogue. */
export const StudyCatalogPageBase = ({ surface: Surface }: StudyCatalogPageProps) => <Grammar contract="routed-page-main" render={createGrammarNode("routed-page-main", { page: createLeafNode("page", {}, () => <Surface />) })} />
/** Declares the pure Study catalogue page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
