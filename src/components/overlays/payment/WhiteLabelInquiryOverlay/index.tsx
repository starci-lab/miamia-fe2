"use client"

import { useCallback, useState } from "react"
import { WhiteLabelInquiryPanel } from "@/components/blocks/payment/WhiteLabelInquiryPanel"
import { _WhiteLabelInquiryOverlay } from "./component"

/** Visibility and dismissal behavior for the White-label inquiry. */
export type WhiteLabelInquiryOverlayConnectedProps = { readonly isOpen: boolean; readonly onDismiss: () => void }
/** Prevents modal dismissal while the anonymous inquiry is in flight. */
export const WhiteLabelInquiryOverlay = ({ isOpen, onDismiss }: WhiteLabelInquiryOverlayConnectedProps) => {
    const [pending, setPending] = useState(false)
    const guardedDismiss = useCallback(() => { if (!pending) onDismiss() }, [onDismiss, pending])
    const Panel = useCallback(() => <WhiteLabelInquiryPanel onDismiss={guardedDismiss} onPendingChange={setPending} />, [guardedDismiss])
    return <_WhiteLabelInquiryOverlay isOpen={isOpen} panel={Panel} onDismiss={guardedDismiss} />
}
/** Declares the connected inquiry overlay boundary. */
export const meta = { shape: "overlay", world: "connected", domain: "payment" } as const
