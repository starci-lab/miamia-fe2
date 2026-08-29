"use client"

import { useCallback, useState } from "react"
import { WhiteLabelInquiryPanel } from "@/components/blocks/payment/WhiteLabelInquiryPanel"
import { layoutContent } from "@/modules/types/layout"
import { WhiteLabelInquiryOverlayBase as WhiteLabelInquiryOverlayView } from "./component"

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
            render={layoutContent("white-label-inquiry-panel", () => (
                <WhiteLabelInquiryPanel onDismiss={guardedDismiss} onPendingChange={setPending} />
            ))}
        />
    )
}
/** Declares the connected inquiry overlay boundary. */
