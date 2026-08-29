import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, layoutContent } from "@/modules/types/layout"

/** Page-owned catalog and optional return-status regions. */
export type PricingPageProps = { readonly catalog: ComponentType; readonly status?: ComponentType }
/** Renders the pricing route in its frozen screen-level order. */
export const PricingPageBase = ({ catalog: Catalog, status: Status }: PricingPageProps) => <Grammar layout="pricing-page-stack" render={layoutNode("pricing-page-stack", {
    ...(Status === undefined ? {} : { status: layoutContent("payment-return-status", () => <Status />) }),
    catalog: layoutContent("pricing-offer-catalog", () => <Catalog />),
})} />
/** Declares the pure pricing page boundary. */
