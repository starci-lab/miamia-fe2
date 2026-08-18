import { ModalBranch } from "@/components/branches/ModalBranch"
import type { ContractKey } from "@/components/contracts"
import type { ContractComponent } from "@/components/contracts/props"

/** Pure modal visibility, content and guarded dismissal contract. */
export type WhiteLabelInquiryOverlayProps<K extends ContractKey> = {
    readonly isOpen: boolean
    readonly render: ContractComponent<K>
    readonly onDismiss: () => void
}
/** Mounts the inquiry form inside shared modal mechanics. */
export const _WhiteLabelInquiryOverlay = <const K extends ContractKey>(input: WhiteLabelInquiryOverlayProps<K>) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="sm"
        contract={input.render.meta.contract}
        render={input.render}
        onDismiss={input.onDismiss}
    />
)
/** Declares the pure inquiry overlay boundary. */
export const meta = { shape: "overlay", world: "pure", domain: "payment" } as const
