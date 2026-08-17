import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { defineCompositeComponent, defineContractComponent, defineLeafComponent, type BlockProps } from "@/components/contracts/props"

/** Localized evidence shown before a download-license purchase. */
export type ExamDownloadCheckoutPanelData = { readonly title: string; readonly body: string; readonly price: string; readonly benefits: ReadonlyArray<string>; readonly checkoutLabel: string; readonly cancelLabel: string; readonly errorMessage: string }
/** Actions available from the pure download checkout panel. */
export type ExamDownloadCheckoutPanelActions = { readonly checkout?: () => void; readonly retry?: () => void; readonly dismiss?: () => void }
/** Finite presentation states for download checkout. */
export type ExamDownloadCheckoutPanelProps = BlockProps<"idle" | "submitting" | "failed", ExamDownloadCheckoutPanelData> & { readonly on?: ExamDownloadCheckoutPanelActions }
/** Renders one package-specific checkout without provider logic. */
export const _ExamDownloadCheckoutPanel = (input: ExamDownloadCheckoutPanelProps) => <Tree contract="purchase-checkout-panel" render={defineContractComponent("purchase-checkout-panel", {
    title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
    body: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.body, tone: "muted" }} />),
    price: defineLeafComponent("text", {}, () => <Text props={{ content: input.props.price, weight: "semibold" }} />),
    benefit: input.props.benefits.map((benefit) => defineLeafComponent("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
    ...(input.state === "failed" ? { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.errorMessage, actionLabel: input.props.checkoutLabel }} on={{ act: input.on?.retry }} />) } : {}),
    action: [
        defineLeafComponent("button", {}, () => <Button props={{ label: input.props.checkoutLabel, variant: "primary", isPending: input.state === "submitting", disabled: input.state === "failed" }} on={{ press: input.on?.checkout }} />),
        defineLeafComponent("button", {}, () => <Button props={{ label: input.props.cancelLabel, variant: "ghost", disabled: input.state === "submitting" }} on={{ press: input.on?.dismiss }} />),
    ],
})} />
/** Declares the pure payment block boundary. */
export const meta = { shape: "block", world: "pure", domain: "payment" } as const
