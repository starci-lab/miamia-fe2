"use client"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useQueryProfileEvidenceSwr } from "@/hooks/swr/useQueryProfileEvidenceSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/useQueryUserProfileSwr"
import type { ProfileCapstone } from "@/modules/api/graphql/queries/types/profile-evidence"
import { ProfileProjectRoadmapPageBase as ProfileProjectRoadmapPageView } from "./component"

/** Roadmap load lifecycle: an evidence error wins, either query still loading is pending, otherwise ready. */
const resolveRoadmapState = (hasError: boolean, isLoading: boolean) => {
    if (hasError) return "error" as const
    if (isLoading) return "pending" as const
    return "ready" as const
}

/** Resolve the route-selected capstone without dropping persistent profile chrome. */
export const ProfileProjectRoadmapPage = () => {
    const params = useParams<{ username?: string; courseId?: string }>()
    const router = useRouter()
    const username = String(params.username ?? "")
    const profile = useQueryUserProfileSwr(username)
    const query = useQueryProfileEvidenceSwr<ReadonlyArray<ProfileCapstone>>("capstones", profile.data?.id)
    const project = query.data?.find((item) => item.courseGlobalId === params.courseId)
    const state = resolveRoadmapState(Boolean(query.error), query.isLoading || profile.isLoading)
    return <ProfileProjectRoadmapPageView state={state} project={project} onBack={() => router.push(`/profile/${username}/projects`)} />
}
export * from "./component"
/** Source-level tier marker. */
export const meta = { world: "connected", domain: "profile" } as const
