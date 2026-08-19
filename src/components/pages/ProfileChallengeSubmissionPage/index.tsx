"use client"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useQueryProfileEvidenceSwr } from "@/hooks/swr/useQueryProfileEvidenceSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/useQueryUserProfileSwr"
import { _ProfileChallengeSubmissionPage as ProfileChallengeSubmissionPageView, type ChallengeDetail } from "./component"

const resolveSubmissionState = (hasError: boolean, isLoading: boolean): "error" | "pending" | "ready" => {
    if (hasError) return "error"
    if (isLoading) return "pending"
    return "ready"
}

/** Resolve one route-selected public challenge submission. */
export const ProfileChallengeSubmissionPage = () => {
    const params = useParams<{ username?: string; courseId?: string; submissionId?: string }>(); const router = useRouter(); const username = String(params.username ?? ""); const courseId = String(params.courseId ?? "")
    const profile = useQueryUserProfileSwr(username); const query = useQueryProfileEvidenceSwr<ChallengeDetail>("challenge-detail", profile.data?.id, { submissionId: params.submissionId })
    return <ProfileChallengeSubmissionPageView state={resolveSubmissionState(Boolean(query.error), query.isLoading || profile.isLoading)} detail={query.data} onBack={() => router.push(`/profile/${username}/challenges/${courseId}`)} />
}
export * from "./component"
/** Source-level tier marker. */
export const meta = { world: "connected", domain: "profile" } as const
