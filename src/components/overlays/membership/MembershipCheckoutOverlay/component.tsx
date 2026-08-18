import { ModalBranch } from "@/components/branches/ModalBranch"
import type { ComponentType } from "react"

/** Defines visibility, panel content and dismissal for the checkout overlay. */
export type MembershipCheckoutOverlayProps = { readonly isOpen: boolean; readonly panel: ComponentType; readonly onDismiss: () => void }
/** Renders the pure membership checkout dialog shell. */
export const _MembershipCheckoutOverlay = (input: MembershipCheckoutOverlayProps) => {
    const Panel = input.panel
    return <ModalBranch isOpen={input.isOpen} size="sm" onDismiss={input.onDismiss}><Panel /></ModalBranch>
}
/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "pure", domain: "membership" } as const
