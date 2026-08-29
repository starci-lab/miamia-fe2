import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { ProfileMetric } from "@/components/composites/ProfileMetric"
import { ProfileSegment } from "@/components/composites/ProfileSegment"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"
import type { ProfileBreakdown, ProfileCodingHistory } from "@/modules/api/graphql/queries/types/profile-evidence"

/** Settled coding metrics, breakdowns and solve-history input. */
export type ProfileSkillsPageProps = {
    readonly state: "pending" | "ready" | "error"
    readonly props: {
        readonly metrics: ReadonlyArray<{ readonly id: string, readonly value: string, readonly label: string }>
        readonly byDifficulty: ReadonlyArray<ProfileBreakdown>
        readonly byDomain: ReadonlyArray<ProfileBreakdown>
        readonly byLanguage: ReadonlyArray<ProfileBreakdown>
        readonly history: ReadonlyArray<ProfileCodingHistory>
        readonly filterLabel: string
    }
    readonly on?: { readonly search?: (query: string) => void, readonly filter?: () => void, readonly select?: (slug: string) => void }
}

type BreakdownProps = { readonly label: string, readonly items: ReadonlyArray<ProfileBreakdown>, readonly chips?: boolean, readonly loading: boolean }

const ProfileMetrics = (input: ProfileSkillsPageProps) => {
    const metrics = input.state === "pending" ? Array.from({ length: 4 }, (_, index) => ({ id: String(index), value: "", label: "" })) : input.props.metrics
    return <SurfaceCard props={{ label: "Coding metrics" }} layout="profile-metric-ribbon" render={layoutNode("profile-metric-ribbon", {
        metric: metrics.map((metric) => renderComposite("profile-metric", {}, () => <ProfileMetric props={metric} isLoading={input.state === "pending"} />)),
    })} />
}

const Breakdown = ({ label, items, chips, loading }: BreakdownProps) => (
    <Grammar layout="profile-breakdown" render={layoutNode("profile-breakdown", {
        label: renderLeaf("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: label, size: "sm", weight: "semibold" }} isLoading={loading} />),
        visual: chips
            ? layoutNode("profile-topic-chip-run", {
                topic: (loading ? Array.from({ length: 4 }, (_, index) => ({ key: String(index), solved: 0 })) : items).map((item) => renderLeaf("badge", {}, () => <Badge props={{ content: loading ? "" : `${item.key} ${item.solved}`, tone: "neutral" }} isLoading={loading} />)),
            })
            : layoutNode("profile-segment-run", {
                segment: (loading ? Array.from({ length: 3 }, (_, index) => ({ key: String(index), solved: 0 })) : items).map((item) => renderComposite("profile-segment", {}, () => <ProfileSegment props={{ label: loading ? "" : `${item.key} ${item.solved}` }} isLoading={loading} />)),
            }),
    })} />
)

const ProfileStats = (input: ProfileSkillsPageProps) => <SurfaceCard props={{ label: "Stats" }} layout="profile-breakdown-stack" render={layoutNode("profile-breakdown-stack", {
    breakdown: [
        layoutContent("profile-breakdown", () => <Breakdown label="By difficulty" items={input.props.byDifficulty} loading={input.state === "pending"} />),
        layoutContent("profile-breakdown", () => <Breakdown label="By topic" items={input.props.byDomain} chips loading={input.state === "pending"} />),
        layoutContent("profile-breakdown", () => <Breakdown label="By language" items={input.props.byLanguage} loading={input.state === "pending"} />),
    ],
})} />

/** The evidence row's fact tone: harder problems read as a stronger warning colour. */
const difficultyTone = (difficulty: string | null | undefined): "danger" | "warning" | "success" => {
    if (difficulty === "hard") return "danger"
    if (difficulty === "medium") return "warning"
    return "success"
}

const ProfileHistory = (input: ProfileSkillsPageProps) => {
    const rows = input.state === "pending" ? Array.from({ length: 3 }, (_, index): ProfileCodingHistory => ({ problemTitle: "", slug: `pending-${index}`, languages: [], firstSolvedAt: "" })) : input.props.history
    return <SurfaceCard props={{ label: "Solve history", fact: input.state === "ready" ? `${rows.length} results` : undefined }} layout="profile-toolbar-over-list" render={layoutNode("profile-toolbar-over-list", {
        toolbar: layoutNode("profile-search-filter-row", {
            search: renderLeaf("search-box", {}, () => <SearchBox props={{ label: "Search solve history", placeholder: "Search solved problems", clearLabel: "Clear search" }} on={{ search: input.on?.search }} />),
            filter: renderLeaf("button", {}, () => <Button props={{ label: input.props.filterLabel, size: "sm" }} on={{ press: input.on?.filter }} />),
        }),
        list: layoutNode("profile-evidence-list", {
            evidence: rows.map((row) => renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: row.problemTitle, subtitle: [row.firstSolvedAt, row.domain, row.languages.join(" · ")].filter(Boolean).join(" · "), fact: row.difficulty ?? undefined, factTone: difficultyTone(row.difficulty), isPressable: input.state === "ready" }} on={{ press: () => input.on?.select?.(row.slug) }} isLoading={input.state === "pending"} />)),
        }),
    })} />
}

/** Dedicated legacy coding anatomy: metric ribbon, gathered breakdowns, then searchable history. */
export const ProfileSkillsPageBase = (input: ProfileSkillsPageProps) => <Grammar layout="profile-main" render={layoutNode("profile-main", {
    section: [
        layoutContent("label-row-over-card", () => <ProfileMetrics {...input} />),
        layoutContent("label-row-over-card", () => <ProfileStats {...input} />),
        layoutContent("label-row-over-card", () => <ProfileHistory {...input} />),
    ],
})} />

/** Source-level tier marker. */
