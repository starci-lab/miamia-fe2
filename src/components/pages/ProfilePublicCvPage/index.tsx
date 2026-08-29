"use client"

import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useQueryMeSwr } from "@/hooks/swr/useQueryMeSwr"
import { useQueryPublicUserCvSwr } from "@/hooks/swr/useQueryPublicUserCvSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/useQueryUserProfileSwr"
import type { PublicUserCvData } from "@/modules/api/graphql/queries/types/user-profile"
import { ProfilePublicCvPageBase as ProfilePublicCvPageView } from "./component"

type PublicCvState = "error" | "pending" | "empty" | "ready" | "uncompiled"

/** Which tree the public CV route draws for the one read that feeds it. */
const resolvePublicCvState = (
    hasError: boolean,
    data: PublicUserCvData | null | undefined,
): PublicCvState => {
    if (hasError) return "error"
    if (data === undefined) return "pending"
    if (data === null) return "empty"
    return data.pdfUrl ? "ready" : "uncompiled"
}

/** The notice line under the title; blank once a CV is actually ready to show. */
const resolvePublicCvMessage = (
    t: ReturnType<typeof useTranslations>,
    state: PublicCvState,
): string => {
    if (state === "error") return "The public CV couldn't be loaded."
    if (state === "empty") return t("empty")
    if (state === "uncompiled") return t("pending")
    return ""
}

/** Resolve owner state and distinguish loading, missing, uncompiled and ready CVs. */
export const ProfilePublicCvPage = () => {
    const t = useTranslations("profile.cv")
    const params = useParams<{ username?: string }>()
    const router = useRouter()
    const username = String(params.username ?? "")
    const profile = useQueryUserProfileSwr(username)
    const viewer = useQueryMeSwr()
    const cv = useQueryPublicUserCvSwr(username)
    const isSelf = Boolean(profile.data?.id && viewer.data?.id === profile.data.id)
    const state = resolvePublicCvState(Boolean(cv.error), cv.data)
    return <ProfilePublicCvPageView state={state} props={{ label: t("label"), message: resolvePublicCvMessage(t, state), title: cv.data?.label ?? t("label"), pdfUrl: cv.data?.pdfUrl ?? undefined, editLabel: t("edit"), retryLabel: "Try again", isSelf }} on={{ edit: () => router.push("/profile/cv"), retry: () => { void cv.mutate() } }} />
}

export * from "./component"
/** Source-level tier marker. */
