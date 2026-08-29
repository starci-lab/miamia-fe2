import { Fragment } from "react"
import { layoutNodeProps, layoutSpec, type LayoutKey } from "@/resources/visual-layouts"
import type { LayoutValue, RenderLeaf } from "@/modules/types/layout"

/**
 * BRANCH - `Grammar`: the smallest branch there is. It draws one named visual layout.
 *
 * Anything needing more than one node is a named branch that nests these. That is the whole of the
 * assembly story: the visual layout describes a node, a branch describes how nodes stack.
 *
 * IT OWNS NO CLASS OF ITS OWN. Every class on the rendered node comes from the layout entry, so
 * there is no seam here for a caller or a maintainer to quietly adjust.
 *
 * The branch owns composition while the visual layout owns the host element and its classes.
 */

/** Props for {@link Grammar}. */
export interface GrammarProps<K extends LayoutKey> {
    /**
     * The catalog key. This is the ONLY layout decision an author makes: it fixes the node's
     * classes and, through the key's own name, what belongs inside it.
     */
    layout: K
    /** Named content that satisfies this exact layout. */
    render: LayoutValue<NoInfer<K>>
}

/** Props for rendering only a layout's validated content inside a branch-owned host. */
export interface LayoutContentProps<K extends LayoutKey> {
    layout: K
    render: LayoutValue<NoInfer<K>>
}

/** Normalize one slot's declared value into the list Grammar walks: as-is when repeated, empty when absent, one entry otherwise. */
const toSlotValues = (value: unknown): ReadonlyArray<unknown> => {
    if (Array.isArray(value)) return value
    if (value === undefined) return []
    return [value]
}

/** Render validated slots without choosing or opening their host. */
export const LayoutContent = <const K extends LayoutKey>({ layout, render }: LayoutContentProps<K>) => {
    if (render.kind === "content") return <>{render.project()}</>
    const spec = layoutSpec(layout)
    const slots = render.slots
    return Object.keys(spec.children).flatMap((slot) => {
        const value = slots[slot as keyof typeof slots]
        const values = toSlotValues(value)
        return values.map((component: unknown, index: number) => {
            const child = component as LayoutValue<LayoutKey> | RenderLeaf
            if (typeof child === "object" && child !== null) {
                const layoutChild = child as LayoutValue<LayoutKey>
                // Branch-owned content already drew the host for this layout. Opening
                // another Grammar around it changes the DOM and therefore the layout: the navbar was
                // inset twice and every projected SurfaceCard gained a duplicate section wrapper.
                if (layoutChild.kind === "content") {
                    return <Fragment key={`${slot}-${index}`}>{layoutChild.project()}</Fragment>
                }
                return <Grammar key={`${slot}-${index}`} layout={layoutChild.layout} render={layoutChild} />
            }
            const leaf = child as RenderLeaf
            return <Fragment key={`${slot}-${index}`}>{leaf()}</Fragment>
        })
    })
}

/**
 * Draw one visual layout node.
 *
 * @param props - {@link GrammarProps}
 */
export const Grammar = <const K extends LayoutKey>({ layout, render }: GrammarProps<K>) => {
    const nodeProps = layoutNodeProps(layout)
    /*
     * THE ENTRY NAMES THE ELEMENT, NOT THE CALLER. A `<main>` is the document's one main landmark
     * and a `<nav>` is a destination; both are MEANING, and meaning belongs beside the classes and
     * the children the key already fixes.
     *
     * The alternative was an `as` prop, and it is the wrong door: it hands the element back to the
     * call site, which is the single decision `GrammarProps` exists to refuse. It also scales the way
     * this repository already paid for once - `Main` was a whole second frame whose only job was to
     * swap the tag, so every rule taught about `Grammar` had to be taught about `Main` too, and the one
     * that was not reported the landmark as a node with no key.
     */
    const spec = layoutSpec(layout)
    const Host = spec.host ?? "div"
    return (
        <Host
            {...nodeProps}
            /*
             * A LIST HAS TO SAY IT IS ONE, TWICE. Tailwind's preflight sets `list-style: none` on
             * every ul and ol, and Safari answers that by dropping the element from the
             * accessibility Grammar entirely - so the list the entry just claimed is announced to
             * VoiceOver as loose text, and a twenty-three module curriculum stops having a length.
             *
             * The role restores exactly what the entry already says and changes nothing else. It
             * lives here rather than as a field on every list entry because it is not a decision an
             * entry gets to make: a `ul` IS a list, and this only says so again.
             */
            role={spec.host === "ul" || spec.host === "ol" ? "list" : undefined}
        >
            <LayoutContent layout={layout} render={render} />
        </Host>
    )
}

