"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useQueryFoundationCategoriesSwr } from "@/hooks/swr/useQueryFoundationCategoriesSwr"
import type { FoundationCategoriesPage } from "@/modules/api/graphql/queries/query-foundation-categories"
import { _CourseFoundationsPage } from "./component"

/** Route identity required by the connected foundations hub. */
export type CourseFoundationsPageProps = { readonly displayId: string }

/** Which tree the foundations hub draws for the one catalog read that feeds it. */
const resolveFoundationsState = (
    hasError: boolean,
    data: FoundationCategoriesPage | null | undefined,
) => {
    if (hasError) return "failed"
    if (data === undefined) return "pending"
    return (data?.data.length ?? 0) === 0 ? "empty" : "ready"
}

/** Connect the foundations hub route to the localized server category catalog. */
export const CourseFoundationsPage = ({ displayId }: CourseFoundationsPageProps) => {
    const t = useTranslations("learn.foundations")
    const router = useRouter()
    const [search, setSearch] = useState("")
    const query = useQueryFoundationCategoriesSwr({ search })
    const state = resolveFoundationsState(query.error !== undefined, query.data)
    return (
        <_CourseFoundationsPage
            state={state}
            props={{
                title: t("title"),
                description: t("description"),
                empty: t("empty"),
                failed: t("failed"),
                retry: t("retry"),
                search: t("search"),
                clearSearch: t("clearSearch"),
                categories: query.data?.data ?? [],
            }}
            on={{
                openCategory: (categoryId) => router.push(`/courses/${displayId}/learn/foundations/${categoryId}`),
                search: setSearch,
                retry: () => { void query.mutate() },
            }}
        />
    )
}

/** Source-level ownership marker. */
export const meta = { world: "connected", domain: "learn" } as const
