import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"

/** Public coding problem and accepted-submission payload. */
export type CodingDetail = {
    readonly problem?: { readonly title: string, readonly statement?: string | null, readonly difficulty: string, readonly domain: string, readonly tags: ReadonlyArray<string> } | null
    readonly submission?: { readonly languages: ReadonlyArray<string>, readonly verdict: string, readonly passedCount: number, readonly totalCount: number, readonly firstSolvedAt?: string | null } | null
}
/** Settled coding-proof route input. */
export type ProfileCodingProblemPageProps = { readonly state: "pending" | "ready" | "error", readonly detail?: CodingDetail | null, readonly on: { readonly back: () => void, readonly retry: () => void } }

/** Legacy coding proof: statement and accepted-submission summary; never invent source code absent from the API. */
export const ProfileCodingProblemPageBase = ({ state, detail, on }: ProfileCodingProblemPageProps) => {
    const problem = detail?.problem
    const submission = detail?.submission
    const loading = state === "pending"
    const header = layoutNode("profile-proof-header", {
        back: renderLeaf("button", {}, () => <Button props={{ label: "← Solve history", variant: "ghost", size: "sm" }} on={{ press: on.back }} />),
        title: renderLeaf("heading", {}, () => <Heading props={{ content: problem?.title ?? (state === "error" ? "Coding proof unavailable" : "Coding problem"), level: 2 }} isLoading={loading} />),
        meta: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: problem ? [problem.difficulty, problem.domain].join(" · ") : "", size: "sm", tone: "muted" }} isLoading={loading} />),
    })
    const statement = <SurfaceCard props={{ label: "Problem statement" }} layout="profile-coding-statement" render={layoutNode("profile-coding-statement", {
        statement: renderLeaf("text", {}, () => <Text props={{ content: state === "error" ? "This proof couldn't be loaded." : problem?.statement ?? "No public coding proof was found." }} isLoading={loading} />),
        ...(problem?.tags.length ? { tags: layoutNode("profile-topic-chip-run", { topic: problem.tags.map((tag) => renderLeaf("badge", {}, () => <Badge props={{ content: tag }} />)) }) } : {}),
    })} />
    const resolveEvidenceRows = () => {
        if (loading) return Array.from({ length: 2 }, (_, index) => ({ id: String(index), title: "", subtitle: "", fact: "" }))
        if (submission) return [
            { id: "verdict", title: submission.languages.join(" · "), subtitle: submission.firstSolvedAt ?? undefined, fact: submission.verdict },
            { id: "tests", title: "Test cases", subtitle: "Accepted submission", fact: `${submission.passedCount}/${submission.totalCount}` },
        ]
        return [{ id: "empty", title: "No accepted submission", subtitle: "This learner has not published solved evidence for this problem.", fact: undefined }]
    }
    const evidenceRows = resolveEvidenceRows()
    const evidence = <SurfaceCard props={{ label: "Submission" }} layout="profile-evidence-list" render={layoutNode("profile-evidence-list", {
        evidence: evidenceRows.map((row) => renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: row.title, subtitle: row.subtitle, fact: row.fact, factTone: row.id === "verdict" ? "success" : "neutral" }} isLoading={loading} />)),
    })} />
    return <Grammar layout="profile-coding-detail-main" render={layoutNode("profile-coding-detail-main", {
        header,
        section: [
            layoutContent("label-row-over-card", () => state === "error" ? <SurfaceCard props={{ label: "Problem statement", seeMoreLabel: "Try again" }} on={{ seeMore: on.retry }} layout="profile-coding-statement" render={layoutNode("profile-coding-statement", { statement: renderLeaf("text", {}, () => <Text props={{ content: "This proof couldn't be loaded." }} />) })} /> : statement),
            layoutContent("label-row-over-card", () => evidence),
        ] })} />
}

/** Other details remain delegated while sibling agents port their strict legacy anatomy. */
export type ProfileDetailKind = "project" | "challenge-course" | "challenge-proof"
/** Source-level tier marker. */
