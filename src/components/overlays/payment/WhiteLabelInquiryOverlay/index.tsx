"use client"

import { useCallback, useState } from "react"
import { WhiteLabelInquiryPanel } from "@/components/blocks/payment/WhiteLabelInquiryPanel"
import { defineContractProjection } from "@/components/contracts/props"
import { _WhiteLabelInquiryOverlay as WhiteLabelInquiryOverlayView } from "./component"

/** Visibility and dismissal behavior for the White-label inquiry. */
export type WhiteLabelInquiryOverlayConnectedProps = { readonly isOpen: boolean; readonly onDismiss: () => void }
/** Prevents modal dismissal while the anonymous inquiry is in flight. */
export const WhiteLabelInquiryOverlay = ({ isOpen, onDismiss }: WhiteLabelInquiryOverlayConnectedProps) => {
    const [pending, setPending] = useState(false)
    const guardedDismiss = useCallback(() => { if (!pending) onDismiss() }, [onDismiss, pending])
    return (
        <WhiteLabelInquiryOverlayView
            isOpen={isOpen}
            onDismiss={guardedDismiss}
            render={defineContractProjection("white-label-inquiry-panel", () => (
                <WhiteLabelInquiryPanel onDismiss={guardedDismiss} onPendingChange={setPending} />
            ))}
        />
    )
}
/** Declares the connected inquiry overlay boundary. */
export const meta = { shape: "overlay", world: "connected", domain: "payment" } as const
