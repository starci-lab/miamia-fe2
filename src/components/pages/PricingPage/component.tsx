import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { createGrammarNode, createGrammarProjection } from "@/components/contracts/props"

/** Page-owned catalog and optional return-status regions. */
export type PricingPageProps = { readonly catalog: ComponentType; readonly status?: ComponentType }
/** Renders the pricing route in its frozen screen-level order. */
export const PricingPageBase = ({ catalog: Catalog, status: Status }: PricingPageProps) => <Grammar contract="pricing-page-stack" render={createGrammarNode("pricing-page-stack", {
    ...(Status === undefined ? {} : { status: createGrammarProjection("payment-return-status", () => <Status />) }),
    catalog: createGrammarProjection("pricing-offer-catalog", () => <Catalog />),
})} />
/** Declares the pure pricing page boundary. */
export const meta = { shape: "page", world: "pure", domain: "payment" } as const
