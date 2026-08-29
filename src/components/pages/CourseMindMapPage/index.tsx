"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useQueryCourseMindMapSwr } from "@/hooks/swr/useQueryCourseMindMapSwr"
import type { MindMapLink, MindMapNode } from "@/modules/api/graphql/queries/query-course-mind-map"
import { CourseMindMapPageBase as CourseMindMapPageView, type CourseMindMapNodeView, type CourseMindMapPageState } from "./component"

/** Course route identity consumed by the connected concept map. */
export type CourseMindMapPageProps = { readonly displayId: string }

type NavigableMindMapTarget = Pick<MindMapLink, "kind" | "entityId" | "moduleId">

const destinationFor = (displayId: string, target: NavigableMindMapTarget): string | null => {
    if (target.kind === "course") return `/courses/${displayId}/learn`
    if (target.kind === "module" && target.entityId !== null) return `/courses/${displayId}/learn/content/modules/${target.entityId}`
    if (target.kind === "lesson" && target.moduleId !== null && target.entityId !== null) return `/courses/${displayId}/learn/content/modules/${target.moduleId}/contents/${target.entityId}`
    if (target.kind === "milestone") return `/courses/${displayId}/learn/personal-project`
    if (target.kind === "flashcard") return `/courses/${displayId}/learn/flashcards/review`
    if (target.kind === "interview") return `/courses/${displayId}/learn/mock-interview`
    return null
}

const targetFor = (displayId: string, node: MindMapNode): string | null => {
    const own = destinationFor(displayId, node.data)
    if (own !== null) return own
    for (const link of node.data.links) {
        const linked = destinationFor(displayId, link)
        if (linked !== null) return linked
    }
    return null
}

/** Inputs that decide which single situation the mind map page is in. */
type MindMapStateInput = {
    readonly hasFailed: boolean
    readonly isLoading: boolean
    readonly hasNoNodes: boolean
}

/** Resolves the single situation the mind map page is in, in the priority order the page decided on. */
const resolveMindMapState = (input: MindMapStateInput): CourseMindMapPageState => {
    if (input.hasFailed) return "failed"
    if (input.isLoading) return "pending"
    if (input.hasNoNodes) return "empty"
    return "ready"
}

/** Connect search and selection to the backend-computed graph without inventing nodes. */
export const CourseMindMapPage = ({ displayId }: CourseMindMapPageProps) => {
    const t = useTranslations("learn.mindMap")
    const router = useRouter()
    const graph = useQueryCourseMindMapSwr(displayId)
    const [query, setQuery] = useState("")
    const [selectedId, setSelectedId] = useState<string>()
    const allNodes = graph.data?.nodes ?? []
    const visibleNodes = useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase()
        return normalized.length === 0
            ? allNodes
            : allNodes.filter((node) => `${node.data.label} ${node.data.desc ?? ""}`.toLocaleLowerCase().includes(normalized))
    }, [allNodes, query])
    const bounds = useMemo(() => {
        const xs = visibleNodes.map((node) => node.position.x)
        const ys = visibleNodes.map((node) => node.position.y)
        return { minX: Math.min(...xs, 0), maxX: Math.max(...xs, 1), minY: Math.min(...ys, 0), maxY: Math.max(...ys, 1) }
    }, [visibleNodes])
    const nodes = useMemo<ReadonlyArray<CourseMindMapNodeView>>(() => visibleNodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        detail: node.data.desc ?? node.data.popularity ?? undefined,
        left: 8 + ((node.position.x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX)) * 84,
        top: 10 + ((node.position.y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY)) * 80,
        canOpen: targetFor(displayId, node) !== null,
    })), [bounds, displayId, visibleNodes])
    const activeId = selectedId !== undefined && nodes.some((node) => node.id === selectedId) ? selectedId : nodes[0]?.id
    const state: CourseMindMapPageState = resolveMindMapState({
        hasFailed: graph.error !== undefined,
        isLoading: graph.data === undefined,
        hasNoNodes: allNodes.length === 0,
    })

    return (
        <CourseMindMapPageView
            state={state}
            props={{
                title: t("title"),
                description: t("description"),
                searchLabel: t("searchLabel"),
                searchPlaceholder: t("searchPlaceholder"),
                clearSearchLabel: t("clearSearch"),
                emptyText: t("empty"),
                noResultsText: t("noResults"),
                failedText: t("failed"),
                retryLabel: t("retry"),
                openLabel: t("open"),
                graphFact: t("connections", { count: graph.data?.edges.length ?? 0 }),
                nodes,
                selectedId: activeId,
            }}
            on={{
                search: setQuery,
                select: setSelectedId,
                openContent: (id) => {
                    const node = allNodes.find((item) => item.id === id)
                    if (node === undefined) return
                    const destination = targetFor(displayId, node)
                    if (destination !== null) router.push(destination)
                },
                retry: () => { void graph.mutate() },
            }}
        />
    )
}

/** Source-level ownership marker. */
