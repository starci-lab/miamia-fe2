import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import type { MiaMiaOfferId } from "@/modules/api/graphql/queries/types/miamia-pricing"

/** Fully resolved content for one selectable offer. */
export type PricingOfferView = { readonly id: MiaMiaOfferId; readonly badge: string; readonly title: string; readonly price: string; readonly body: string; readonly benefits: ReadonlyArray<string>; readonly action: string; readonly enabled: boolean }
/** Pure pricing catalog content and offer-selection action. */
export type PricingOfferCatalogProps = { readonly state: "loading" | "ready" | "failed"; readonly title: string; readonly description: string; readonly licenseTitle: string; readonly selected: MiaMiaOfferId; readonly learning?: PricingOfferView; readonly licenses?: ReadonlyArray<PricingOfferView>; readonly notice: string; readonly retryLabel: string; readonly onSelect: (offer: MiaMiaOfferId) => void; readonly onRetry: () => void }

const offerCard = (offer: PricingOfferView, selected: MiaMiaOfferId, onSelect: (offer: MiaMiaOfferId) => void) => defineContractComponent("pricing-offer-card", {
    badge: defineLeafComponent("badge", {}, () => <Badge props={{ content: offer.badge, tone: offer.id === selected ? "accent" : "neutral" }} />),
    title: defineLeafComponent("heading", {}, () => <Heading props={{ content: offer.title, level: 2 }} />),
    price: defineLeafComponent("text", {}, () => <Text props={{ content: offer.price, weight: "semibold" }} />),
    body: defineLeafComponent("text", {}, () => <Text props={{ content: offer.body, tone: "muted" }} />),
    benefit: offer.benefits.map((benefit) => defineLeafComponent("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
    action: defineLeafComponent("button", {}, () => <Button props={{ label: offer.action, variant: offer.id === selected ? "primary" : "outline", disabled: !offer.enabled }} on={{ press: () => onSelect(offer.id) }} />),
})

/** Renders the approved two-job offer hierarchy. */
export const _PricingOfferCatalog = (input: PricingOfferCatalogProps) => input.state !== "ready" || input.learning === undefined || input.licenses === undefined
    ? <EmptyNotice props={{ message: input.notice, actionLabel: input.state === "failed" ? input.retryLabel : undefined }} on={{ act: input.onRetry }} />
    : (
        <Tree contract="pricing-offer-catalog" render={defineContractComponent("pricing-offer-catalog", {
            header: defineContractComponent("page-header-stack", {
                title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.title, level: 1 }} />),
            }),
            description: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: input.description, size: "sm", tone: "muted" }} />),
            learning: defineContractProjection("pricing-offer-card", () => <SurfaceCard contract="pricing-offer-card" render={offerCard(input.learning!, input.selected, input.onSelect)} />),
            licenseTitle: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.licenseTitle, level: 2 }} />),
            licenses: defineContractComponent("pricing-license-grid", {
                offer: input.licenses!.map((offer) => defineContractProjection("pricing-offer-card", () => <SurfaceCard contract="pricing-offer-card" render={offerCard(offer, input.selected, input.onSelect)} />)),
            }),
        })} />
    )

/** Declares the pure pricing block boundary. */
export const meta = { shape: "block", world: "pure", domain: "payment" } as const
