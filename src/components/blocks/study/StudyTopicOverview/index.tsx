"use client"

import { useLocale, useTranslations } from "next-intl"
import { useQueryTopicDetailSwr } from "@/hooks"
import { _StudyTopicOverview } from "./component"

type StudyTopicOverviewConnectedProps = { readonly slug: string; readonly onStartPractice: () => void; readonly onBack: () => void }
/** Connects one route slug to public topic detail data. */
export const StudyTopicOverview = ({ slug, onStartPractice, onBack }: StudyTopicOverviewConnectedProps) => {
    const t = useTranslations("miamia.study.topic")
    const locale = useLocale()
    const query = useQueryTopicDetailSwr(slug)
    const detail = query.data ?? undefined
    const localized = (vi: string, en: string) => locale === "vi" ? vi || en : en || vi
    const state = query.error || query.data === null ? "failed" : query.data === undefined ? "pending" : query.data.phrases.length === 0 ? "empty" : "ready"
    return <_StudyTopicOverview state={state} props={{ title: detail ? localized(detail.nameVi, detail.nameEn) : t("fallbackTitle"), description: detail ? t("description", { level: detail.level.toUpperCase(), count: detail.phrases.length }) : "", backLabel: t("back"), startLabel: t("start"), loading: t("loading"), failed: t("failed"), empty: t("empty"), retry: t("retry"), phrases: (detail?.phrases ?? []).map((phrase) => ({ id: phrase.id, phrase: phrase.text, meaning: localized(phrase.meaningVi, phrase.meaningEn), example: phrase.example ?? undefined })) }} on={{ start: onStartPractice, back: onBack, retry: () => { void query.mutate() } }} />
}
/** Declares the connected Study topic block. */
export const meta = { shape: "block", world: "connected", domain: "study" } as const
