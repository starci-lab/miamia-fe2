import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { ProfileMetric } from "@/components/composites/ProfileMetric"
import { ProfileSegment } from "@/components/composites/ProfileSegment"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { SearchBox } from "@/components/leaves/SearchBox"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"
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
    return <SurfaceCard props={{ label: "Coding metrics" }} contract="profile-metric-ribbon" render={createGrammarNode("profile-metric-ribbon", {
        metric: metrics.map((metric) => createCompositeNode("profile-metric", {}, () => <ProfileMetric props={metric} isLoading={input.state === "pending"} />)),
    })} />
}

const Breakdown = ({ label, items, chips, loading }: BreakdownProps) => (
    <Grammar contract="profile-breakdown" render={createGrammarNode("profile-breakdown", {
        label: createLeafNode("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: label, size: "sm", weight: "semibold" }} isLoading={loading} />),
        visual: chips
            ? createGrammarNode("profile-topic-chip-run", {
                topic: (loading ? Array.from({ length: 4 }, (_, index) => ({ key: String(index), solved: 0 })) : items).map((item) => createLeafNode("badge", {}, () => <Badge props={{ content: loading ? "" : `${item.key} ${item.solved}`, tone: "neutral" }} isLoading={loading} />)),
            })
            : createGrammarNode("profile-segment-run", {
                segment: (loading ? Array.from({ length: 3 }, (_, index) => ({ key: String(index), solved: 0 })) : items).map((item) => createCompositeNode("profile-segment", {}, () => <ProfileSegment props={{ label: loading ? "" : `${item.key} ${item.solved}` }} isLoading={loading} />)),
            }),
    })} />
)

const ProfileStats = (input: ProfileSkillsPageProps) => <SurfaceCard props={{ label: "Stats" }} contract="profile-breakdown-stack" render={createGrammarNode("profile-breakdown-stack", {
    breakdown: [
        createGrammarProjection("profile-breakdown", () => <Breakdown label="By difficulty" items={input.props.byDifficulty} loading={input.state === "pending"} />),
        createGrammarProjection("profile-breakdown", () => <Breakdown label="By topic" items={input.props.byDomain} chips loading={input.state === "pending"} />),
        createGrammarProjection("profile-breakdown", () => <Breakdown label="By language" items={input.props.byLanguage} loading={input.state === "pending"} />),
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
    return <SurfaceCard props={{ label: "Solve history", fact: input.state === "ready" ? `${rows.length} results` : undefined }} contract="profile-toolbar-over-list" render={createGrammarNode("profile-toolbar-over-list", {
        toolbar: createGrammarNode("profile-search-filter-row", {
            search: createLeafNode("search-box", {}, () => <SearchBox props={{ label: "Search solve history", placeholder: "Search solved problems", clearLabel: "Clear search" }} on={{ search: input.on?.search }} />),
            filter: createLeafNode("button", {}, () => <Button props={{ label: input.props.filterLabel, size: "sm" }} on={{ press: input.on?.filter }} />),
        }),
        list: createGrammarNode("profile-evidence-list", {
            evidence: rows.map((row) => createCompositeNode("evidence-row", {}, () => <EvidenceRow props={{ title: row.problemTitle, subtitle: [row.firstSolvedAt, row.domain, row.languages.join(" · ")].filter(Boolean).join(" · "), fact: row.difficulty ?? undefined, factTone: difficultyTone(row.difficulty), isPressable: input.state === "ready" }} on={{ press: () => input.on?.select?.(row.slug) }} isLoading={input.state === "pending"} />)),
        }),
    })} />
}

/** Dedicated legacy coding anatomy: metric ribbon, gathered breakdowns, then searchable history. */
export const ProfileSkillsPageBase = (input: ProfileSkillsPageProps) => <Grammar contract="profile-main" render={createGrammarNode("profile-main", {
    section: [
        createGrammarProjection("label-row-over-card", () => <ProfileMetrics {...input} />),
        createGrammarProjection("label-row-over-card", () => <ProfileStats {...input} />),
        createGrammarProjection("label-row-over-card", () => <ProfileHistory {...input} />),
    ],
})} />

/** Source-level tier marker. */
export const meta = { world: "pure", domain: "profile" } as const
