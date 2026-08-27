import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createLeafNode, type BlockProps } from "@/components/contracts/props"

/** Holds localized membership checkout copy and benefits. */
export type MembershipCheckoutPanelData = { readonly title: string; readonly body: string; readonly price: string; readonly benefits: ReadonlyArray<string>; readonly checkoutLabel: string; readonly cancelLabel: string; readonly errorMessage: string }
/** Defines the membership checkout actions. */
export type MembershipCheckoutPanelActions = { readonly checkout?: () => void; readonly retry?: () => void; readonly dismiss?: () => void }
/** Defines the stateful contract for the pure checkout panel. */
export type MembershipCheckoutPanelProps = BlockProps<"loading" | "idle" | "submitting" | "failed", MembershipCheckoutPanelData> & { readonly on?: MembershipCheckoutPanelActions }

/** Renders the pure membership checkout panel states. */
export const MembershipCheckoutPanelBase = (input: MembershipCheckoutPanelProps) => (
    <Grammar contract="purchase-checkout-panel" render={createGrammarNode("purchase-checkout-panel", {
        title: createLeafNode("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
        body: createLeafNode("text", {}, () => <Text props={{ content: input.props.body, tone: "muted" }} />),
        price: createLeafNode("text", {}, () => <Text props={{ content: input.props.price, weight: "semibold" }} isLoading={input.state === "loading"} />),
        benefit: input.props.benefits.map((benefit) => createLeafNode("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
        ...(input.state === "failed" ? {
            notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.errorMessage, actionLabel: input.props.checkoutLabel }} on={{ act: input.on?.retry }} />),
        } : {}),
        action: [
            createLeafNode("button", {}, () => <Button props={{ label: input.props.checkoutLabel, variant: "primary", isPending: input.state === "submitting", disabled: input.state === "failed" || input.state === "loading" }} on={{ press: input.on?.checkout }} />),
            createLeafNode("button", {}, () => <Button props={{ label: input.props.cancelLabel, variant: "ghost", disabled: input.state === "submitting" }} on={{ press: input.on?.dismiss }} />),
        ],
    })} />
)

/** Declares the component architecture metadata. */
export const meta = { shape: "block", world: "pure", domain: "membership" } as const
