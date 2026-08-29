import { CLASS_NAME_1 } from "./classNames"
import { Card } from "@heroui/react"
import { Grammar } from "@/components/layouts/Grammar"
import type { LayoutKey } from "@/resources/visual-layouts"
import type { BranchProps } from "@/modules/types/layout"

/** Props for a card whose complete content is one typed form-oriented layout. */
export type SurfaceFormCardProps<K extends LayoutKey> = BranchProps<K>

/**
 * Draw one bounded form surface without adding a title or another layout node around its content.
 *
 * THE ENTRY'S NODE IS RENDERED, NOT IMITATED. Spreading `layoutNodeProps` onto the vendor card
 * copied an entry's classes and markers onto an element the entry never named, and silently threw
 * away its `host`: a key declaring `host: "form"` came out a `div`, so the thing that exists in
 * order to submit stopped being one, while the markers went on claiming the layout was kept.
 * Nothing could report that - not the compiler, not a rule, not a screenshot. So the frame draws
 * the key, and the vendor body is emptied of its own inset because the entry owns the inset.
 *
 * @param input - {@link SurfaceFormCardProps}
 */
export const SurfaceFormCard = <const K extends LayoutKey>({
    layout,
    render,
}: SurfaceFormCardProps<K>) => (
        <Card className={CLASS_NAME_1} data-component="SurfaceFormCard">
            <Card.Content className={CLASS_NAME_1} data-component="SurfaceFormCardBody">
                <Grammar layout={layout} render={render} />
            </Card.Content>
        </Card>
    )

/** Source-level tier marker for the form surface branch. */
