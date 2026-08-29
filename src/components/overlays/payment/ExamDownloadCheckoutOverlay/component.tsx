import { ModalBranch } from "@/components/branches/ModalBranch"
import type { LayoutKey } from "@/resources/visual-layouts"
import type { LayoutValue } from "@/modules/types/layout"

/** Pure modal visibility, content and dismissal layout. */
export type ExamDownloadCheckoutOverlayProps<K extends LayoutKey> = {
    readonly isOpen: boolean
    readonly render: LayoutValue<K>
    readonly onDismiss: () => void
}
/** Mounts download checkout inside shared modal mechanics. */
export const ExamDownloadCheckoutOverlayBase = <const K extends LayoutKey>(input: ExamDownloadCheckoutOverlayProps<K>) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="sm"
        layout={input.render.layout}
        render={input.render}
        onDismiss={input.onDismiss}
    />
)
/** Declares the pure checkout overlay boundary. */
