import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"
import type { MiaMiaOfferId } from "@/modules/api/graphql/queries/types/miamia-pricing"

/** Fully resolved content for one selectable offer. */
export type PricingOfferView = { readonly id: MiaMiaOfferId; readonly badge: string; readonly title: string; readonly price: string; readonly body: string; readonly benefits: ReadonlyArray<string>; readonly action: string; readonly enabled: boolean }
/** Pure pricing catalog content and offer-selection action. */
export type PricingOfferCatalogProps = { readonly state: "loading" | "ready" | "failed"; readonly title: string; readonly description: string; readonly licenseTitle: string; readonly selected: MiaMiaOfferId; readonly learning?: PricingOfferView; readonly licenses?: ReadonlyArray<PricingOfferView>; readonly notice: string; readonly retryLabel: string; readonly onSelect: (offer: MiaMiaOfferId) => void; readonly onRetry: () => void }

const offerCard = (offer: PricingOfferView, selected: MiaMiaOfferId, onSelect: (offer: MiaMiaOfferId) => void) => layoutNode("pricing-offer-card", {
    badge: renderLeaf("badge", {}, () => <Badge props={{ content: offer.badge, tone: offer.id === selected ? "accent" : "neutral" }} />),
    title: renderLeaf("heading", {}, () => <Heading props={{ content: offer.title, level: 2 }} />),
    price: renderLeaf("text", {}, () => <Text props={{ content: offer.price, weight: "semibold" }} />),
    body: renderLeaf("text", {}, () => <Text props={{ content: offer.body, tone: "muted" }} />),
    benefit: offer.benefits.map((benefit) => renderLeaf("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
    action: renderLeaf("button", {}, () => <Button props={{ label: offer.action, variant: offer.id === selected ? "primary" : "outline", disabled: !offer.enabled }} on={{ press: () => onSelect(offer.id) }} />),
})

/** Renders the approved two-job offer hierarchy. */
export const PricingOfferCatalogBase = (input: PricingOfferCatalogProps) => input.state !== "ready" || input.learning === undefined || input.licenses === undefined
    ? <EmptyNotice props={{ message: input.notice, actionLabel: input.state === "failed" ? input.retryLabel : undefined }} on={{ act: input.onRetry }} />
    : (
        <Grammar layout="pricing-offer-catalog" render={layoutNode("pricing-offer-catalog", {
            header: layoutNode("page-header-stack", {
                title: renderLeaf("heading", {}, () => <Heading props={{ content: input.title, level: 1 }} />),
            }),
            description: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.description, size: "sm", tone: "muted" }} />),
            learning: layoutContent("pricing-offer-card", () => <SurfaceCard layout="pricing-offer-card" render={offerCard(input.learning!, input.selected, input.onSelect)} />),
            licenseTitle: renderLeaf("heading", {}, () => <Heading props={{ content: input.licenseTitle, level: 2 }} />),
            licenses: layoutNode("pricing-license-grid", {
                offer: input.licenses!.map((offer) => layoutContent("pricing-offer-card", () => <SurfaceCard layout="pricing-offer-card" render={offerCard(offer, input.selected, input.onSelect)} />)),
            }),
        })} />
    )

/** Declares the pure pricing block boundary. */
