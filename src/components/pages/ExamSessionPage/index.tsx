"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { ExamSession } from "@/components/blocks/exam/ExamSession"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { SignInOverlay } from "@/components/overlays/auth/SignInOverlay"
import { useSessionRefresh } from "@/hooks/auth/useSessionRefresh"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { useRouter } from "@/i18n/navigation"
import { ExamSessionPageBase } from "./component"

/** Defines the paper route consumed by the connected exam-session page. */
export type ExamSessionPageConnectedProps = { readonly slug: string }

/** Connects the selected exam paper to the MiaMia application shell. */
export const ExamSessionPage = ({ slug }: ExamSessionPageConnectedProps) => {
    const t = useTranslations("miamia.exam.session")
    const router = useRouter()
    const token = useSessionToken()
    const session = useSessionRefresh()
    const [signInOpen, setSignInOpen] = useState(false)
    useEffect(() => { if (!session.isRestoring && !token) setSignInOpen(true) }, [session.isRestoring, token])
    const Surface = useCallback(() => token
        ? <ExamSession slug={slug} onExit={() => router.push("/exam")} />
        : <EmptyNotice props={{ icon: "account", message: session.isRestoring ? t("restoring") : t("signInRequired"), actionLabel: session.isRestoring ? undefined : t("signIn") }} on={{ act: () => setSignInOpen(true) }} />,
    [router, session.isRestoring, slug, t, token])
    return <><ExamSessionPageBase surface={Surface} /><SignInOverlay isOpen={signInOpen && !token} onDismiss={() => setSignInOpen(false)} /></>
}

/** Declares the component architecture metadata. */
export const meta = { shape: "page", world: "connected", domain: "exam" } as const
