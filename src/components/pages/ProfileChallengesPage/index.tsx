"use client"

import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useQueryProfileEvidenceSwr } from "@/hooks/swr/useQueryProfileEvidenceSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/useQueryUserProfileSwr"
import type { ProfileSolvedChallenge } from "@/modules/api/graphql/queries/types/profile-evidence"
import { ProfileChallengesPageBase, type ChallengeStrength } from "./component"

/** An errored fetch beats still-loading; ready is what's left. */
const resolveEvidenceState = (hasError: boolean, isPending: boolean): "error" | "pending" | "ready" => {
    if (hasError) return "error"
    if (isPending) return "pending"
    return "ready"
}

/** Resolve challenge standing and submissions for the public route. */
export const ProfileChallengesPage = () => {
    const params = useParams<{ username?: string }>()
    const router = useRouter()
    const username = String(params.username ?? "")
    const profile = useQueryUserProfileSwr(username)
    const strength = useQueryProfileEvidenceSwr<ChallengeStrength>("challenge-strength", profile.data?.id)
    const submissions = useQueryProfileEvidenceSwr<ReadonlyArray<ProfileSolvedChallenge>>("solved-challenges", profile.data?.id)
    const waiting = profile.isLoading
    return <ProfileChallengesPageBase
        strength={{ state: resolveEvidenceState(Boolean(strength.error), strength.isLoading || waiting), data: strength.data }}
        submissions={{ state: resolveEvidenceState(Boolean(submissions.error), submissions.isLoading || waiting), data: submissions.data ?? [] }}
        on={{ openCourse: (courseId) => router.push(`/profile/${username}/challenges/${courseId}`) }}
    />
}

export * from "./component"
/** Source-level tier marker. */
