"use client"

import { useTranslations } from "next-intl"
import { ComingSoonOverlayBase } from "./component"

/** Defines feature identity and dismissal behavior for the connected overlay. */
export type ComingSoonOverlayConnectedProps = { readonly isOpen: boolean; readonly featureLabel: string; readonly onDismiss: () => void }

/** Connects localized copy to the pure coming-soon dialog. */
export const ComingSoonOverlay = (input: ComingSoonOverlayConnectedProps) => {
    const t = useTranslations("miamia.comingSoon")
    return <ComingSoonOverlayBase isOpen={input.isOpen} title={t("title", { feature: input.featureLabel })} body={t("body")} closeLabel={t("close")} onDismiss={input.onDismiss} />
}

/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "connected", domain: "app" } as const
