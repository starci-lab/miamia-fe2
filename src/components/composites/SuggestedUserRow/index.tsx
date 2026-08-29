import { Avatar } from "@/components/leaves/Avatar"
import { Grammar } from "@/components/layouts/Grammar"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Text } from "@/components/leaves/Text"
import { TextLink } from "@/components/leaves/TextLink"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** Resolved identity, qualification and follow state for one suggested person. */
export type SuggestedUserRowData = {
    readonly id: string
    readonly name?: string
    readonly username?: string
    readonly avatar?: string
    readonly openToWork?: boolean
    readonly openToWorkLabel?: string
    readonly followLabel: string
    readonly followingLabel: string
    readonly isFollowing?: boolean
    readonly isPending?: boolean
}
/** Product journeys reported by a suggested-person row. */
export type SuggestedUserRowActions = { readonly open?: () => void; readonly follow?: () => void }
/** Props for the closed suggested-person composition. */
export type SuggestedUserRowProps = CompositeProps<SuggestedUserRowData, SuggestedUserRowActions>

/** Draw one suggested identity with its optional badge and follow action. */
export const SuggestedUserRow = ({ props, on, isLoading = false }: SuggestedUserRowProps) => {
    const identity = layoutNode("name-over-handle", {
        name: renderLeaf("text-link", { size: "sm" }, () => (
            <TextLink props={{ label: props.name ?? "", size: "sm" }} on={{ press: on?.open }} />
        )),
        handle: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: props.username, size: "xs", tone: "muted" }} isLoading={isLoading} />
        )),
    })

    return (
        <Grammar layout="avatar-identity-badge-action-row" render={layoutNode("avatar-identity-badge-action-row", {
            avatar: renderLeaf("avatar", {}, () => (
                <Avatar props={{ name: props.name, src: props.avatar, size: "sm" }} isLoading={isLoading} />
            )),
            identity,
            ...(props.openToWork === true ? {
                badge: renderLeaf("badge", {}, () => (
                    <Badge props={{ content: props.openToWorkLabel, tone: "success" }} />
                )),
            } : {}),
            action: renderLeaf("button", {}, () => (
                <Button
                    props={{
                        label: props.isFollowing === true ? props.followingLabel : props.followLabel,
                        size: "sm",
                        variant: "secondary",
                        isPending: props.isPending,
                    }}
                    on={{ press: props.isFollowing === true ? undefined : on?.follow }}
                    isLoading={isLoading}
                />
            )),
        })} />
    )
}

/** Source-level tier marker for the pure suggested-person composition. */
