"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useQueryFoundationSwr } from "@/hooks/swr/useQueryFoundationSwr"
import { CourseFoundationResourcePageBase as CourseFoundationResourcePageView } from "./component"

/** Route identities required by the connected foundation resource reader. */
export type CourseFoundationResourcePageProps = { readonly displayId: string; readonly categoryId: string; readonly foundationId: string }

/** A resolved-but-absent resource is "not-found", distinct from a load failure. */
const resolveResourceState = (error: unknown, data: unknown): "failed" | "pending" | "not-found" | "ready" => {
    if (error !== undefined) return "failed"
    if (data === undefined) return "pending"
    if (data === null) return "not-found"
    return "ready"
}

/** Resolve a route resource identity and connect its follow-on playground action. */
export const CourseFoundationResourcePage = ({ displayId, categoryId, foundationId }: CourseFoundationResourcePageProps) => {
    const t = useTranslations("learn.foundations")
    const router = useRouter()
    const query = useQueryFoundationSwr({ displayId: foundationId })
    const state = resolveResourceState(query.error, query.data)
    return (
        <CourseFoundationResourcePageView
            state={state}
            props={{
                resource: query.data,
                titleFallback: t("resourceTitleFallback"),
                notFound: t("resourceNotFound"),
                failed: t("resourceFailed"),
                retry: t("retry"),
                back: t("back"),
                openPlayground: t("openPlayground"),
            }}
            on={{
                back: () => router.push(`/courses/${displayId}/learn/foundations/${categoryId}`),
                retry: () => { void query.mutate() },
                openPlayground: () => router.push(`/courses/${displayId}/learn/playground`),
            }}
        />
    )
}

/** Source-level ownership marker. */
export const meta = { world: "connected", domain: "learn" } as const
