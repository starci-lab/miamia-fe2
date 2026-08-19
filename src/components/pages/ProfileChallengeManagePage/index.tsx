"use client"
import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useQueryProfileEvidenceSwr } from "@/hooks/swr/useQueryProfileEvidenceSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/useQueryUserProfileSwr"
import type { ProfileSolvedChallenge } from "@/modules/api/graphql/queries/types/profile-evidence"
import { _ProfileChallengeManagePage as ProfileChallengeManagePageView } from "./component"

/** A load failure outranks the loading flag; otherwise the list is either still settling or ready. */
const resolveManageState = (hasError: boolean, isLoading: boolean): "error" | "pending" | "ready" => {
    if (hasError) return "error"
    if (isLoading) return "pending"
    return "ready"
}

/** Resolve and locally filter the selected course's passed submissions. */
export const ProfileChallengeManagePage = () => {
    const params = useParams<{ username?: string; courseId?: string }>()
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [difficulty, setDifficulty] = useState<string | null>(null)
    const username = String(params.username ?? "")
    const courseId = String(params.courseId ?? "")
    const profile = useQueryUserProfileSwr(username)
    const query = useQueryProfileEvidenceSwr<ReadonlyArray<ProfileSolvedChallenge>>("solved-challenges", profile.data?.id)
    const course = (query.data ?? []).filter((item) => item.courseGlobalId === courseId || item.courseSlug === courseId)
    const difficulties = Array.from(new Set(course.map((item) => item.difficulty).filter((value): value is string => Boolean(value))))
    const rows = useMemo(() => course.filter((item) => item.title.toLowerCase().includes(search.trim().toLowerCase()) && (difficulty === null || item.difficulty === difficulty)), [course, difficulty, search])
    const cycleDifficulty = () => setDifficulty((current) => current === null ? difficulties[0] ?? null : difficulties[difficulties.indexOf(current) + 1] ?? null)
    return (
        <ProfileChallengeManagePageView
            state={resolveManageState(Boolean(query.error), query.isLoading || profile.isLoading)}
            courseTitle={course[0]?.courseTitle ?? undefined}
            rows={rows}
            query={search}
            filterLabel={difficulty === null ? "Filters" : `Filters · 1 (${difficulty})`}
            on={{
                back: () => router.push(`/profile/${username}/challenges`),
                search: setSearch,
                filter: cycleDifficulty,
                select: (id) => router.push(`/profile/${username}/challenges/${courseId}/${id}`),
            }}
        />
    )
}
export * from "./component"
/** Source-level tier marker. */
export const meta = { world: "connected", domain: "profile" } as const
