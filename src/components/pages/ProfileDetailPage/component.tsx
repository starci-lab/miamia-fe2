import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"

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
    const header = createGrammarNode("profile-proof-header", {
        back: createLeafNode("button", {}, () => <Button props={{ label: "← Solve history", variant: "ghost", size: "sm" }} on={{ press: on.back }} />),
        title: createLeafNode("heading", {}, () => <Heading props={{ content: problem?.title ?? (state === "error" ? "Coding proof unavailable" : "Coding problem"), level: 2 }} isLoading={loading} />),
        meta: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: problem ? [problem.difficulty, problem.domain].join(" · ") : "", size: "sm", tone: "muted" }} isLoading={loading} />),
    })
    const statement = <SurfaceCard props={{ label: "Problem statement" }} contract="profile-coding-statement" render={createGrammarNode("profile-coding-statement", {
        statement: createLeafNode("text", {}, () => <Text props={{ content: state === "error" ? "This proof couldn't be loaded." : problem?.statement ?? "No public coding proof was found." }} isLoading={loading} />),
        ...(problem?.tags.length ? { tags: createGrammarNode("profile-topic-chip-run", { topic: problem.tags.map((tag) => createLeafNode("badge", {}, () => <Badge props={{ content: tag }} />)) }) } : {}),
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
    const evidence = <SurfaceCard props={{ label: "Submission" }} contract="profile-evidence-list" render={createGrammarNode("profile-evidence-list", {
        evidence: evidenceRows.map((row) => createCompositeNode("evidence-row", {}, () => <EvidenceRow props={{ title: row.title, subtitle: row.subtitle, fact: row.fact, factTone: row.id === "verdict" ? "success" : "neutral" }} isLoading={loading} />)),
    })} />
    return <Grammar contract="profile-coding-detail-main" render={createGrammarNode("profile-coding-detail-main", {
        header,
        section: [
            createGrammarProjection("label-row-over-card", () => state === "error" ? <SurfaceCard props={{ label: "Problem statement", seeMoreLabel: "Try again" }} on={{ seeMore: on.retry }} contract="profile-coding-statement" render={createGrammarNode("profile-coding-statement", { statement: createLeafNode("text", {}, () => <Text props={{ content: "This proof couldn't be loaded." }} />) })} /> : statement),
            createGrammarProjection("label-row-over-card", () => evidence),
        ] })} />
}

/** Other details remain delegated while sibling agents port their strict legacy anatomy. */
export type ProfileDetailKind = "project" | "challenge-course" | "challenge-proof"
/** Source-level tier marker. */
export const meta = { world: "pure", domain: "profile" } as const
