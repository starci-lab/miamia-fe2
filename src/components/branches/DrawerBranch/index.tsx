import { CLASS_NAME_1 } from './styles'
import { Drawer } from "@heroui/react"
import { Grammar } from "@/components/branches/Grammar"
import type { ContractKey } from "@/components/contracts"
import type { ContractComponent } from "@/components/contracts/props"

/**
 * BRANCH - `DrawerBranch`: the vendor's edge-anchored covering mechanics, wrapped once.
 *
 * Target path: `src/components/shells/DrawerBranch/index.tsx`.
 *
 * IT WRAPS `Drawer`, NOT `Modal` WITH A PLACEMENT. HeroUI 3.2.4 ships a real `Drawer` -
 * `Drawer.Backdrop`, `Drawer.Content` with its own `placement`, `Drawer.Dialog`, `Drawer.Header`,
 * `Drawer.Body`, `Drawer.Footer`, `Drawer.Handle`, `Drawer.CloseTrigger` - and this file was first
 * written against `Modal` with `placement="right"`. That would have been a second implementation
 * of a panel the vendor already ships: no drag handle, no edge-anchored enter and exit, and the
 * product's drawer behaving unlike every other drawer built on this library. `vendor-boundary` is
 * the rule and this is the reason behind it - reach for the vendor's own component before
 * assembling one out of its neighbour.
 *
 * IT IS A SIBLING OF `ModalBranch` rather than a prop on it, and canon settles that rather than
 * taste: `props-and-slots` SLOTS-4 names exactly three components that may expose `children` -
 * `ModalBranch`, `DrawerBranch` and `DropdownBranch` - so the drawer was vocabulary before it was
 * written.
 *
 * SLOTS-4: it takes `{contract, render}`, exactly like `Grammar`, instead of an untyped `children`
 * hole. A drawer owns focus trapping, Escape, backdrop dismissal, scroll locking and placement; the
 * content it covers is now always a checked contract identity rather than an arbitrary subtree.
 *
 * BOUND SLOTS DRAW THROUGH `Grammar`, the one file that turns a key into an element (CONTRACT-7): the
 * vendor body hosts `<Grammar contract render />`, and the entry's own host lands INSIDE that body,
 * never ON it (CONTRACT-4).
 *
 * A PROJECTION HAS ALREADY DRAWN ITS OWN HOST. Routing it through `Grammar` a second time would open a
 * second host around content that already opened one - the same fault `Grammar`'s own `ContractContent`
 * refuses for a projected SLOT, reproduced here for a projected ROOT. So a projection's `project()`
 * is called directly and its output is handed to the vendor body with no host in between.
 *
 * IT IMPLEMENTS NONE OF THOSE MECHANICS ITSELF, exactly as `ModalBranch` does not: no effect, no
 * ref, no scroll handling. All of it belongs to the vendor, which is what stops two overlays in
 * this product disagreeing about how a covering surface behaves.
 */

/** Which edge the panel is anchored to. */
export type DrawerBranchSide = "left" | "right"

/** Props for {@link DrawerBranch}. */
export type DrawerBranchProps<K extends ContractKey> = {
    /** Whether the drawer is showing. Owned by whoever mounts it, never by the shell. */
    readonly isOpen: boolean
    /** The edge it opens from. Absent is `right`, which is where this product's basket lives. */
    readonly side?: DrawerBranchSide
    /** The already-resolved title. A drawer names itself; the interior does not repeat it. */
    readonly title: string
    /** The registry key the interior must satisfy. */
    readonly contract: K
    /** Named content whose metadata and source body satisfy this exact contract. */
    readonly render: ContractComponent<NoInfer<K>>
    /** Every way out: the close control, Escape, and the backdrop. */
    readonly onDismiss: () => void
}

/**
 * Open the vendor's panel from the edge.
 *
 * @param input - {@link DrawerBranchProps}
 */
export const DrawerBranch = <const K extends ContractKey>(input: DrawerBranchProps<K>) => (
    <Drawer
        isOpen={input.isOpen}
        onOpenChange={(open) => {
            if (!open) input.onDismiss()
        }}
    >
        <Drawer.Backdrop>
            <Drawer.Content placement={input.side ?? "right"}>
                <Drawer.Dialog data-tier="branch" data-component="DrawerBranch">
                    <Drawer.Header>
                        <Drawer.Heading>{input.title}</Drawer.Heading>
                    </Drawer.Header>
                    <Drawer.CloseTrigger />
                    {/*
                     * The vendor inset is zeroed for the same reason `ModalBranch` zeroes it: the
                     * interior owns its own padding, so a shell that also padded would inset the
                     * same content twice and the two insets would drift apart.
                     */}
                    <Drawer.Body className={CLASS_NAME_1}>
                        {input.render.kind === "projection"
                            ? input.render.project()
                            : <Grammar contract={input.contract} render={input.render} />}
                    </Drawer.Body>
                </Drawer.Dialog>
            </Drawer.Content>
        </Drawer.Backdrop>
    </Drawer>
)

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", mechanics: true, world: "pure" } as const
