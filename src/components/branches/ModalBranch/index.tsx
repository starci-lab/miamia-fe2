import { Modal } from "@heroui/react"
import { Tree } from "@/components/branches/Tree"
import type { ContractKey } from "@/components/contracts"
import type { ContractComponent } from "@/components/contracts/props"

/**
 * BRANCH - `ModalBranch`: the vendor's covering mechanics, wrapped once.
 *
 * SLOTS-4: it takes `{contract, render}`, exactly like `Tree`, instead of an untyped `children`
 * hole. A modal owns focus trapping, Escape, backdrop dismissal, scroll locking and placement; the
 * content it covers is now always a checked contract identity rather than an arbitrary subtree.
 *
 * BOUND SLOTS DRAW THROUGH `Tree`, the one file that turns a key into an element (CONTRACT-7): the
 * vendor body hosts `<Tree contract render />`, and the entry's own host lands INSIDE that body,
 * never ON it (CONTRACT-4).
 *
 * A PROJECTION HAS ALREADY DRAWN ITS OWN HOST. Routing it through `Tree` a second time would open a
 * second host around content that already opened one - the same fault `Tree`'s own `ContractContent`
 * refuses for a projected SLOT, reproduced here for a projected ROOT. So a projection's `project()`
 * is called directly and its output is handed to the vendor body with no host in between.
 */

/** How wide the surface is allowed to get. */
export type ModalBranchSize = "xs" | "sm" | "md" | "lg"

/** Props for {@link ModalBranch}. */
export type ModalBranchProps<K extends ContractKey> = {
    /** Whether the surface is on screen. Owned by whoever mounts it, never by the shell. */
    readonly isOpen: boolean
    /** How wide it may get. */
    readonly size?: ModalBranchSize
    /** The registry key the interior must satisfy. */
    readonly contract: K
    /** Named content whose metadata and source body satisfy this exact contract. */
    readonly render: ContractComponent<NoInfer<K>>
    /** Every way out: the close control, Escape, and the backdrop. */
    readonly onDismiss: () => void
}

/** Draw the vendor modal mechanics around one checked contract identity. */
export const ModalBranch = <const K extends ContractKey>(input: ModalBranchProps<K>) => (
    <Modal
        isOpen={input.isOpen}
        onOpenChange={(open: boolean) => {
            if (!open) input.onDismiss()
        }}
    >
        <Modal.Backdrop>
            <Modal.Container size={input.size ?? "md"} placement="center">
                <Modal.Dialog data-tier="branch" data-component="ModalBranch">
                    <Modal.CloseTrigger />
                    <Modal.Body className="p-0">
                        {input.render.kind === "projection"
                            ? input.render.project()
                            : <Tree contract={input.contract} render={input.render} />}
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
)

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", mechanics: true, world: "pure" } as const
