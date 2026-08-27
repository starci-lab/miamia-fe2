import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Input } from "@/components/leaves/Input"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"
import type { ProfileSolvedChallenge } from "@/modules/api/graphql/queries/types/profile-evidence"

/** Course-scoped submissions, filtering state and route outcomes. */
export type ProfileChallengeManagePageProps = { readonly state: "pending" | "ready" | "error"; readonly courseTitle?: string; readonly rows: ReadonlyArray<ProfileSolvedChallenge>; readonly query: string; readonly filterLabel: string; readonly on: { readonly back: () => void; readonly search: (value: string) => void; readonly filter: () => void; readonly select: (id: string) => void } }

/** Resolves the message shown when there is no submission evidence to list. */
const emptyEvidenceMessage = (state: ProfileChallengeManagePageProps["state"], query: string): string => {
    if (state === "error") return "Submissions couldn't be loaded."
    if (query) return "No submissions match this search."
    return "No passed submissions were found."
}

/** Draw the course proof header, toolbar and filtered joined submissions. */
export const ProfileChallengeManagePageBase = ({ state, courseTitle, rows, query, filterLabel, on }: ProfileChallengeManagePageProps) => {
    const displayed = state === "pending" ? Array.from({ length: 3 }, (_, index): ProfileSolvedChallenge => ({ id: `pending-${index}`, title: "", passedAt: "" })) : rows
    return <Grammar contract="profile-main" render={createGrammarNode("profile-main", { section: [
        createGrammarProjection("label-row-over-card", () => <Grammar contract="profile-proof-summary" render={createGrammarNode("profile-proof-summary", {
            back: createLeafNode("button", {}, () => <Button props={{ label: "← Challenges", variant: "ghost", size: "sm" }} on={{ press: on.back }} />),
            title: createLeafNode("heading", {}, () => <Heading props={{ content: state === "error" ? "Submissions couldn't be loaded" : `${courseTitle ?? "Course"} submissions`, level: 2 }} isLoading={state === "pending"} />),
            meta: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: "Search and filter passed work in this course.", size: "sm", tone: "muted" }} isLoading={state === "pending"} />),
        })} />),
        createGrammarProjection("label-row-over-card", () => <Grammar contract="profile-detail-toolbar" render={createGrammarNode("profile-detail-toolbar", {
            search: createLeafNode("input", {}, () => <Input props={{ id: "challenge-submission-search", name: "challenge-submission-search", placeholder: "Search submissions", defaultValue: query }} on={{ change: on.search }} />),
            filter: createLeafNode("button", {}, () => <Button props={{ label: filterLabel, variant: "outline", size: "sm" }} on={{ press: on.filter }} />),
            fact: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: `${rows.length} found`, size: "sm", tone: "muted" }} />),
        })} />),
        createGrammarProjection("label-row-over-card", () => <SurfaceCard props={{ label: `${rows.length} passed submissions` }} contract="profile-evidence-list" render={createGrammarNode("profile-evidence-list", {
            evidence: displayed.length > 0 ? displayed.map((submission) => createCompositeNode("evidence-row", {}, () => <EvidenceRow props={{ title: submission.title, subtitle: [submission.selectedLang, submission.difficulty, submission.passedAt].filter(Boolean).join(" · "), fact: submission.score == null ? undefined : String(submission.score), factTone: "success", isPressable: true }} on={{ press: () => on.select(submission.id) }} isLoading={state === "pending"} />)) : [createCompositeNode("evidence-row", {}, () => <EvidenceRow props={{ title: emptyEvidenceMessage(state, query) }} />)],
        })} />),
    ] })} />
}
/** Source-level tier marker. */
export const meta = { world: "pure", domain: "profile" } as const
