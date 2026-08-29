import { ModalBranch } from "@/components/branches/ModalBranch"
import type { LayoutKey } from "@/resources/visual-layouts"
import type { LayoutValue } from "@/modules/types/layout"

/** Pure modal visibility, content and guarded dismissal layout. */
export type WhiteLabelInquiryOverlayProps<K extends LayoutKey> = {
    readonly isOpen: boolean
    readonly render: LayoutValue<K>
    readonly onDismiss: () => void
}
/** Mounts the inquiry form inside shared modal mechanics. */
export const WhiteLabelInquiryOverlayBase = <const K extends LayoutKey>(input: WhiteLabelInquiryOverlayProps<K>) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="sm"
        layout={input.render.layout}
        render={input.render}
        onDismiss={input.onDismiss}
    />
)
/** Declares the pure inquiry overlay boundary. */
