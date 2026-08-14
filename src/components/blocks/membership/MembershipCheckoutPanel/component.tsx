import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { defineCompositeComponent, defineContractComponent, defineLeafComponent, type BlockProps } from "@/components/contracts/props"

/** Holds localized membership checkout copy and benefits. */
export type MembershipCheckoutPanelData = { readonly title: string; readonly body: string; readonly benefits: ReadonlyArray<string>; readonly checkoutLabel: string; readonly cancelLabel: string; readonly errorMessage: string }
/** Defines the membership checkout actions. */
export type MembershipCheckoutPanelActions = { readonly checkout?: () => void; readonly retry?: () => void; readonly dismiss?: () => void }
/** Defines the stateful contract for the pure checkout panel. */
export type MembershipCheckoutPanelProps = BlockProps<"idle" | "submitting" | "failed", MembershipCheckoutPanelData> & { readonly on?: MembershipCheckoutPanelActions }

/** Renders the pure membership checkout panel states. */
export const _MembershipCheckoutPanel = (input: MembershipCheckoutPanelProps) => (
    <Tree contract="membership-checkout-panel" render={defineContractComponent("membership-checkout-panel", {
        title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
        body: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.body, tone: "muted" }} />),
        benefit: input.props.benefits.map((benefit) => defineLeafComponent("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
        ...(input.state === "failed" ? {
            notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.errorMessage, actionLabel: input.props.checkoutLabel }} on={{ act: input.on?.retry }} />),
        } : {}),
        action: [
            defineLeafComponent("button", {}, () => <Button props={{ label: input.props.checkoutLabel, variant: "primary", isPending: input.state === "submitting", disabled: input.state === "failed" }} on={{ press: input.on?.checkout }} />),
            defineLeafComponent("button", {}, () => <Button props={{ label: input.props.cancelLabel, variant: "ghost", disabled: input.state === "submitting" }} on={{ press: input.on?.dismiss }} />),
        ],
    })} />
)

/** Declares the component architecture metadata. */
export const meta = { shape: "block", world: "pure", domain: "membership" } as const
