import { ModalBranch } from "@/components/branches/ModalBranch"
import type { ContractKey } from "@/components/contracts"
import type { ContractComponent } from "@/components/contracts/props"

/** Pure modal visibility, content and dismissal contract. */
export type ExamDownloadCheckoutOverlayProps<K extends ContractKey> = {
    readonly isOpen: boolean
    readonly render: ContractComponent<K>
    readonly onDismiss: () => void
}
/** Mounts download checkout inside shared modal mechanics. */
export const ExamDownloadCheckoutOverlayBase = <const K extends ContractKey>(input: ExamDownloadCheckoutOverlayProps<K>) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="sm"
        contract={input.render.meta.contract}
        render={input.render}
        onDismiss={input.onDismiss}
    />
)
/** Declares the pure checkout overlay boundary. */
export const meta = { shape: "overlay", world: "pure", domain: "payment" } as const
