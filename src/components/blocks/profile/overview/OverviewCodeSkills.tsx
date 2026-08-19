"use client"

import { useTranslations } from "next-intl"
import type { LabelledProgressRowData } from "@/components/composites/LabelledProgressRow"
import { SkillSnapshot } from "./SkillSnapshot"
import { useOverviewEvidence } from "./useOverviewEvidence"

type Breakdown = { readonly key: string, readonly solved: number }
type CodingSkills = { readonly byLanguage: ReadonlyArray<Breakdown>, readonly byDifficulty: ReadonlyArray<Breakdown>, readonly byDomain: ReadonlyArray<Breakdown> }
type OverviewTranslate = ReturnType<typeof useTranslations>

/** The footer line: the load error, the true empty state, or the language breakdown. */
const resolveStateMessage = (t: OverviewTranslate, hasError: boolean, isLoading: boolean, total: number, languages: ReadonlyArray<Breakdown>): string | undefined => {
    if (hasError) return t("evidence.error")
    if (!isLoading && total === 0) return t("evidence.coding-skills.empty")
    if (languages.length === 0) return undefined
    return t("overview.languageBreakdown", { list: languages.map((item) => `${item.key} ${item.solved}`).join(" · ") })
}

/** Practice proof snapshot preserves solved total and the legacy difficulty/language breakdowns. */
export const OverviewCodeSkills = () => {
    const t = useTranslations("profile")
    const request = useOverviewEvidence<CodingSkills>("coding-skills")
    const data = request.data
    const total = data?.byDifficulty.reduce((sum, item) => sum + item.solved, 0) ?? 0
    const rows: Array<LabelledProgressRowData> = (data?.byDifficulty ?? []).map((item) => ({ id: `difficulty-${item.key}`, title: item.key, percent: total ? Math.round(item.solved / total * 100) : 0, percentText: String(item.solved) }))
    if (request.isLoading) rows.push({ id: "resting", title: "" })
    const languages = data?.byLanguage ?? []
    return <SkillSnapshot
        label={t("overview.codeSkills")}
        totalLabel={t("overview.solved")}
        totalValue={request.isLoading ? undefined : String(total)}
        rows={rows}
        isLoading={request.isLoading}
        stateMessage={resolveStateMessage(t, Boolean(request.error), request.isLoading, total, languages)}
    />
}
