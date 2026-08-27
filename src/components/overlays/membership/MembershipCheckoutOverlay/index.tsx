"use client"

import { MembershipCheckoutPanel } from "@/components/blocks/membership/MembershipCheckoutPanel"
import { createGrammarProjection } from "@/components/contracts/props"
import { MembershipCheckoutOverlayBase } from "./component"

/** Defines visibility and dismissal for the connected checkout overlay. */
export type MembershipCheckoutOverlayConnectedProps = { readonly isOpen: boolean; readonly onDismiss: () => void; readonly returnUrl?: string; readonly cancelUrl?: string }

/** Connects the membership checkout panel to its dialog shell. */
export const MembershipCheckoutOverlay = ({ isOpen, onDismiss, returnUrl, cancelUrl }: MembershipCheckoutOverlayConnectedProps) => (
    <MembershipCheckoutOverlayBase
        isOpen={isOpen}
        onDismiss={onDismiss}
        render={createGrammarProjection("purchase-checkout-panel", () => (
            <MembershipCheckoutPanel onDismiss={onDismiss} returnUrl={returnUrl} cancelUrl={cancelUrl} />
        ))}
    />
)
/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "connected", domain: "membership" } as const
