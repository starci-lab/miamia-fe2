import { Tree } from "@/components/branches/Tree"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { LearnerProgressSnapshot, type LearnerProgressSnapshotProps } from "@/components/blocks/profile/learner/LearnerProgressSnapshot/component"
import { LearnerWrappedSummary, type LearnerWrappedSummaryProps } from "@/components/blocks/profile/learner/LearnerWrappedSummary/component"
import { ProfileViewSwitch, type ProfileView } from "@/components/blocks/profile/learner/ProfileViewSwitch/component"
import { defineCompositeComponent, defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"

/** Audience, evidence and actions consumed by the pure learner overview page. */
export type ProfileOverviewPageProps = {
    readonly state: "owner" | "visitor"
    readonly props: {
        readonly selectedView: ProfileView
        readonly switchLabels: { readonly label: string; readonly privateLabel: string; readonly publicLabel: string }
        readonly progress: LearnerProgressSnapshotProps
        readonly wrapped: LearnerWrappedSummaryProps
        readonly publicMessage: string
        readonly publicDescription: string
    }
    readonly on?: { readonly selectView?: (view: ProfileView) => void; readonly retryProgress?: () => void; readonly openWrapped?: () => void }
}

/** Pure learner overview with an owner-only evidence branch and truthful public preview. */
export const ProfileOverviewPageBase = (input: ProfileOverviewPageProps) => {
    const privateView = input.state === "owner" && input.props.selectedView === "private"
    return (
        <Tree contract="learner-profile-overview" render={defineContractComponent("learner-profile-overview", {
            ...(input.state === "owner" ? { view: defineLeafComponent("choice-tabs", {}, () => <ProfileViewSwitch props={{ ...input.props.switchLabels, selectedView: input.props.selectedView }} on={{ select: input.on?.selectView }} />) } : {}),
            ...(privateView ? {
                progress: defineContractProjection("learner-progress-snapshot", () => <LearnerProgressSnapshot {...input.props.progress} on={{ retry: input.on?.retryProgress }} />),
                wrapped: defineContractProjection("learner-wrapped-summary", () => <LearnerWrappedSummary {...input.props.wrapped} on={{ action: input.on?.openWrapped }} />),
            } : {
                public: defineContractProjection("centred-empty-notice", () => (
                    <Tree contract="centred-empty-notice" render={defineContractComponent("centred-empty-notice", { notice: defineCompositeComponent("empty-notice", {}, () => <EmptyNotice props={{ message: input.props.publicMessage, description: input.props.publicDescription }} />) })} />
                )),
            }),
        })} />
    )
}

/** Source-level page marker. */
export const meta = { world: "pure", domain: "profile" } as const
