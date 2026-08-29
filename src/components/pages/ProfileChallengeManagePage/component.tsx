import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Input } from "@/components/leaves/Input"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"
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
    return <Grammar layout="profile-main" render={layoutNode("profile-main", { section: [
        layoutContent("label-row-over-card", () => <Grammar layout="profile-proof-summary" render={layoutNode("profile-proof-summary", {
            back: renderLeaf("button", {}, () => <Button props={{ label: "← Challenges", variant: "ghost", size: "sm" }} on={{ press: on.back }} />),
            title: renderLeaf("heading", {}, () => <Heading props={{ content: state === "error" ? "Submissions couldn't be loaded" : `${courseTitle ?? "Course"} submissions`, level: 2 }} isLoading={state === "pending"} />),
            meta: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: "Search and filter passed work in this course.", size: "sm", tone: "muted" }} isLoading={state === "pending"} />),
        })} />),
        layoutContent("label-row-over-card", () => <Grammar layout="profile-detail-toolbar" render={layoutNode("profile-detail-toolbar", {
            search: renderLeaf("input", {}, () => <Input props={{ id: "challenge-submission-search", name: "challenge-submission-search", placeholder: "Search submissions", defaultValue: query }} on={{ change: on.search }} />),
            filter: renderLeaf("button", {}, () => <Button props={{ label: filterLabel, variant: "outline", size: "sm" }} on={{ press: on.filter }} />),
            fact: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: `${rows.length} found`, size: "sm", tone: "muted" }} />),
        })} />),
        layoutContent("label-row-over-card", () => <SurfaceCard props={{ label: `${rows.length} passed submissions` }} layout="profile-evidence-list" render={layoutNode("profile-evidence-list", {
            evidence: displayed.length > 0 ? displayed.map((submission) => renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: submission.title, subtitle: [submission.selectedLang, submission.difficulty, submission.passedAt].filter(Boolean).join(" · "), fact: submission.score == null ? undefined : String(submission.score), factTone: "success", isPressable: true }} on={{ press: () => on.select(submission.id) }} isLoading={state === "pending"} />)) : [renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: emptyEvidenceMessage(state, query) }} />)],
        })} />),
    ] })} />
}
/** Source-level tier marker. */
