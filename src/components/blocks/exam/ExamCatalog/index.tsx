"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryExamProgramsSwr } from "@/hooks/swr/useQueryExamProgramsSwr"
import { useQueryPapersSwr } from "@/hooks/swr/useQueryPapersSwr"
import type { PaperSummary } from "@/modules/api/graphql/queries/types/exam"
import { _ExamCatalog } from "./component"

const PAGE_SIZE = 12
/** Navigation and entitlement intents owned by the catalogue page. */
export type ExamCatalogConnectedProps = { readonly onOpenPaper: (slug: string) => void; readonly onRequestPremium: () => void }

/** Load real programs and papers into the catalogue presentation. */
export const ExamCatalog = (input: ExamCatalogConnectedProps) => {
    const t = useTranslations("miamia.exam.catalog")
    const locale = useLocale()
    const programs = useQueryExamProgramsSwr()
    const papers = useQueryPapersSwr()
    const [collection, setCollection] = useState("free")
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const localized = (vi?: string | null, en?: string | null, fallback = "") => (locale === "vi" ? vi || en : en || vi) || fallback
    const collections = useMemo(() => [
        { id: "free", label: t("free"), count: (papers.data ?? []).filter((paper) => !paper.isLocked).length },
        ...(programs.data ?? []).slice().sort((a, b) => a.sortIndex - b.sortIndex).map((program) => ({ id: program.slug, label: localized(program.nameVi, program.nameEn, program.slug.toUpperCase()), count: (papers.data ?? []).filter((paper) => paper.programSlug === program.slug).length })),
    ], [papers.data, programs.data, t, locale])
    useEffect(() => { if (!collections.some((item) => item.id === collection)) setCollection("free") }, [collection, collections])
    const selected = collections.find((item) => item.id === collection) ?? collections[0] ?? { id: "free", label: t("free"), count: 0 }
    const filtered = (papers.data ?? []).filter((paper) => collection === "free" ? !paper.isLocked : paper.programSlug === collection).filter((paper) => localized(paper.titleVi, paper.titleEn, paper.slug).toLowerCase().includes(query.trim().toLowerCase()))
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const failed = programs.error !== undefined || papers.error !== undefined || programs.data === null || papers.data === null
    const loading = !failed && (programs.data === undefined || papers.data === undefined)
    const cardOf = (paper: PaperSummary) => ({ id: paper.id, title: localized(paper.titleVi, paper.titleEn, paper.slug), description: localized(paper.descriptionVi, paper.descriptionEn) || undefined, level: paper.level, questionCount: paper.questionCount, levelLabel: t("level"), questionCountLabel: t("questionCount"), badgeLabel: paper.isLocked ? t("premium") : paper.isDemo ? t("demo") : t("open"), actionLabel: paper.isLocked ? t("unlock") : t("start"), isLocked: paper.isLocked })
    return <_ExamCatalog
        state={failed ? "failed" : loading ? "loading" : shown.length === 0 ? "empty" : "ready"}
        props={{ title: t("title"), description: t("description"), premiumTitle: t("premiumTitle"), premiumBody: t("premiumBody"), premiumAction: t("premiumAction"), searchLabel: t("searchLabel"), searchPlaceholder: t("searchPlaceholder"), searchClearLabel: t("searchClear"), collectionLabel: t("collectionLabel"), selectedCollectionId: selected.id, collections, sectionTitle: selected.label, countLabel: t("count", { count: filtered.length }), papers: shown.map(cardOf), page, totalPages: pageCount, pageLabel: t("pageLabel"), previousLabel: t("previous"), nextLabel: t("next"), emptyMessage: t("empty"), failedMessage: t("failed"), retryLabel: t("retry") }}
        on={{ search: (value) => { setQuery(value); setPage(1) }, selectCollection: (id) => { setCollection(id); setPage(1) }, changePage: setPage, requestPremium: input.onRequestPremium, retry: () => { void programs.mutate(); void papers.mutate() }, ...Object.fromEntries(shown.map((paper) => [`open:${paper.id}`, () => paper.isLocked ? input.onRequestPremium() : input.onOpenPaper(paper.slug)])) }}
    />
}

/** Source-level block marker. */
export const meta = { shape: "block", world: "connected", domain: "exam" } as const
