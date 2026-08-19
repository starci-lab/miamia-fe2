"use client"

import { useTranslations } from "next-intl"
import type { LabelledProgressRowData } from "@/components/composites/LabelledProgressRow"
import { SkillSnapshot } from "./SkillSnapshot"
import { useOverviewEvidence } from "./useOverviewEvidence"

type Challenge = { readonly id: string, readonly difficulty?: string | null, readonly selectedLang?: string | null }

/** The status line under the total: an error, emptiness, or the language breadth. */
const deriveStateMessage = (
    hasError: boolean,
    isEmpty: boolean,
    languageCount: number,
    errorMessage: string,
    emptyMessage: string,
    languageMessage: string,
): string | undefined => {
    if (hasError) return errorMessage
    if (isEmpty) return emptyMessage
    if (languageCount > 0) return languageMessage
    return undefined
}

/** Challenge proof snapshot preserves passed count, difficulty depth, and language breadth. */
export const OverviewChallengeSkills = () => {
    const t = useTranslations("profile")
    const request = useOverviewEvidence<ReadonlyArray<Challenge>>("solved-challenges")
    const challenges = request.data ?? []
    const difficulty = new Map<string, number>()
    const languages = new Set<string>()
    challenges.forEach((item) => {
        if (item.difficulty) {
            difficulty.set(item.difficulty, (difficulty.get(item.difficulty) ?? 0) + 1)
        }
        if (item.selectedLang) {
            languages.add(item.selectedLang)
        }
    })
    const rows: Array<LabelledProgressRowData> = [...difficulty].map(([key, value]) => ({ id: `difficulty-${key}`, title: key, percent: challenges.length ? Math.round(value / challenges.length * 100) : 0, percentText: String(value) }))
    if (request.isLoading) rows.push({ id: "resting", title: "" })
    const stateMessage = deriveStateMessage(
        Boolean(request.error),
        !request.isLoading && challenges.length === 0,
        languages.size,
        t("evidence.error"),
        t("evidence.solved-challenges.empty"),
        t("overview.languages", { count: languages.size, list: [...languages].join(" · ") }),
    )
    return <SkillSnapshot label={t("overview.challengeSkills")} totalLabel={t("overview.passed")} totalValue={request.isLoading ? undefined : String(challenges.length)} rows={rows} isLoading={request.isLoading} stateMessage={stateMessage} />
}
