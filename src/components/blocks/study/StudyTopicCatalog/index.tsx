"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryLearnTopicsSwr } from "@/hooks"
import { _StudyTopicCatalog } from "./component"

type StudyTopicCatalogConnectedProps = { readonly onOpenTopic: (slug: string) => void }
/** Resolves localized topic search and level filtering over the public payload. */
export const StudyTopicCatalog = ({ onOpenTopic }: StudyTopicCatalogConnectedProps) => {
    const t = useTranslations("miamia.study.catalog")
    const locale = useLocale()
    const query = useQueryLearnTopicsSwr()
    const source = query.data ?? []
    const [search, setSearch] = useState("")
    const [level, setLevel] = useState("all")
    const localized = (vi: string, en: string) => locale === "vi" ? vi || en : en || vi
    const topics = useMemo(() => source.filter((topic) => level === "all" || topic.level.toLowerCase() === level).filter((topic) => `${localized(topic.nameVi, topic.nameEn)} ${localized(topic.blurbVi, topic.blurbEn)} ${topic.level}`.toLowerCase().includes(search.trim().toLowerCase())), [source, level, search, locale])
    const failed = query.error !== undefined || query.data === null
    const state = failed ? "failed" : query.data === undefined ? "pending" : source.length === 0 ? "empty" : topics.length === 0 ? "filtered-empty" : "ready"
    const levels = [{ id: "all", label: t("all") }, ...[...new Set(source.map((topic) => topic.level.toLowerCase()))].sort().map((id) => ({ id, label: id.toUpperCase() }))]
    return <_StudyTopicCatalog state={state} props={{ title: t("title"), description: t("description"), searchLabel: t("searchLabel"), searchPlaceholder: t("searchPlaceholder"), clearLabel: t("clear"), filterLabel: t("filter"), selectedLevel: level, levels, topics: topics.map((topic) => ({ id: topic.id, slug: topic.slug, level: topic.level.toUpperCase(), title: localized(topic.nameVi, topic.nameEn), body: localized(topic.blurbVi, topic.blurbEn), fact: t("phraseCount", { count: topic.phraseCount }), actionLabel: t("open") })), empty: t("empty"), filteredEmpty: t("filteredEmpty"), failed: t("failed"), retry: t("retry") }} on={{ search: setSearch, selectLevel: setLevel, retry: () => { void query.mutate() }, ...Object.fromEntries(topics.map((topic) => [`open:${topic.id}`, () => onOpenTopic(topic.slug)])) }} />
}
/** Declares the connected Study catalogue block. */
export const meta = { shape: "block", world: "connected", domain: "study" } as const
