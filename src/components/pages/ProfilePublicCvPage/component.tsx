import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Button } from "@/components/leaves/Button"
import { ProfileCvDocument } from "@/components/leaves/ProfileCvDocument"
import { renderComposite, layoutNode, layoutContent, renderLeaf } from "@/modules/types/layout"

/** Public CV paper and explicit availability-state input. */
export type ProfilePublicCvPageProps = {
    readonly state: "pending" | "empty" | "uncompiled" | "ready" | "error"
    readonly props: { readonly label: string, readonly message: string, readonly title: string, readonly pdfUrl?: string, readonly editLabel: string, readonly retryLabel: string, readonly isSelf: boolean }
    readonly on?: { readonly edit?: () => void, readonly retry?: () => void }
}

const ReadyCv = (input: ProfilePublicCvPageProps) => <Grammar layout="profile-cv-page" render={layoutNode("profile-cv-page", {
    ...(input.props.isSelf ? { action: renderLeaf("button", {}, () => <Button props={{ label: input.props.editLabel, variant: "secondary", icon: "review" }} on={{ press: input.on?.edit }} />) } : {}),
    paper: layoutContent("profile-cv-paper", () => (
        <SurfaceCard layout="profile-cv-paper" render={layoutNode("profile-cv-paper", {
            document: renderLeaf("profile-cv-document", {}, () => <ProfileCvDocument props={{ title: input.props.title, src: input.props.pdfUrl }} isLoading={input.state === "pending"} />),
        })} />
    )),
})} />

const noticeActionLabel = (input: ProfilePublicCvPageProps) => {
    if (input.state === "error") return input.props.retryLabel
    return input.props.isSelf ? input.props.editLabel : undefined
}

const CvNotice = (input: ProfilePublicCvPageProps) => <Grammar layout="empty-notice-card" render={layoutNode("empty-notice-card", {
    notice: renderComposite("empty-notice", {}, () => <EmptyNotice props={{ icon: "review", message: input.props.message, actionLabel: noticeActionLabel(input) }} on={{ act: input.state === "error" ? input.on?.retry : input.on?.edit }} />),
})} />

/** Public CV parity: same paper while loading/ready and honest no-file, uncompiled and error outcomes. */
export const ProfilePublicCvPageBase = (input: ProfilePublicCvPageProps) => <Grammar layout="profile-main" render={layoutNode("profile-main", {
    section: [layoutContent("label-row-over-card", () => <SurfaceCard props={{ label: input.props.label, isFrameless: true }} layout={input.state === "ready" || input.state === "pending" ? "profile-cv-page" : "empty-notice-card"} render={input.state === "ready" || input.state === "pending" ? layoutContent("profile-cv-page", () => <ReadyCv {...input} />) : layoutContent("empty-notice-card", () => <CvNotice {...input} />)} />)],
})} />

/** Source-level tier marker. */
