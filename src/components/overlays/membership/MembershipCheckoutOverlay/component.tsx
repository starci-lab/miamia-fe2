import { ModalShell } from "@/components/shells/ModalShell"
import type { ComponentType } from "react"

/** Defines visibility, panel content and dismissal for the checkout overlay. */
export type MembershipCheckoutOverlayProps = { readonly isOpen: boolean; readonly panel: ComponentType; readonly onDismiss: () => void }
/** Renders the pure membership checkout dialog shell. */
export const _MembershipCheckoutOverlay = (input: MembershipCheckoutOverlayProps) => {
    const Panel = input.panel
    return <ModalShell isOpen={input.isOpen} size="sm" onDismiss={input.onDismiss}><Panel /></ModalShell>
}
/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "pure", domain: "membership" } as const
