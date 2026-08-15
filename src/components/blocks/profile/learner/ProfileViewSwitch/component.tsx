import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"

/** Audience selected by the owner preview control. */
export type ProfileView = "private" | "public"
/** Resolved labels and action for the owner preview control. */
export type ProfileViewSwitchProps = {
    readonly props: { readonly label: string; readonly privateLabel: string; readonly publicLabel: string; readonly selectedView: ProfileView }
    readonly on?: { readonly select?: (view: ProfileView) => void }
}

/** Switches an owner between private learning evidence and their public preview. */
export const ProfileViewSwitch = (input: ProfileViewSwitchProps) => (
    <ChoiceTabs
        props={{ label: input.props.label, selectedKey: input.props.selectedView, variant: "primary", tabs: [{ id: "private", label: input.props.privateLabel }, { id: "public", label: input.props.publicLabel }] }}
        on={{ select: (key) => input.on?.select?.(key as ProfileView) }}
    />
)

/** Source-level block marker. */
export const meta = { shape: "block", world: "pure", domain: "profile" } as const
