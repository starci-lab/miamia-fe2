import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { ProfileCvDocument } from "@/components/leaves/ProfileCvDocument"
import { createCompositeNode, createGrammarNode, createGrammarProjection, createLeafNode } from "@/components/contracts/props"

/** Public CV paper and explicit availability-state input. */
export type ProfilePublicCvPageProps = {
    readonly state: "pending" | "empty" | "uncompiled" | "ready" | "error"
    readonly props: { readonly label: string, readonly message: string, readonly title: string, readonly pdfUrl?: string, readonly editLabel: string, readonly retryLabel: string, readonly isSelf: boolean }
    readonly on?: { readonly edit?: () => void, readonly retry?: () => void }
}

const ReadyCv = (input: ProfilePublicCvPageProps) => <Grammar contract="profile-cv-page" render={createGrammarNode("profile-cv-page", {
    ...(input.props.isSelf ? { action: createLeafNode("button", {}, () => <Button props={{ label: input.props.editLabel, variant: "secondary", icon: "review" }} on={{ press: input.on?.edit }} />) } : {}),
    paper: createGrammarProjection("profile-cv-paper", () => (
        <SurfaceCard contract="profile-cv-paper" render={createGrammarNode("profile-cv-paper", {
            document: createLeafNode("profile-cv-document", {}, () => <ProfileCvDocument props={{ title: input.props.title, src: input.props.pdfUrl }} isLoading={input.state === "pending"} />),
        })} />
    )),
})} />

const noticeActionLabel = (input: ProfilePublicCvPageProps) => {
    if (input.state === "error") return input.props.retryLabel
    return input.props.isSelf ? input.props.editLabel : undefined
}

const CvNotice = (input: ProfilePublicCvPageProps) => <Grammar contract="empty-notice-card" render={createGrammarNode("empty-notice-card", {
    notice: createCompositeNode("empty-notice", {}, () => <EmptyNotice props={{ icon: "review", message: input.props.message, actionLabel: noticeActionLabel(input) }} on={{ act: input.state === "error" ? input.on?.retry : input.on?.edit }} />),
})} />

/** Public CV parity: same paper while loading/ready and honest no-file, uncompiled and error outcomes. */
export const ProfilePublicCvPageBase = (input: ProfilePublicCvPageProps) => <Grammar contract="profile-main" render={createGrammarNode("profile-main", {
    section: [createGrammarProjection("label-row-over-card", () => <SurfaceCard props={{ label: input.props.label, isFrameless: true }} contract={input.state === "ready" || input.state === "pending" ? "profile-cv-page" : "empty-notice-card"} render={input.state === "ready" || input.state === "pending" ? createGrammarProjection("profile-cv-page", () => <ReadyCv {...input} />) : createGrammarProjection("empty-notice-card", () => <CvNotice {...input} />)} />)],
})} />

/** Source-level tier marker. */
export const meta = { world: "pure", domain: "profile" } as const
