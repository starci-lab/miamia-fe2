import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EvidenceRow } from "@/components/composites/EvidenceRow"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Progress } from "@/components/leaves/Progress"
import { Text } from "@/components/leaves/Text"
import { createCompositeNode, createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"
import type { ProfileCapstone } from "@/modules/api/graphql/queries/types/profile-evidence"

/** One resolved capstone plus its projects-return outcome. */
export type ProfileProjectRoadmapPageProps = { readonly state: "pending" | "ready" | "error"; readonly project?: ProfileCapstone; readonly onBack: () => void }

/** The heading text: an error sentence, the loaded title, or nothing while resting. */
const deriveRoadmapTitle = (
    state: ProfileProjectRoadmapPageProps["state"],
    courseTitle: string | undefined,
): string | undefined => {
    if (state === "error") return "Capstone couldn't be loaded"
    if (courseTitle !== undefined) return courseTitle
    if (state === "pending") return undefined
    return "Capstone not found"
}

/** The meta line under the heading: the resolved counts, a not-public notice, or nothing. */
const deriveRoadmapMeta = (
    project: ProfileCapstone | undefined,
    state: ProfileProjectRoadmapPageProps["state"],
): string | undefined => {
    if (project) {
        return `${project.completedMilestones}/${project.totalMilestones} milestones · ${project.completedTasks}/${project.totalTasks} tasks · Verified by StarCi`
    }
    if (state === "ready") return "This capstone is not public."
    return undefined
}

/** Dedicated capstone detail: summary/progress remains above an ordered milestone roadmap. */
export const ProfileProjectRoadmapPageBase = ({ state, project, onBack }: ProfileProjectRoadmapPageProps) => {
    const value = Math.round((project?.completedTasks ?? 0) / Math.max(1, project?.totalTasks ?? 0) * 100)
    const milestones = state === "pending" ? Array.from({ length: 4 }, (_, index) => ({ milestoneGlobalId: `pending-${index}`, title: "", position: index, totalTasks: 0, passedTasks: 0, tasks: [] })) : project?.milestones ?? []
    return <Grammar contract="profile-main" render={createGrammarNode("profile-main", { section: [
        createGrammarProjection("label-row-over-card", () => (
            <Grammar contract="profile-proof-summary" render={createGrammarNode("profile-proof-summary", {
                back: createLeafNode("button", {}, () => <Button props={{ label: "← Projects", variant: "ghost", size: "sm" }} on={{ press: onBack }} />),
                title: createLeafNode("heading", {}, () => <Heading props={{ content: deriveRoadmapTitle(state, project?.courseTitle), level: 2 }} isLoading={state === "pending"} />),
                meta: createLeafNode("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: deriveRoadmapMeta(project, state), size: "sm", tone: "muted" }} isLoading={state === "pending"} />),
                ...(project || state === "pending" ? { progress: createLeafNode("progress", {}, () => <Progress props={{ value, label: "Capstone completion" }} isLoading={state === "pending"} />) } : {}),
            })} />
        )),
        createGrammarProjection("label-row-over-card", () => (
            <SurfaceCard props={{ label: "Roadmap" }} contract="profile-roadmap-list" render={createGrammarNode("profile-roadmap-list", {
                milestone: milestones.length > 0 ? milestones.map((milestone) => createCompositeNode("evidence-row", {}, () => <EvidenceRow props={{ title: milestone.title, subtitle: `${milestone.passedTasks}/${milestone.totalTasks} tasks passed`, fact: milestone.passedTasks === milestone.totalTasks && milestone.totalTasks > 0 ? "Passed" : `${Math.round(milestone.passedTasks / Math.max(1, milestone.totalTasks) * 100)}%`, factTone: milestone.passedTasks === milestone.totalTasks && milestone.totalTasks > 0 ? "success" : "accent" }} isLoading={state === "pending"} />)) : [createCompositeNode("evidence-row", {}, () => <EvidenceRow props={{ title: state === "error" ? "Roadmap couldn't be loaded." : "No public roadmap was found." }} />)],
            })} />
        )),
    ] })} />
}

/** Source-level tier marker. */
export const meta = { world: "pure", domain: "profile" } as const
