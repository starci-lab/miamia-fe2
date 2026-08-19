"use client"

import { useTranslations } from "next-intl"
import { useQueryModuleSwr } from "@/hooks/swr/useQueryModuleSwr"
import { CourseLearnModulePageBase as CourseLearnModulePageView } from "./component"

/** Route identity required to load one enrolled module. */
export interface CourseLearnModulePageConnectedProps { readonly moduleId: string }

/** Module load lifecycle: an error fails, no data yet is pending, otherwise ready. */
const resolveModuleState = (hasError: boolean, dataLoaded: boolean) => {
    if (hasError) return "failed" as const
    if (!dataLoaded) return "pending" as const
    return "ready" as const
}

/** Load one module and connect its query situations to the pure page. */
export const CourseLearnModulePage = ({ moduleId }: CourseLearnModulePageConnectedProps) => {
    const t = useTranslations("learn.module")
    const module = useQueryModuleSwr({ id: moduleId })
    return <CourseLearnModulePageView state={resolveModuleState(Boolean(module.error), module.data !== undefined)} title={module.data?.title} module={module.data ?? undefined} label={t("contents")} />
}

/** Connected ownership metadata for the module route. */
export const meta = { world: "connected", domain: "learn" } as const
