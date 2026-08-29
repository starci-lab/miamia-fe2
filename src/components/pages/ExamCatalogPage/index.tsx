"use client"

import { useCallback, useEffect, useState } from "react"
import { ExamCatalog } from "@/components/blocks/exam/ExamCatalog"
import { SignInOverlay } from "@/components/overlays/auth/SignInOverlay"
import { MembershipCheckoutOverlay } from "@/components/overlays/membership/MembershipCheckoutOverlay"
import { useRouter } from "@/i18n/navigation"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { ExamCatalogPageBase as ExamCatalogPageView } from "./component"

type DeferredIntent = { readonly kind: "paper"; readonly slug: string } | { readonly kind: "checkout" } | undefined

/** Connects the exam catalogue surface to the MiaMia application shell. */
export const ExamCatalogPage = () => {
    const router = useRouter()
    const token = useSessionToken()
    const [intent, setIntent] = useState<DeferredIntent>()
    const [signInOpen, setSignInOpen] = useState(false)
    const [checkoutOpen, setCheckoutOpen] = useState(false)
    const openPaper = useCallback((slug: string) => {
        if (token) router.push(`/exam/${slug}`)
        else { setIntent({ kind: "paper", slug }); setSignInOpen(true) }
    }, [router, token])
    const requestPremium = useCallback(() => {
        if (token) setCheckoutOpen(true)
        else { setIntent({ kind: "checkout" }); setSignInOpen(true) }
    }, [token])
    useEffect(() => {
        if (!token || intent === undefined || signInOpen) return
        if (intent.kind === "paper") router.push(`/exam/${intent.slug}`)
        else setCheckoutOpen(true)
        setIntent(undefined)
    }, [intent, router, signInOpen, token])
    const Surface = useCallback(() => <ExamCatalog onOpenPaper={openPaper} onRequestPremium={requestPremium} />, [openPaper, requestPremium])
    return (
        <>
            <ExamCatalogPageView surface={Surface} />
            <SignInOverlay isOpen={signInOpen} onDismiss={() => setSignInOpen(false)} />
            <MembershipCheckoutOverlay isOpen={checkoutOpen} onDismiss={() => setCheckoutOpen(false)} />
        </>
    )
}

/** Declares the component architecture metadata. */
