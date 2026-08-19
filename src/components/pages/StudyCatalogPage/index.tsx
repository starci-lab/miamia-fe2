"use client"

import { useCallback } from "react"
import { StudyTopicCatalog } from "@/components/blocks/study/StudyTopicCatalog"
import { useRouter } from "@/i18n/navigation"
import { StudyCatalogPageBase } from "./component"

/** Connects the catalogue surface to topic-detail navigation. */
export const StudyCatalogPage = () => {
    const router = useRouter()
    const Surface = useCallback(() => <StudyTopicCatalog onOpenTopic={(slug) => router.push(`/study/topics/${slug}`)} />, [router])
    return <StudyCatalogPageBase surface={Surface} />
}
/** Declares the connected Study catalogue page. */
export const meta = { shape: "page", world: "connected", domain: "study" } as const
