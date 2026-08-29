"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PricingOfferCatalog } from "@/components/blocks/payment/PricingOfferCatalog"
import { PaymentReturnStatus } from "@/components/blocks/payment/PaymentReturnStatus"
import { SignInOverlay } from "@/components/overlays/auth/SignInOverlay"
import { MembershipCheckoutOverlay } from "@/components/overlays/membership/MembershipCheckoutOverlay"
import { ExamDownloadCheckoutOverlay } from "@/components/overlays/payment/ExamDownloadCheckoutOverlay"
import { WhiteLabelInquiryOverlay } from "@/components/overlays/payment/WhiteLabelInquiryOverlay"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { useQueryMiaMiaPricingCatalogSwr } from "@/hooks/swr/useQueryMiaMiaPricingCatalogSwr"
import { useRouter } from "@/i18n/navigation"
import type { ExamDownloadPackage, MiaMiaOfferId } from "@/modules/api/graphql/queries/types/miamia-pricing"
import { PricingPageBase as PricingPageView } from "./component"

const OFFERS: ReadonlySet<MiaMiaOfferId> = new Set(["pro", "personal", "commercial", "white-label"])
const isOffer = (value: string | null): value is MiaMiaOfferId => value !== null && OFFERS.has(value as MiaMiaOfferId)

/** Coordinates URL offer state, authentication and the three approved overlays. */
export const PricingPage = () => {
    const search = useSearchParams()
    const router = useRouter()
    const token = useSessionToken()
    const catalog = useQueryMiaMiaPricingCatalogSwr()
    const selected = isOffer(search.get("offer")) ? search.get("offer") as MiaMiaOfferId : "pro"
    const referenceId = search.get("return") === "1" ? search.get("orderCode") ?? undefined : undefined
    const [deferred, setDeferred] = useState<MiaMiaOfferId>()
    const [signInOpen, setSignInOpen] = useState(false)
    const [membershipOpen, setMembershipOpen] = useState(false)
    const [downloadOpen, setDownloadOpen] = useState(false)
    const [inquiryOpen, setInquiryOpen] = useState(false)
    const [checkoutUrls, setCheckoutUrls] = useState({ returnUrl: "", cancelUrl: "" })
    const choose = useCallback((offer: MiaMiaOfferId) => {
        router.replace(`/pricing?offer=${offer}`)
        if (offer === "white-label") { setInquiryOpen(true); return }
        const returnUrl = new URL(window.location.href)
        returnUrl.searchParams.set("offer", offer)
        returnUrl.searchParams.set("return", "1")
        returnUrl.searchParams.delete("orderCode")
        const cancelUrl = new URL(window.location.href)
        cancelUrl.searchParams.set("offer", offer)
        cancelUrl.searchParams.delete("return")
        cancelUrl.searchParams.delete("orderCode")
        setCheckoutUrls({ returnUrl: returnUrl.toString(), cancelUrl: cancelUrl.toString() })
        if (!token) { setDeferred(offer); setSignInOpen(true); return }
        if (offer === "pro") setMembershipOpen(true)
        else setDownloadOpen(true)
    }, [router, token])
    useEffect(() => {
        if (!token || deferred === undefined || signInOpen) return
        if (deferred === "pro") setMembershipOpen(true)
        else setDownloadOpen(true)
        setDeferred(undefined)
    }, [deferred, signInOpen, token])
    const packageId: ExamDownloadPackage = selected === "commercial" ? "commercial" : "personal"
    const amount = catalog.data?.examDownloads?.packages.find((item) => item.packageId === packageId)?.priceVnd ?? 0
    const Catalog = useCallback(() => <PricingOfferCatalog selected={selected} onSelect={choose} />, [choose, selected])
    const Status = useCallback(() => referenceId === undefined ? null : <PaymentReturnStatus referenceId={referenceId} onContinue={() => router.replace("/pricing")} />, [referenceId, router])
    return <>
        <PricingPageView catalog={Catalog} status={referenceId === undefined ? undefined : Status} />
        <SignInOverlay isOpen={signInOpen} onDismiss={() => setSignInOpen(false)} />
        <MembershipCheckoutOverlay isOpen={membershipOpen} returnUrl={checkoutUrls.returnUrl} cancelUrl={checkoutUrls.cancelUrl} onDismiss={() => setMembershipOpen(false)} />
        <ExamDownloadCheckoutOverlay isOpen={downloadOpen} packageId={packageId} amount={amount} returnUrl={checkoutUrls.returnUrl} cancelUrl={checkoutUrls.cancelUrl} onDismiss={() => setDownloadOpen(false)} />
        <WhiteLabelInquiryOverlay isOpen={inquiryOpen} onDismiss={() => setInquiryOpen(false)} />
    </>
}
/** Declares the connected pricing page boundary. */
