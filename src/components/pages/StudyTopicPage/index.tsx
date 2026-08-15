"use client"

import { useCallback } from "react"
import { StudyTopicOverview } from "@/components/blocks/study/StudyTopicOverview"
import { useRouter } from "@/i18n/navigation"
import { _StudyTopicPage } from "./component"

type StudyTopicPageConnectedProps = { readonly slug: string }
/** Connects one topic slug to detail and practice navigation. */
export const StudyTopicPage = ({ slug }: StudyTopicPageConnectedProps) => {
    const router = useRouter()
    const Surface = useCallback(() => <StudyTopicOverview slug={slug} onStartPractice={() => router.push(`/study/topics/${slug}/practice`)} onBack={() => router.push("/study/explore")} />, [router, slug])
    return <_StudyTopicPage surface={Surface} />
}
/** Declares the connected Study topic page. */
export const meta = { shape: "page", world: "connected", domain: "study" } as const
