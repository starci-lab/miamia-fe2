import type { ComponentType } from "react"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"

type StudyCatalogPageProps = { readonly surface: ComponentType }
/** Owns the main landmark around the Study catalogue. */
export const _StudyCatalogPage = ({ surface: Surface }: StudyCatalogPageProps) => <Tree contract="routed-page-main" render={defineContractComponent("routed-page-main", { page: defineLeafComponent("page", {}, () => <Surface />) })} />
/** Declares the pure Study catalogue page. */
export const meta = { shape: "page", world: "pure", domain: "study" } as const
