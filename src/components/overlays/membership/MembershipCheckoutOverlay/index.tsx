"use client"

import { useCallback } from "react"
import { MembershipCheckoutPanel } from "@/components/blocks/membership/MembershipCheckoutPanel"
import { _MembershipCheckoutOverlay } from "./component"

/** Defines visibility and dismissal for the connected checkout overlay. */
export type MembershipCheckoutOverlayConnectedProps = { readonly isOpen: boolean; readonly onDismiss: () => void; readonly returnUrl?: string; readonly cancelUrl?: string }

/** Connects the membership checkout panel to its dialog shell. */
export const MembershipCheckoutOverlay = ({ isOpen, onDismiss, returnUrl, cancelUrl }: MembershipCheckoutOverlayConnectedProps) => {
    const Panel = useCallback(() => <MembershipCheckoutPanel onDismiss={onDismiss} returnUrl={returnUrl} cancelUrl={cancelUrl} />, [cancelUrl, onDismiss, returnUrl])
    return <_MembershipCheckoutOverlay isOpen={isOpen} panel={Panel} onDismiss={onDismiss} />
}
/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "connected", domain: "membership" } as const
