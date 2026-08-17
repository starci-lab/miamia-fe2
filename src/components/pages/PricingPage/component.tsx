import type { ComponentType } from "react"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"

/** Page-owned catalog and optional return-status regions. */
export type PricingPageProps = { readonly catalog: ComponentType; readonly status?: ComponentType }
/** Renders the pricing route in its frozen screen-level order. */
export const _PricingPage = ({ catalog: Catalog, status: Status }: PricingPageProps) => <Tree contract="pricing-page-stack" render={defineContractComponent("pricing-page-stack", {
    ...(Status === undefined ? {} : { status: defineContractProjection("payment-return-status", () => <Status />) }),
    catalog: defineContractProjection("pricing-offer-catalog", () => <Catalog />),
})} />
/** Declares the pure pricing page boundary. */
export const meta = { shape: "page", world: "pure", domain: "payment" } as const
