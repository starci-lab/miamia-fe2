import { IconTile } from "@/components/leaves/IconTile"
import { Text } from "@/components/leaves/Text"
import { Button } from "@/components/leaves/Button"
import type { IconName } from "@/components/leaves/Icon"
import type { CompositeProps } from "@/modules/types/layout"
import { Grammar } from "@/components/layouts/Grammar"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/**
 * COMPOSITE - `EmptyNotice`: what a region says when it settled with nothing in it.
 *
 * A fixed composition, and the same one everywhere. An empty list, an empty feed and an empty rail all
 * say the same three things in the same order - a mark, a sentence, a way out - so this is written
 * once and every block that settles empty reaches for it. A block minting its own would differ
 * from its neighbours by accident rather than by decision.
 *
 * THE WAY OUT IS PART OF IT. An empty region that only apologises leaves the reader nowhere to go,
 * so the recovery action belongs to this leaf rather than to something a caller remembers to add.
 *
 * IT NEVER RESTS. An empty state IS a settled answer - the block picks a different Grammar while it
 * is still loading, and picks this one only once it knows.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type EmptyNoticeData = {
    /** An optional generic mark, present only when the source design gives the absence one. */
    readonly icon?: IconName
    /** The already-resolved sentence. What settled with nothing, in the reader's words. */
    readonly message: string
    /** Supporting detail, when the settled outcome needs one smaller explanatory sentence. */
    readonly description?: string
    /** The already-resolved label of the way out, when there is one. */
    readonly actionLabel?: string
}

/** What the way out does. */
export type EmptyNoticeActions = {
    /** Called when the reader takes the way out. */
    readonly act?: () => void
}

/** Props for {@link EmptyNotice}. */
export type EmptyNoticeProps = CompositeProps<EmptyNoticeData, EmptyNoticeActions>

/**
 * Draw an empty region's answer.
 *
 * @param input - {@link EmptyNoticeProps}
 */
export const EmptyNotice = ({ props, on }: EmptyNoticeProps) => {
    const icon = props.icon
    const content = layoutNode("empty-notice-stack", {
        mark: icon === undefined ? undefined : renderLeaf("icon-tile", {}, () => (
            <IconTile props={{ icon, tone: "neutral", size: "md" }} />
        )),
        message: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: props.message, tone: "muted", size: "sm" }} />),
        description: props.description === undefined ? undefined : renderLeaf("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: props.description, tone: "muted", size: "xs" }} />
        )),
        action: props.actionLabel === undefined ? undefined : renderLeaf("button", {}, () => (
            <Button props={{ label: props.actionLabel ?? "", variant: "secondary", size: "sm", icon: "retry" }} on={{ press: on?.act }} />
        )),
    })
    return <Grammar layout="empty-notice-stack" render={content} />
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
