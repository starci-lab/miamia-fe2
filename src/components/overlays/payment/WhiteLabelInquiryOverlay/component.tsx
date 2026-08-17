import type { ComponentType } from "react"
import { ModalShell } from "@/components/shells/ModalShell"
/** Pure modal visibility, content and guarded dismissal contract. */
export type WhiteLabelInquiryOverlayProps = { readonly isOpen: boolean; readonly panel: ComponentType; readonly onDismiss: () => void }
/** Mounts the inquiry form inside shared modal mechanics. */
export const _WhiteLabelInquiryOverlay = ({ isOpen, panel: Panel, onDismiss }: WhiteLabelInquiryOverlayProps) => <ModalShell isOpen={isOpen} size="sm" onDismiss={onDismiss}><Panel /></ModalShell>
/** Declares the pure inquiry overlay boundary. */
export const meta = { shape: "overlay", world: "pure", domain: "payment" } as const
