import type { ComponentType } from "react"
import { ModalBranch } from "@/components/branches/ModalBranch"
/** Pure modal visibility, content and dismissal contract. */
export type ExamDownloadCheckoutOverlayProps = { readonly isOpen: boolean; readonly panel: ComponentType; readonly onDismiss: () => void }
/** Mounts download checkout inside shared modal mechanics. */
export const _ExamDownloadCheckoutOverlay = ({ isOpen, panel: Panel, onDismiss }: ExamDownloadCheckoutOverlayProps) => <ModalBranch isOpen={isOpen} size="sm" onDismiss={onDismiss}><Panel /></ModalBranch>
/** Declares the pure checkout overlay boundary. */
export const meta = { shape: "overlay", world: "pure", domain: "payment" } as const
