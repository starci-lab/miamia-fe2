import { ModalBranch } from "@/components/branches/ModalBranch"
import type { LayoutKey } from "@/resources/visual-layouts"
import type { LayoutValue } from "@/modules/types/layout"

/** Defines visibility, panel content and dismissal for the checkout overlay. */
export type MembershipCheckoutOverlayProps<K extends LayoutKey> = {
    readonly isOpen: boolean
    readonly render: LayoutValue<K>
    readonly onDismiss: () => void
}
/** Renders the pure membership checkout dialog shell. */
export const MembershipCheckoutOverlayBase = <const K extends LayoutKey>(input: MembershipCheckoutOverlayProps<K>) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="sm"
        layout={input.render.layout}
        render={input.render}
        onDismiss={input.onDismiss}
    />
)
/** Declares the component architecture metadata. */
