"use client"

import { useCallback, useState } from "react"
import { StudyContinue } from "@/components/blocks/study/StudyContinue"
import { StudyProgress } from "@/components/blocks/study/StudyProgress"
import { SignInOverlay } from "@/components/overlays/auth/SignInOverlay"
import { useRouter } from "@/i18n/navigation"
import { StudyHomePageBase as StudyHomePageView } from "./component"

/** Connects both independent Study landing surfaces and their navigation. */
export const StudyHomePage = () => {
    const router = useRouter()
    const [signInOpen, setSignInOpen] = useState(false)
    const ContinueSurface = useCallback(() => <StudyContinue onBrowse={() => router.push("/study/explore")} onResumeTopic={(slug) => router.push(`/study/topics/${slug}`)} />, [router])
    const ProgressSurface = useCallback(() => <StudyProgress onBrowse={() => router.push("/study/explore")} onRequireSignIn={() => setSignInOpen(true)} />, [router])
    return <><StudyHomePageView continueSurface={ContinueSurface} progressSurface={ProgressSurface} /><SignInOverlay isOpen={signInOpen} onDismiss={() => setSignInOpen(false)} /></>
}

/** Declares the connected Study landing page. */
