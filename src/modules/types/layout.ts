import type { ComponentType, ReactNode } from "react"
import type { ChildrenOf, LayoutKey, LayoutPropValue } from "@/resources/visual-layouts"

/**
 * THE SLOT SHAPES, as types rather than as a convention.
 *
 * Every component below a block takes a FIXED set of named slots and no others. Written as a type
 * alias per tier, a fourth slot is not discouraged - it does not compile, because the alias is the
 * whole shape and there is nowhere to put one.
 *
 * This is the difference between a rule and a fence. `interface XProps { props: XData; isLoading?: boolean }`
 * is a rule: correct today, and one `extends` away from carrying a `className` next month.
 * `type XProps = ComponentProps<XData>` is a fence.
 */

/**
 * What DATA is: anything a JSON document could hold.
 *
 * A function does not satisfy it, and that is the only thing stopping a component being smuggled
 * through `props` - which is why handlers travel in their own slot rather than beside the data.
 *
 * NOTE FOR AUTHORS: a leaf's or composite's data must be declared with `type`, not `interface`. TypeScript gives
 * an implicit index signature to a type alias and not to an interface, so an interface silently
 * fails this constraint. That is not a quirk to work around - it is the constraint doing its job.
 */
export type SerializableValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ReadonlyArray<SerializableValue>
    | { readonly [key: string]: SerializableValue }

/** The shape any leaf's, composite's or branch's data must have: data all the way down. */
export type ComponentData = { readonly [key: string]: SerializableValue }

/** The shape any component's handlers must have: functions, kept apart from the data. */
export type ComponentActions = { readonly [key: string]: ((...args: Array<never>) => void) | undefined }

/**
 * A LEAF's props. Three slots, no fourth.
 *
 * `props` - what it draws. `on` - what it does. `isLoading` - handed down, never decided here.
 * No `children`: only a branch assembles. No `className`: a caller who can restyle a node has
 * become its second owner.
 */
export type ComponentProps<D extends ComponentData, A extends ComponentActions = ComponentActions> = {
    readonly props: D
    readonly on?: A
    readonly isLoading?: boolean
}

/** A leaf render. Its identity is its React output, not runtime metadata. */
export type RenderLeaf = () => ReactNode

/** Keep the visual leaf signature explicit at the call site. */
export const renderLeaf = (
    name: string,
    props: Readonly<Record<string, LayoutPropValue>>,
    render: () => ReactNode,
): RenderLeaf => {
    void name
    void props
    return render
}

/**
 * A COMPOSITE's props. The runtime lanes match a leaf, but the type is intentionally distinct:
 * a composite fixes an arrangement of independently meaningful leaves rather than one intrinsic
 * value or control. Closed does not mean freehand: its arrangement is still rendered through a
 * typed Grammar layout, never through raw structural markup. If a caller may supply the content,
 * the component is a branch rather than a composite.
 */
export type CompositeProps<D extends ComponentData, A extends ComponentActions = ComponentActions> = {
    readonly props: D
    readonly on?: A
    readonly isLoading?: boolean
}

/** A reusable fixed composition is an ordinary React render. */
export type CompositeComponent = () => ReactNode

/** Keep a reusable composite render explicit at the call site. */
export const renderComposite = (
    name: string,
    props: Readonly<Record<string, LayoutPropValue>>,
    render: () => ReactNode,
): CompositeComponent => {
    void name
    void props
    return render
}

/** A checked slot record. It carries content; it is deliberately not callable. */
export type LayoutSlots<K extends LayoutKey> = {
    readonly kind: "slots"
    readonly layout: K
    readonly slots: ChildrenOf<K>
}

/** Content that owns its host because the surrounding branch supplies behavior. */
export type LayoutContentNode<K extends LayoutKey> = {
    readonly kind: "content"
    readonly layout: K
    readonly project: () => ReactNode
}

/** A real component type whose runtime input remains separate from its layout identity. */
export type LayoutRenderComponent<
    K extends LayoutKey,
    P,
> = ComponentType<P> & {
    readonly kind: "component"
    readonly layout: K
}

/** Checked bound content used by Grammar and aggregate layout projections. */
export type BoundLayoutComponent<K extends LayoutKey> = LayoutSlots<K> | LayoutContentNode<K>

/**
 * One layout identity with either bound slots or a real component input.
 *
 * Omitting `P` selects the bound lane used by Grammar. Supplying `P` selects the component-type lane
 * used by a host that passes runtime `props` without closing them into slot callbacks.
 */
export type LayoutComponent<
    K extends LayoutKey,
    P = undefined,
> = [P] extends [undefined]
    ? BoundLayoutComponent<K>
    : LayoutRenderComponent<K, P>

/** Layout-bound content used by the presentational branches. */
export type LayoutValue<K extends LayoutKey, P = undefined> = LayoutComponent<K, P>

/** Component type bound to a layout while retaining ordinary React props. */
export type LayoutComponentType<K extends LayoutKey, P> = LayoutRenderComponent<K, P>

/** Shared branch props for a layout-bound surface. */
export type BranchProps<K extends LayoutKey> = {
    readonly layout: K
    readonly render: LayoutValue<K>
    readonly isLoading?: boolean
}

/** Bind named visual slots or a regular React component to a layout. */
type layoutNode = {
    <const K extends LayoutKey>(layout: K, slots: ChildrenOf<K>): LayoutSlots<K>
    <
        const K extends LayoutKey,
        P,
    >(
        layout: K,
        render: ComponentType<P>,
    ): LayoutRenderComponent<K, P>
}

/**
 * Bind either checked named slots or one real component type to an exact layout identity.
 *
 * The component overload keeps runtime `props` outside the layout metadata. A host can therefore
 * pass changing data into a stable component type without rebuilding a forest of closed callbacks.
 */
export const layoutNode = ((layout: LayoutKey, input: unknown) => {
    if (typeof input === "function") {
        return Object.assign(input, {
            kind: "component" as const,
            layout,
        })
    }
    return {
        kind: "slots" as const,
        layout,
        slots: input,
    }
}) as layoutNode

/** Associate branch-owned content with a visual layout. */
export const layoutContent = <const K extends LayoutKey>(
    layout: K,
    render: () => ReactNode,
): LayoutContentNode<K> => ({
        kind: "content",
        layout,
        project: render,
    })

/** Props for branch-owned layout content. */
export type LayoutBranchProps<K extends LayoutKey> = {
    readonly layout: K
    readonly render: LayoutComponent<NoInfer<K>>
    readonly isLoading?: boolean
}

/**
 * A BLOCK's presentational half. Two slots.
 *
 * `state` is the business situation and it picks a Grammar; `props` is what that Grammar says. There is
 * no `isLoading` here - a block writes the flag when it hands a Grammar down, and never receives one.
 * The type is a union per state at the call site, so the data of a situation a surface is NOT in
 * cannot be passed and the data of the one it IS in cannot be omitted.
 */
export type BlockProps<S extends string, D extends ComponentData> = {
    readonly state: S
    readonly props: D
}
