import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Link } from "@/components/leaves/Link"
import { Text } from "@/components/leaves/Text"
import { renderComposite, layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"

/** Public challenge detail projection with immutable proof, attempts and feedback. */
export type ChallengeDetail = { readonly id?: string; readonly title?: string; readonly submissionUrl?: string | null; readonly selectedLang?: string | null; readonly difficulty?: string | null; readonly score?: number | null; readonly courseTitle?: string | null; readonly passedAt?: string | null; readonly feedbacks?: ReadonlyArray<{ readonly message?: string; readonly detail?: string; readonly severity?: string; readonly suggestion?: string }>; readonly attempts?: ReadonlyArray<{ readonly attemptNumber?: number; readonly score?: number | null; readonly submissionUrl?: string | null; readonly shortFeedback?: string | null; readonly processedAt?: string | null }> }
/** One settled proof payload and course-return outcome. */
export type ProfileChallengeSubmissionPageProps = { readonly state: "pending" | "ready" | "error"; readonly detail?: ChallengeDetail | null; readonly onBack: () => void }

/** A load error beats a proof that resolved to nothing beats the real title once one exists. */
const resolveSummaryTitle = (state: ProfileChallengeSubmissionPageProps["state"], missing: boolean, title: string | undefined) => {
    if (state === "error") return "Challenge proof couldn't be loaded"
    if (missing) return "Challenge proof not found"
    return title
}

/** One immutable public proof: source URL, every attempt, then structured grading feedback. */
export const ProfileChallengeSubmissionPageBase = ({ state, detail, onBack }: ProfileChallengeSubmissionPageProps) => {
    const attempts: NonNullable<ChallengeDetail["attempts"]> = state === "pending" ? Array.from({ length: 3 }, (_, index) => ({ attemptNumber: index + 1 })) : detail?.attempts ?? []
    const feedbacks: NonNullable<ChallengeDetail["feedbacks"]> = state === "pending" ? Array.from({ length: 3 }, () => ({})) : detail?.feedbacks ?? []
    const missing = state === "ready" && !detail
    return <Grammar layout="profile-main" render={layoutNode("profile-main", { section: [
        layoutContent("label-row-over-card", () => <Grammar layout="profile-proof-summary" render={layoutNode("profile-proof-summary", {
            back: renderLeaf("button", {}, () => <Button props={{ label: `← ${detail?.courseTitle ?? "Challenges"}`, variant: "ghost", size: "sm" }} on={{ press: onBack }} />),
            title: renderLeaf("heading", {}, () => <Heading props={{ content: resolveSummaryTitle(state, missing, detail?.title), level: 2 }} isLoading={state === "pending"} />),
            meta: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: missing ? "This submission is not public." : [detail?.difficulty, detail?.selectedLang, detail?.score == null ? undefined : `score ${detail.score}`, detail?.passedAt].filter(Boolean).join(" · "), size: "sm", tone: "muted" }} isLoading={state === "pending"} />),
        })} />),
        ...(detail?.submissionUrl || state === "pending" ? [layoutContent("label-row-over-card", () => <SurfaceCard props={{ label: "Submitted proof" }} layout="profile-meta-list" render={layoutNode("profile-meta-list", {
            item: [renderLeaf("link", {}, () => <Link props={{ label: detail?.submissionUrl ?? "Loading proof", externalHref: detail?.submissionUrl ?? undefined }} isLoading={state === "pending"} />)],
        })} />)] : []),
        layoutContent("label-row-over-card", () => <SurfaceCard props={{ label: "Attempts" }} layout="profile-evidence-list" render={layoutNode("profile-evidence-list", {
            evidence: attempts.length > 0 ? attempts.map((attempt, index) => renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: `Attempt ${attempt.attemptNumber ?? index + 1}${index === 0 && (attempt.score ?? 0) > 0 ? " · Passed" : ""}`, subtitle: [attempt.processedAt, attempt.shortFeedback].filter(Boolean).join(" · "), fact: attempt.score == null ? undefined : String(attempt.score), factTone: (attempt.score ?? 0) >= 80 ? "success" : "neutral" }} isLoading={state === "pending"} />)) : [renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: "No public attempts were found." }} />)],
        })} />),
        layoutContent("label-row-over-card", () => <SurfaceCard props={{ label: "Structured feedback" }} layout="profile-evidence-list" render={layoutNode("profile-evidence-list", {
            evidence: feedbacks.length > 0 ? feedbacks.map((feedback, index) => renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: feedback.message ?? `Feedback ${index + 1}`, subtitle: feedback.detail ?? feedback.suggestion, fact: feedback.severity, factTone: feedback.severity?.toLowerCase().includes("strong") ? "success" : "warning" }} isLoading={state === "pending"} />)) : [renderComposite("evidence-row", {}, () => <EvidenceRow props={{ title: "No structured feedback was published." }} />)],
        })} />),
    ] })} />
}
/** Source-level tier marker. */
