import { ModalBranch } from "@/components/branches/ModalBranch"
import type { ContractKey } from "@/components/contracts"
import type { ContractComponent } from "@/components/contracts/props"

/** Defines visibility, panel content and dismissal for the checkout overlay. */
export type MembershipCheckoutOverlayProps<K extends ContractKey> = {
    readonly isOpen: boolean
    readonly render: ContractComponent<K>
    readonly onDismiss: () => void
}
/** Renders the pure membership checkout dialog shell. */
export const _MembershipCheckoutOverlay = <const K extends ContractKey>(input: MembershipCheckoutOverlayProps<K>) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="sm"
        contract={input.render.meta.contract}
        render={input.render}
        onDismiss={input.onDismiss}
    />
)
/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "pure", domain: "membership" } as const
