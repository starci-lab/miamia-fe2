"use client"

import { ExamDownloadCheckoutPanel } from "@/components/blocks/payment/ExamDownloadCheckoutPanel"
import type { ExamDownloadPackage } from "@/modules/api/graphql/queries/types/miamia-pricing"
import { defineContractProjection } from "@/components/contracts/props"
import { ExamDownloadCheckoutOverlayBase } from "./component"

/** Package facts and provider return destinations for the checkout modal. */
export type ExamDownloadCheckoutOverlayConnectedProps = { readonly isOpen: boolean; readonly packageId: ExamDownloadPackage; readonly amount: number; readonly returnUrl: string; readonly cancelUrl: string; readonly onDismiss: () => void }
/** Connects the selected package panel to shared modal mechanics. */
export const ExamDownloadCheckoutOverlay = (input: ExamDownloadCheckoutOverlayConnectedProps) => (
    <ExamDownloadCheckoutOverlayBase
        isOpen={input.isOpen}
        onDismiss={input.onDismiss}
        render={defineContractProjection("purchase-checkout-panel", () => (
            <ExamDownloadCheckoutPanel packageId={input.packageId} amount={input.amount} returnUrl={input.returnUrl} cancelUrl={input.cancelUrl} onDismiss={input.onDismiss} />
        ))}
    />
)
/** Declares the connected checkout overlay boundary. */
export const meta = { shape: "overlay", world: "connected", domain: "payment" } as const
