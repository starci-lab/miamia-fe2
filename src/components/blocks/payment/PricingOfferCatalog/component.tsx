import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"
import type { MiaMiaOfferId } from "@/modules/api/graphql/queries/types/miamia-pricing"

/** Fully resolved content for one selectable offer. */
export type PricingOfferView = { readonly id: MiaMiaOfferId; readonly badge: string; readonly title: string; readonly price: string; readonly body: string; readonly benefits: ReadonlyArray<string>; readonly action: string; readonly enabled: boolean }
/** Pure pricing catalog content and offer-selection action. */
export type PricingOfferCatalogProps = { readonly state: "loading" | "ready" | "failed"; readonly title: string; readonly description: string; readonly licenseTitle: string; readonly selected: MiaMiaOfferId; readonly learning?: PricingOfferView; readonly licenses?: ReadonlyArray<PricingOfferView>; readonly notice: string; readonly retryLabel: string; readonly onSelect: (offer: MiaMiaOfferId) => void; readonly onRetry: () => void }

const offerCard = (offer: PricingOfferView, selected: MiaMiaOfferId, onSelect: (offer: MiaMiaOfferId) => void) => createGrammarNode("pricing-offer-card", {
    badge: createLeafNode("badge", {}, () => <Badge props={{ content: offer.badge, tone: offer.id === selected ? "accent" : "neutral" }} />),
    title: createLeafNode("heading", {}, () => <Heading props={{ content: offer.title, level: 2 }} />),
    price: createLeafNode("text", {}, () => <Text props={{ content: offer.price, weight: "semibold" }} />),
    body: createLeafNode("text", {}, () => <Text props={{ content: offer.body, tone: "muted" }} />),
    benefit: offer.benefits.map((benefit) => createLeafNode("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
    action: createLeafNode("button", {}, () => <Button props={{ label: offer.action, variant: offer.id === selected ? "primary" : "outline", disabled: !offer.enabled }} on={{ press: () => onSelect(offer.id) }} />),
})

/** Renders the approved two-job offer hierarchy. */
export const PricingOfferCatalogBase = (input: PricingOfferCatalogProps) => input.state !== "ready" || input.learning === undefined || input.licenses === undefined
    ? <EmptyNotice props={{ message: input.notice, actionLabel: input.state === "failed" ? input.retryLabel : undefined }} on={{ act: input.onRetry }} />
    : (
        <Grammar contract="pricing-offer-catalog" render={createGrammarNode("pricing-offer-catalog", {
            header: createGrammarNode("page-header-stack", {
                title: createLeafNode("heading", {}, () => <Heading props={{ content: input.title, level: 1 }} />),
            }),
            description: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.description, size: "sm", tone: "muted" }} />),
            learning: createGrammarProjection("pricing-offer-card", () => <SurfaceCard contract="pricing-offer-card" render={offerCard(input.learning!, input.selected, input.onSelect)} />),
            licenseTitle: createLeafNode("heading", {}, () => <Heading props={{ content: input.licenseTitle, level: 2 }} />),
            licenses: createGrammarNode("pricing-license-grid", {
                offer: input.licenses!.map((offer) => createGrammarProjection("pricing-offer-card", () => <SurfaceCard contract="pricing-offer-card" render={offerCard(offer, input.selected, input.onSelect)} />)),
            }),
        })} />
    )

/** Declares the pure pricing block boundary. */
export const meta = { shape: "block", world: "pure", domain: "payment" } as const
