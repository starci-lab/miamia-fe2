"use client"

import { useCallback, useState } from "react"
import { PhrasePractice } from "@/components/blocks/study/PhrasePractice"
import { SignInOverlay } from "@/components/overlays/auth/SignInOverlay"
import { useRouter } from "@/i18n/navigation"
import { _StudyPracticePage } from "./component"

type StudyPracticePageConnectedProps = { readonly slug: string }
/** Keeps practice mounted while the sign-in overlay resolves authentication. */
export const StudyPracticePage = ({ slug }: StudyPracticePageConnectedProps) => {
    const router = useRouter()
    const [signInOpen, setSignInOpen] = useState(false)
    const Surface = useCallback(() => <PhrasePractice slug={slug} onRequireSignIn={() => setSignInOpen(true)} onExit={() => router.push("/study")} />, [router, slug])
    return <><_StudyPracticePage surface={Surface} /><SignInOverlay isOpen={signInOpen} onDismiss={() => setSignInOpen(false)} /></>
}
/** Declares the connected Study practice page. */
export const meta = { shape: "page", world: "connected", domain: "study" } as const
