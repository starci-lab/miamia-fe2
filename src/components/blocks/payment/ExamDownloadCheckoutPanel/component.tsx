import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, renderLeaf, type BlockProps } from "@/modules/types/layout"

/** Localized evidence shown before a download-license purchase. */
export type ExamDownloadCheckoutPanelData = { readonly title: string; readonly body: string; readonly price: string; readonly benefits: ReadonlyArray<string>; readonly checkoutLabel: string; readonly cancelLabel: string; readonly errorMessage: string }
/** Actions available from the pure download checkout panel. */
export type ExamDownloadCheckoutPanelActions = { readonly checkout?: () => void; readonly retry?: () => void; readonly dismiss?: () => void }
/** Finite presentation states for download checkout. */
export type ExamDownloadCheckoutPanelProps = BlockProps<"idle" | "submitting" | "failed", ExamDownloadCheckoutPanelData> & { readonly on?: ExamDownloadCheckoutPanelActions }
/** Renders one package-specific checkout without provider logic. */
export const ExamDownloadCheckoutPanelBase = (input: ExamDownloadCheckoutPanelProps) => <Grammar layout="purchase-checkout-panel" render={layoutNode("purchase-checkout-panel", {
    title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
    body: renderLeaf("text", {}, () => <Text props={{ content: input.props.body, tone: "muted" }} />),
    price: renderLeaf("text", {}, () => <Text props={{ content: input.props.price, weight: "semibold" }} />),
    benefit: input.props.benefits.map((benefit) => renderLeaf("text", {}, () => <Text props={{ content: benefit, icon: "complete" }} />)),
    ...(input.state === "failed" ? { notice: renderComposite("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.errorMessage, actionLabel: input.props.checkoutLabel }} on={{ act: input.on?.retry }} />) } : {}),
    action: [
        renderLeaf("button", {}, () => <Button props={{ label: input.props.checkoutLabel, variant: "primary", isPending: input.state === "submitting", disabled: input.state === "failed" }} on={{ press: input.on?.checkout }} />),
        renderLeaf("button", {}, () => <Button props={{ label: input.props.cancelLabel, variant: "ghost", disabled: input.state === "submitting" }} on={{ press: input.on?.dismiss }} />),
    ],
})} />
/** Declares the pure payment block boundary. */
