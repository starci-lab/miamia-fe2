import type { ComponentType } from "react"
import { ModalShell } from "@/components/shells/ModalShell"
/** Pure modal visibility, content and dismissal contract. */
export type ExamDownloadCheckoutOverlayProps = { readonly isOpen: boolean; readonly panel: ComponentType; readonly onDismiss: () => void }
/** Mounts download checkout inside shared modal mechanics. */
export const _ExamDownloadCheckoutOverlay = ({ isOpen, panel: Panel, onDismiss }: ExamDownloadCheckoutOverlayProps) => <ModalShell isOpen={isOpen} size="sm" onDismiss={onDismiss}><Panel /></ModalShell>
/** Declares the pure checkout overlay boundary. */
export const meta = { shape: "overlay", world: "pure", domain: "payment" } as const
