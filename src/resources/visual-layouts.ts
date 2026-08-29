import { cn } from "@heroui/react"

/**
 * THE REGISTRY.
 *
 * One entry describes ONE node: the classes it wears, and why the things inside it sit that way.
 * Nothing else. What goes inside is the assembling branch's business. A fixed run of independently
 * meaningful leaves is a composite; its count does not turn it back into a leaf.
 *
 * A KEY'S NAME MUST FIX ITS CHILDREN. `card` is not a name here - it says nothing about what goes
 * inside, so anything can, and the entry stops constraining anything. `title-with-baseline-fact`
 * says what it holds, so a wrong child is visible on sight. It is also what keeps `why` honest: a
 * key drawing twenty regions cannot say why any one of them is there, but the reason a title and
 * a fact share a baseline is the SAME reason at all twenty.
 *
 * POSITIONAL SELECTORS ARE ACCEPTED HERE, and only here. Naming a child instead of counting to it
 * would be better, and it died with the children map. The objection stands - insert something in
 * the middle and `nth-child(2)` is silently wrong - but the children now come from ONE branch, so
 * whoever inserts one is looking at this file beside it.
 */

/**
 * The closed set of classes a node may lay its children out with.
 *
 * `gap-[13px]` is not forbidden - it is UNREPRESENTABLE, because it is not a member. That single
 * property is what makes a whole family of patrol rules unnecessary: there is nothing to police
 * when the bad value cannot be typed.
 */
export type LayoutClassName =
    | "flex" | "grid" | "flex-col" | "flex-row" | "flex-wrap" | "overflow-hidden"
    | "items-center" | "items-baseline" | "items-start" | "items-end" | "items-stretch"
    | "justify-between" | "justify-center" | "[&>*]:w-full"
    | "gap-1" | "gap-2" | "gap-3" | "gap-4" | "gap-5" | "gap-6" | "gap-8"
    | "grid-cols-1" | "grid-cols-2" | "sm:grid-cols-2" | "sm:grid-cols-4" | "md:grid-cols-2" | "lg:grid-cols-3"
    | "sm:flex-row" | "sm:items-start" | "sm:justify-between"
    | "md:flex" | "md:flex-row" | "md:items-start" | "md:items-center" | "md:justify-between" | "md:gap-8"
    // A PROPORTIONAL split, which the union could not previously express. Every existing two-column
    // token is a FIXED rail (`md:[&>*:first-child]:w-72`), and 288px is a sidebar measure: a problem
    // statement read at that width wraps every second word. `md:shrink-0` comes with it because a
    // proportional width is only a REQUEST until shrinking is refused - measured at 273px inside a
    // 934px viewport before it was added. The seam flips with the axis: a rule UNDER the reading
    // column while the two are stacked, and BESIDE it once they are side by side.
    | "md:w-2/5" | "md:shrink-0" | "md:border-b-0" | "md:border-r"
    | "@app-md:flex-row" | "@app-md:items-start" | "@app-md:gap-8" | "@app-md:w-72"
    | "mx-auto" | "min-h-screen" | "min-h-72" | "h-full" | "w-full" | "min-w-0" | "grow" | "flex-1" | "shrink-0" | "hidden" | "max-w-app-sm" | "max-w-app-md" | "max-w-app-lg" | "max-w-app-xl" | "max-w-full" | "max-w-6xl" | "max-w-sm" | "max-w-md" | "@container"
    | "h-16" | "min-h-16" | "sticky" | "top-0" | "top-16" | "bottom-20" | "z-30" | "z-40" | "z-50"
    | "border" | "border-b" | "border-accent" | "border-separator" | "divide-y" | "divide-separator" | "bg-background"
    | "px-3" | "px-4" | "px-6" | "py-2" | "py-3" | "py-6" | "p-0" | "p-2" | "p-3" | "p-4" | "p-5" | "p-6"
    | "pb-28" | "md:px-6" | "md:pb-6" | "md:bottom-4"
    | "px-2" | "pl-4" | "mt-3" | "cursor-pointer" | "text-left" | "text-foreground" | "hover:opacity-80"
    | "group" | "active:opacity-70"
    | "rounded-xl" | "rounded-2xl" | "rounded-3xl"
    | "bg-surface" | "bg-accent-soft" | "bg-success-soft" | "bg-warning-soft"
    | "shadow-surface" | "text-center"
    | "inset-shadow-[2px_0_0_0_var(--success)]" | "inset-shadow-[2px_0_0_0_var(--danger)]"
    | "[&>*:nth-child(2)]:min-w-0" | "[&>*:nth-child(2)]:grow"
    | "[&>*:nth-child(3)]:min-w-0" | "[&>*:nth-child(3)]:grow"
    | "md:[&>*:first-child]:min-w-0" | "md:[&>*:first-child]:grow"
    | "[&>*:first-child]:min-w-0" | "[&>*:first-child]:grow"
    | "md:[&>*:last-child]:w-72" | "md:[&>*:last-child]:shrink-0"
    | "md:[&>*:first-child]:w-72" | "md:[&>*:first-child]:shrink-0"
    | "md:[&>*:last-child]:min-w-0" | "md:[&>*:last-child]:grow"
    | "md:[&>*:first-child]:overflow-y-auto"
    | "md:[&>*:nth-child(2)]:min-w-0" | "md:[&>*:nth-child(2)]:grow"
    | "[&>*]:min-w-0" | "[&>*]:grow"
    | "md:[&>.layout-name-learn-spine-column]:w-72"
    | "md:[&>.layout-name-learn-spine-column]:grow-0"
    | "md:[&>.layout-name-learn-spine-column]:shrink-0"
    | "md:[&>.layout-name-learn-spine-column]:sticky"
    | "md:[&>.layout-name-learn-spine-column]:top-rail"
    | "md:[&>.layout-name-learn-spine-column]:self-start"
    | "md:[&>.layout-name-learn-spine-column]:max-h-rail"
    | "md:[&>.layout-name-learn-spine-column]:overflow-y-auto"
    | "md:[&>*:first-child]:sticky" | "md:[&>*:first-child]:top-rail"
    | "md:[&>*:first-child]:self-start" | "md:[&>*:first-child]:max-h-rail"
    | "[&>*]:px-4" | "[&>*]:py-3" | "[&>*]:p-2" | "[&>*]:p-3" | "[&>*]:border-separator"
    | "[&>*:nth-child(odd)]:border-r" | "[&>*:nth-child(-n+4)]:border-b"
    | "[&>*:first-child]:w-5" | "[&>*:first-child]:shrink-0"
    // A catalog row reads left to right: what it looks like, what it is, what to do. The artwork
    // is FIXED rather than proportional, because a thumbnail that grew with the viewport would
    // make the title column narrower on a wider screen, and the trailing controls hold their own
    // measure so the row does not end in a ragged edge down the list.
    | "[&>*:first-child]:w-36" | "[&>*:last-child]:shrink-0"
    | "[&>*:first-child]:text-center" | "[&>*:first-child]:tabular-nums"
    | "[&>*:first-child]:pt-4" | "[&>*:last-child]:pb-4"
    // A total is not the last of the figures above it, it is what they resolve to. Every other
    // stack in this table separates peers, and peers are what its members are; here the last line
    // is a different KIND of line, so it takes a rule and a step of air rather than the even seam
    // that would make it read as one more subtotal.
    | "[&>*:last-child]:border-t" | "[&>*:last-child]:border-separator"
    | "[&>*:last-child]:pt-3" | "[&>*:last-child]:mt-1" | "[&>*:last-child]:mt-auto"
    | "[&>*:only-child]:md:col-span-2"
    // A fixed artwork track does not fit a phone. The reference hides the thumbnail on the
    // narrowest screens rather than shrinking it, because a course cover below a certain size
    // identifies nothing and the name it sits beside identifies everything.
    | "[&>*:first-child]:hidden" | "md:[&>*:first-child]:block"
    // The end rows carry the surface's own radius. A verdict band is an inset shadow, so it
    // follows whatever radius its row has - and on a square end row it is sliced flat where the
    // card curves away, instead of hooking around the corner the way the reference draws it.
    | "[&>*:first-child]:rounded-t-3xl" | "[&>*:last-child]:rounded-b-3xl"
    // The dais arranges its own places. Emitting them out of rank order would put the
    // champion in the middle of the DOM too, so anyone reading in sequence hears second
    // place first; the node re-orders what it draws and leaves the reading order alone.
    | "[&>*:nth-child(1)]:order-2" | "[&>*:nth-child(2)]:order-1" | "[&>*:nth-child(3)]:order-3"
    // A ranked row is five columns, not five things that happen to sit in a line. Wrapping made
    // the score land in a different place on every row - a follow control is wider than a caret,
    // and a viewer row has neither - so the one column a leaderboard exists to let you compare
    // stopped being comparable. The track is declared once here and every row obeys it.
    // The trailing tracks are FIXED, not `auto`. Each row is its own grid, so an `auto` track
    // sizes to that row's own content - and a row with no follow control simply has no fifth
    // column, which let `1fr` expand and pushed its score out of the column every other row keeps
    // it in. Fixed widths are what make the scores line up ACROSS rows rather than within one.
    | "grid-cols-[auto_auto_1fr_5rem_2.5rem]" | "[&>*]:grid-cols-[auto_auto_1fr_5rem_2.5rem_7rem]"
    | "[&>*:nth-child(4)]:text-right"

    // The course detail page is the first right-hand rail and the first bottom-pinned bar in this
    // repository, which is why these read as gaps rather than omissions: every one is the mirror of a
    // member already present for the opposite child or the opposite edge.
    | "[&>*:nth-child(2)]:shrink-0"
    | "[&>*:last-child]:min-w-0" | "[&>*:last-child]:grow"
    | "md:[&>*:last-child]:sticky" | "md:[&>*:last-child]:top-rail"
    | "md:[&>*:last-child]:self-start" | "md:[&>*:last-child]:max-h-rail"
    | "md:[&>*:last-child]:overflow-y-auto"
    | "bottom-0" | "border-t" | "md:hidden"
    // py-6 is both at once, and both at once is exactly what a page with a bottom-pinned bar cannot
    // use: padding under the last child lifts the bar off the edge it is pinned to.
    | "pt-6" | "pb-6"

/** Literal values a layout may require from a child component's data props. */
export type LayoutPropValue = string | number | boolean | null

/** A child appears once unless it explicitly declares a repeated run and its resting count. */
export type LayoutChildCardinality =
    | { readonly repeats?: false, readonly restingCount?: never }
    | { readonly repeats: true, readonly restingCount: number }

/** One named child slot: a leaf, a fixed composite, or another closed layout identity. */
export type LayoutChildSpec = LayoutChildCardinality & {
    readonly leaf?: string | ReadonlyArray<string>
    readonly composite?: string | ReadonlyArray<string>
    readonly layout?: string | ReadonlyArray<string>
    readonly props?: Readonly<Record<string, LayoutPropValue>>
    readonly optional?: boolean
}

/**
 * The one child an entry does NOT name: whatever its caller brought.
 *
 * A section fixes WHERE the content it holds sits and can never fix WHICH node that is - the same
 * section holds a list on one screen and a grid on the next - so a literal key in that slot would be
 * a lie in every use but one. The `$` says it is not a member of the vocabulary: nothing may be
 * named this, and `layoutSpec` never resolves it.
 *
 * IT HAD TO BE TYPED, not merely written. Left unknown to the types the slot resolved to `never`,
 * which nothing can satisfy - so the only way to draw such a node was to copy its classes onto an
 * element the branch opened itself, which drops the entry's `host` and is exactly the silent failure
 * `only-the-frame-wears-a-node` reports. The rule and this type are the same fix: one refuses the
 * imitation, the other leaves a lawful way to render the real thing.
 */
type CallerContent = "$content"

type LayoutChild<S> = S extends { readonly layout: infer K }
    ? [K extends ReadonlyArray<infer A> ? A : K] extends [CallerContent]
        ? import("@/modules/types/layout").LayoutComponent<LayoutKey>
        : (K extends ReadonlyArray<infer A> ? A : K) extends infer C extends LayoutKey
            ? import("@/modules/types/layout").LayoutComponent<C>
            : never
    : never

type LeafChild<S> = S extends { readonly leaf: unknown }
    ? import("@/modules/types/layout").RenderLeaf
    : never

type CompositeChild<S> = S extends { readonly composite: unknown }
    ? import("@/modules/types/layout").CompositeComponent
    : never

type OneChild<S> = LayoutChild<S> | LeafChild<S> | CompositeChild<S>

type ChildValue<S> = S extends { readonly repeats: true }
    ? ReadonlyArray<OneChild<S>>
    : OneChild<S>

type RequiredChildNames<K extends LayoutKey> = {
    [S in keyof (typeof LAYOUTS)[K]["children"]]:
        (typeof LAYOUTS)[K]["children"][S] extends { readonly optional: true } ? never : S
}[keyof (typeof LAYOUTS)[K]["children"]]

type OptionalChildNames<K extends LayoutKey> = Exclude<
    keyof (typeof LAYOUTS)[K]["children"],
    RequiredChildNames<K>
>

/** The exact named render record admitted by one layout key. */
export type ChildrenOf<K extends LayoutKey> = {
    readonly [S in RequiredChildNames<K>]: ChildValue<(typeof LAYOUTS)[K]["children"][S]>
} & {
    readonly [S in OptionalChildNames<K>]?: ChildValue<(typeof LAYOUTS)[K]["children"][S]>
}

/**
 * Elements an entry may name as its own host.
 *
 * A `<main>` is not a `<div>` with a class - it is the document's one main landmark, and a screen
 * reader offers it as a destination. The same holds for `<nav>`, `<ul>` and `<form>`: each is a
 * MEANING, and meaning belongs beside the classes and the children rather than in a second frame
 * component per element. `Main` was exactly that second frame - it existed only to swap the tag, so
 * every rule taught about `Grammar` had to be taught about `Main` separately, and the rule that was not
 * taught reported the landmark as a node with no key.
 *
 * `li` IS HERE BECAUSE `ul` AND `ol` WERE USELESS WITHOUT IT. The union admitted both containers and
 * not the item, so a list entry had to be a `div` - which is invalid HTML and, worse, silent: a
 * `<ul>` whose children are not `<li>` stops being announced as "list, 4 items" and is read as loose
 * text instead. The two list hosts could not be used for the thing they are named after, and nothing
 * failed, because a `div` is never wrong on its own.
 *
 * THE NAME AND THE MEMBERS BOTH COME FROM THE TRUST Grammar. This union is SCAFFOLDING, which
 * `sources/fe/layouts.ts` states is identical in every repository; only the entry table below is
 * this repository's own. It had drifted on both counts - named `LayoutHostTag` here and
 * `LayoutHost` there, carrying `main` and `ol` that canon lacked while missing the `li`, `header`
 * and `footer` canon had. Neither list contained the other, so both were wrong and no import could
 * report it. The missing members were merged into canon first and this file now takes that name and
 * that list, because a renamed type is a divergence nothing checks.
 */
export type LayoutHost =
    | "div" | "ul" | "ol" | "li" | "form" | "nav" | "main" | "section" | "header" | "footer" | "aside"

/** One catalog entry: a node's own classes, the element it opens, and why what it holds sits that way. */
export interface LayoutSpec {
    /** The class string of the node itself. Not a prop, not reachable by a caller. */
    readonly classes: ReadonlyArray<LayoutClassName>
    /** The element this node opens. Absent means `div` - a node with no meaning of its own. */
    readonly host?: LayoutHost
    /** Named child grammar. No anonymous `children` hole exists in a layout. */
    readonly children: Readonly<Record<string, LayoutChildSpec>>
    /**
     * Why the children of this node sit the way they do, in one sentence.
     *
     * A REASON, never a restatement of the key: "a row of chips" only says the key again; "the
     * tags wrap onto their own line before the title does" is the fact that made the node exist.
     */
    readonly why: string
}

/**
 * Build the catalog.
 *
 * A function rather than a bare literal so the keys are checked in one place and stay literal
 * without an `as const` at the call site.
 */
const buildLayouts = <const T>(layouts: T & { readonly [K in keyof T]: LayoutSpec }): T =>
    layouts

/**
 * The catalog. Every node the design layer may draw, and the reason each one holds its children
 * the way it does.
 *
 * KEEP THE NAMES CHILD-FIXING. A key whose name does not say what belongs inside it stops
 * constraining anything, and its `why` decays into a label the moment a second screen uses it.
 */
export const LAYOUTS = buildLayouts({
    "course-learn-today-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            subtitle: { leaf: "text", props: { size: "sm", tone: "muted" } },
            primary: { layout: "resume-item-card", optional: true },
            secondary: { layout: "resume-card-grid", optional: true },
            course: { layout: "resume-item-card", optional: true },
            progress: { layout: "label-fact-over-progress", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need today's deterministic next move before any alternatives, with course and progress as alternate mobile compositions in named optional slots instead of URL mutations or a second page.",
    },
    "course-learn-content-home-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-4", "px-6", "py-6"],
        children: {
            title: { leaf: "heading" },
            description: { leaf: "text", props: { size: "sm" } },
            modulesTitle: { leaf: "heading", optional: true },
            module: { leaf: "curriculum-module-row", repeats: true, restingCount: 3, optional: true },
        },
        why: "Use this when you need a Modules landing page that names the enrolled course, explains the collection, and keeps every authored module in one scannable run while loading and failure retain the same route landmark.",
    },
    "course-learn-module-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-4", "px-6", "py-6"],
        children: {
            title: { leaf: "heading" },
            module: { leaf: "curriculum-module-row" },
        },
        why: "Use this when you need a selected module's title and authored contents under one main landmark, narrowing the curriculum without inventing a second navigation shell.",
    },
    "learn-mobile-tab-bar": {
        host: "nav",
        classes: ["sticky", "bottom-0", "z-40", "flex", "w-full", "min-w-0", "flex-row", "items-center", "justify-between", "gap-2", "border-t", "border-separator", "bg-background", "px-4", "py-3", "md:hidden"],
        children: {
            tab: { leaf: "nav-link", props: { kind: "tab" }, repeats: true, restingCount: 3 },
        },
        why: "Use this when you need course navigation to remain a thumb-reachable, bottom-pinned strip of peer destinations while the spine rail is hidden below its breakpoint. Every item must be a route, never a trigger; use an action bar instead when pairing a price with its purchase control.",
    },
    "learn-shell-frame": {
        classes: [
            "flex", "min-h-screen", "w-full", "min-w-0", "flex-col", "items-stretch",
            "[&>*]:min-w-0", "[&>*]:grow",
            "md:flex-row", "md:items-start",
            "md:[&>.layout-name-learn-spine-column]:w-72",
            "md:[&>.layout-name-learn-spine-column]:grow-0",
            "md:[&>.layout-name-learn-spine-column]:shrink-0",
            "md:[&>.layout-name-learn-spine-column]:sticky",
            "md:[&>.layout-name-learn-spine-column]:top-rail",
            "md:[&>.layout-name-learn-spine-column]:self-start",
            "md:[&>.layout-name-learn-spine-column]:max-h-rail",
            "md:[&>.layout-name-learn-spine-column]:overflow-y-auto",
        ],
        children: {
            spine: { layout: "learn-spine-column", optional: true },
            body: { leaf: "page" },
            bar: { layout: "learn-mobile-tab-bar", optional: true },
        },
        why: "Use this when you need an outer learn-route shell with a persistent, independently scrolling course spine beside a routed main body and a mobile tab bar replacing it below the breakpoint, so navigation repaints only the body and never flickers the spine.",
    },
    "learn-spine-column": {
        host: "nav",
        classes: ["hidden", "w-full", "min-w-0", "flex-col", "gap-4", "p-4", "md:flex"],
        children: {
            resume: { layout: "learn-resume-card", optional: true },
            group: { layout: "learn-nav-group", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need the desktop rail to keep a resume-where-you-left-off card above labelled navigation groups in a separate top slot because it answers a different question than 'where can I go'.",
    },
    "learn-nav-group": {
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-1"],
        children: {
            label: { leaf: "text", props: { size: "xs", tone: "muted" } },
            row: { layout: "learn-nav-row", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need one named cluster of nav destinations read as a single labelled run rather than a card: the label sits at the tightest seam above its rows so it reads as what the run is, and the group draws no surrounding surface.",
    },
    "learn-nav-row": {
        classes: ["flex", "w-full", "min-w-0", "flex-row", "items-center", "gap-2", "[&>*:first-child]:min-w-0", "[&>*:first-child]:grow", "[&>*:last-child]:shrink-0"],
        children: {
            link: { leaf: "nav-link", props: { kind: "route" } },
            fact: { leaf: ["text", "icon"], optional: true },
        },
        why: "Use this when you need a single nav destination with one trailing read-only fact - a due count, rank, or lock state - that remains part of the full-width destination row rather than becoming a pressable control.",
    },
    "learn-resume-card": {
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-1", "p-4"],
        children: {
            label: { leaf: "text", props: { size: "xs", tone: "muted" } },
            progress: { composite: "labelled-progress-row" },
        },
        why: "Use this when you need a single pressable card that resumes a course in one tap, pairing a short label with a progress line as one identity. Unlike the surrounding nav groups it draws its own surface, because it is the one element in the rail that acts rather than navigates.",
    },
    "personal-project-workspace-frame": {
        classes: [
            "flex", "min-h-screen", "w-full", "min-w-0", "flex-col", "items-start",
            "md:flex-row", "md:items-start", "md:gap-8",
            "md:[&>*:first-child]:w-72", "md:[&>*:first-child]:shrink-0",
            "[&>*:last-child]:min-w-0", "[&>*:last-child]:grow",
        ],
        children: {
            milestone: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 4 },
            body: { leaf: "page" },
        },
        why: "Use this when you need a top-level personal-project frame whose milestone nav rail stays visible across dashboard, task, and result subroutes while only the routed body changes.",
    },
    "course-personal-project-task-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            controls: { layout: "stacked-peer-controls" },
        },
        why: "Use this when you need a task brief read before its score constraint and single submission action, keeping the controls as one bounded vertical decision directly below the title rather than in a generic page body run.",
    },
    "course-personal-project-result-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            attempts: { layout: "stacked-peer-controls" },
            feedback: { layout: "stacked-peer-controls", optional: true },
            action: { leaf: "button", optional: true },
        },
        why: "Use this when you need attempt history as a result's primary evidence, optional feedback as its explanation, and retry closing the reading order once as a page action outside both evidence groups.",
    },
    "course-personal-project-page": {
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-4", "px-6", "py-6"],
        children: {
            title: { leaf: "heading" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            progress: { leaf: "progress" },
            fact: { leaf: "text", props: { size: "sm", tone: "muted" } },
            task: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 4 },
            notice: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            retry: { leaf: "button", optional: true },
        },
        why: "Use this when you need a capstone overview read from identity through completion into ordered tasks, with empty and failed notices occupying the same reading flow rather than opening a second page shape.",
    },
    "course-foundations-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            search: { leaf: "search-box" },
            category: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 4, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a foundation catalog to introduce why the prerequisite library exists before its query and live category results, while empty and failed outcomes replace only the result run.",
    },
    "course-foundation-category-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            search: { leaf: "search-box" },
            resource: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 6, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need one category as a searchable reading list whose title and query precede an ordered run of backend resources and whose settled notice occupies that run when no resource can be shown.",
    },
    "course-foundation-resource-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            back: { leaf: "button" },
            header: { layout: "page-header-stack", optional: true },
            description: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            body: { leaf: "article", optional: true },
            practice: { leaf: "button", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a prerequisite resource read from its server title through its authored body before the related practice action, with back navigation available across ready and recovery states.",
    },
    "playground-session-frame": {
        classes: ["flex", "min-h-screen", "w-full", "min-w-0", "flex-col"],
        children: {
            surface: { leaf: "page", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a slug-level playground-session frame to stay mounted at full width and own the pairing/socket while setup and live-session surfaces swap beneath it, with only a load failure replacing that routed surface.",
    },
    "course-playground-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            playground: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 4, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a live lab catalog to explain server verification once before presenting each backend playground as a peer destination, with pending, empty, and failed states retaining the same page identity.",
    },
    "course-playground-setup-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            preparationTitle: { leaf: "heading", optional: true },
            preparationStep: { leaf: "text", props: { size: "sm" }, repeats: true, restingCount: 3, optional: true },
            pairingLabel: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            pairingCode: { leaf: "text", props: { size: "sm", weight: "semibold" }, optional: true },
            status: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            action: { leaf: "button", repeats: true, restingCount: 1, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need preparation read before session creation, then the server-returned pairing identity and agent readiness to replace the create action before entry becomes available.",
    },
    "course-playground-session-page": {
        host: "main",
        classes: ["flex", "min-h-screen", "w-full", "min-w-0", "flex-col", "gap-6", "bg-background", "px-6", "py-6"],
        children: {
            leave: { leaf: "button" },
            connection: { leaf: "text", props: { size: "xs", tone: "muted" } },
            title: { leaf: "heading" },
            step: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 4 },
            body: { leaf: "article", optional: true },
            command: { leaf: "code-block", optional: true },
            hint: { leaf: "text", props: { size: "sm" }, optional: true },
            submit: { leaf: "button", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a persistent live workspace to keep connection state and server-owned steps ahead of the selected instruction, with one verification action and completion or failure replacing that instruction without invented client progress.",
    },
    "course-mind-map-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            search: { leaf: "search-box" },
            graphFact: { leaf: "text", props: { size: "xs", tone: "muted" } },
            node: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 6, optional: true },
            selection: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            open: { leaf: "button", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a concept map with search and graph scale ahead of one selectable backend node field, exposing an open action only when the selected node resolves to a real course route.",
    },
    "course-mock-interview-setup-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            levelLabel: { leaf: "text", props: { size: "sm", tone: "muted" } },
            level: { leaf: "button", repeats: true, restingCount: 3 },
            modeLabel: { leaf: "text", props: { size: "sm", tone: "muted" } },
            mode: { leaf: "button", repeats: true, restingCount: 2 },
            status: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            action: { leaf: "button", repeats: true, restingCount: 2 },
        },
        why: "Use this when you need a green room to ask for seniority before format and report persisted session state before start or resume, keeping each decision in a named place within one narrow reading column.",
    },
    "course-mock-interview-session-page": {
        host: "main",
        classes: ["flex", "min-h-screen", "w-full", "min-w-0", "flex-col", "gap-6", "bg-background", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            progress: { composite: "labelled-progress-row" },
            remaining: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            notice: { leaf: "text", props: { size: "sm" } },
            turn: { layout: "centred-title-pair", repeats: true, restingCount: 3 },
            streaming: { layout: "centred-title-pair", optional: true },
            answerLabel: { leaf: "text", props: { size: "sm", weight: "medium" } },
            answer: { leaf: "textarea" },
            action: { leaf: "button", repeats: true, restingCount: 3 },
            workspaceTitle: { leaf: "heading" },
            workspace: { leaf: ["code-block", "text"] },
        },
        why: "Use this when you need a live room read from the current prompt and server clock through persisted conversation into one answer decision, with the question workspace following as supporting evidence instead of a second untyped page frame.",
    },
    "course-mock-interview-result-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-lg", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            notice: { composite: "empty-notice", optional: true },
            grading: { leaf: "progress", optional: true },
            scoreLabel: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            score: { leaf: "heading", optional: true },
            verdict: { layout: "centred-title-pair", optional: true },
            phaseTitle: { leaf: "heading", optional: true },
            phase: { composite: "labelled-progress-row", repeats: true, restingCount: 3, optional: true },
            strengthsTitle: { leaf: "heading", optional: true },
            strength: { leaf: "text", props: { size: "sm" }, repeats: true, restingCount: 3, optional: true },
            gapsTitle: { leaf: "heading", optional: true },
            gap: { leaf: "text", props: { size: "sm" }, repeats: true, restingCount: 3, optional: true },
            reviewsTitle: { leaf: "heading", optional: true },
            review: { composite: "evidence-row", repeats: true, restingCount: 3, optional: true },
            action: { leaf: "button", repeats: true, restingCount: 2 },
        },
        why: "Use this when you need a persisted debrief to move from outcome to rubric, then strengths and gaps to question evidence, and close with the next interview action while grading and recovery replace evidence without changing the page owner.",
    },
    "course-learn-challenge-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            body: { layout: "stacked-peer-controls" },
        },
        why: "Use this when you need a challenge read from its authored brief into one ordered run of deliverables and submission controls while pending, editing, submitting, passed, and failed states keep the same dedicated route identity.",
    },
    "course-learn-challenge-result-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            score: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            body: { layout: "stacked-peer-controls" },
        },
        why: "Use this when you need a persisted challenge result to keep its score, scorer findings, and retry-or-continue decision under one identity while loading and recovery replace only the evidence body.",
    },
    "flashcard-mode-tabs": {
        host: "nav",
        classes: ["flex", "flex-row", "gap-2", "border-b", "border-separator"],
        children: {
            tab: { leaf: "nav-link", props: { kind: "tab" }, repeats: true, restingCount: 2 },
        },
        why: "Use this when you need a shared tab row switching between two peer modes of the same flashcard capability (e.g. review vs quiz), with the active mode carried as a fact on each typed nav-link tab rather than as separate page state.",
    },
    "flashcard-review-due-card": {
        classes: ["flex", "flex-col", "gap-3", "rounded-xl", "border", "border-separator", "p-4"],
        children: {
            title: { leaf: "heading" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            fact: { leaf: "text", props: { size: "sm", weight: "medium" } },
            action: { leaf: "button", optional: true },
        },
        why: "Use this when you need a single resumable due-work card that names and explains one batch of work, states its size as one fact, and offers at most one start-or-resume action.",
    },
    "flashcard-review-deck-card": {
        classes: ["flex", "flex-col", "gap-3", "rounded-xl", "border", "border-separator", "p-4"],
        children: {
            title: { leaf: "heading" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            facts: { leaf: "text", props: { size: "xs", tone: "muted" } },
            action: { leaf: "button" },
        },
        why: "Use this when you need a repeatable card for one deck among several comparable study offers, each stating its identity, explanation and card count ahead of an always-present start action.",
    },
    "course-flashcards-review-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            modes: { layout: "flashcard-mode-tabs" },
            due: { layout: "flashcard-review-due-card", optional: true },
            stats: { layout: "centred-title-pair", optional: true },
            decksTitle: { leaf: "heading", optional: true },
            deck: { layout: "flashcard-review-deck-card", repeats: true, restingCount: 4, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a review overview whose identity and mode switch stay stable while pending, recovery, and ready states replace only the study evidence ordered as due work, progress, then peer decks.",
    },
    "flashcard-quiz-configuration": {
        classes: ["flex", "flex-col", "gap-4", "rounded-xl", "border", "border-separator", "p-4"],
        children: {
            title: { leaf: "heading" },
            fact: { leaf: "text", props: { size: "sm", tone: "muted" } },
            resume: { leaf: "button", optional: true },
            modeLabel: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            mode: { leaf: "button", repeats: true, restingCount: 2 },
            levelLabel: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            level: { leaf: "button", repeats: true, restingCount: 5 },
            start: { leaf: "button" },
        },
        why: "Use this when you need one setup card that walks a quiz configuration in order — an existing session to resume, then mode choice, then level choice — ending in one action that commits the selection.",
    },
    "course-flashcards-quiz-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "centred-title-pair" },
            modes: { layout: "flashcard-mode-tabs" },
            configuration: { layout: "flashcard-quiz-configuration", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a quiz route to keep shared flashcard identity and its mode switch above one finite configuration surface while empty or failed transport replaces only that setup decision.",
    },
    "flashcard-session-header": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-separator", "py-3"],
        children: {
            deck: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            title: { leaf: "heading" },
            leave: { leaf: "button" },
        },
        why: "Use this when you need a session header that keeps the active deck and title identifiable on one side and a leave action pinned on the other through every lifecycle state.",
    },
    "flashcard-session-card": {
        classes: ["flex", "flex-1", "flex-col", "justify-center", "gap-6", "rounded-2xl", "border", "border-separator", "p-6"],
        children: {
            prompt: { leaf: "text", props: { size: "md", weight: "medium" } },
            answer: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
        },
        why: "Use this when you need the one focused reading surface of a flashcard session, where the prompt owns the available height and a revealed answer appears only as supporting evidence beneath it.",
    },
    "course-flashcard-session-page": {
        host: "main",
        classes: ["mx-auto", "flex", "min-h-screen", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "flashcard-session-header" },
            progress: { layout: "label-with-muted-fact-row", optional: true },
            card: { layout: "flashcard-session-card", optional: true },
            status: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            action: { leaf: "button", repeats: true, restingCount: 4, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a live session to preserve orientation before progress and one focused card, exposing only actions admitted by the current reveal and transport state while recovery replaces the card but never the page owner.",
    },
    "flashcard-result-stat": {
        classes: ["flex", "flex-col", "gap-2", "rounded-xl", "border", "border-separator", "p-4"],
        children: {
            label: { leaf: "text", props: { size: "xs", tone: "muted" } },
            value: { leaf: "heading" },
        },
        why: "Use this when you need a repeatable stat tile for one labelled measurement (score, reviewed cards, XP, duration), with a quiet label preceding a stronger value.",
    },
    "flashcard-result-fact-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "justify-between", "gap-2", "rounded-xl", "p-4"],
        children: {
            label: { leaf: "text", props: { size: "sm", weight: "medium" } },
            value: { leaf: "text", props: { size: "sm", tone: "muted" } },
        },
        why: "Use when you need a row pairing a label, such as a breakdown grade or weak-topic name, with one persisted value on the same baseline, so every result fact reads as the same two-part shape.",
    },
    "course-flashcard-result-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            mode: { leaf: "text", props: { size: "sm", tone: "muted" } },
            header: { layout: "centred-title-pair" },
            stat: { layout: "flashcard-result-stat", repeats: true, restingCount: 4, optional: true },
            nextDue: { layout: "centred-title-pair", optional: true },
            breakdownTitle: { leaf: "heading", optional: true },
            grade: { layout: "flashcard-result-fact-row", repeats: true, restingCount: 4, optional: true },
            weakTopicsTitle: { leaf: "heading", optional: true },
            weakTopic: { layout: "flashcard-result-fact-row", repeats: true, restingCount: 3, optional: true },
            action: { leaf: "button", repeats: true, restingCount: 2, optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a persisted flashcard result read from route mode and outcome through comparable summary figures and optional evidence, closing with back and repeat actions while loading and failure retain the same identity.",
    },
    "nav-over-body-page": {
        classes: ["flex", "min-h-screen", "w-full", "flex-col"],
        children: {
            navigation: { layout: "double-navbar" },
            body: { layout: "routed-page-main" },
        },
        why: "Use when you need a full-height shell where global navigation sits as a sibling of the routed body rather than wrapping it, so a route change repaints only the body and never tears the nav down; reach for this when the body also needs its own reading measure because a column running the full width of a desktop screen cannot be scanned.",
    },
    "routed-page-main": {
        // The document's one main landmark. The key's name has said so all along; now the entry
        // does, instead of a second frame component existing to swap the tag.
        host: "main",
        classes: ["flex", "min-w-0", "grow", "flex-col"],
        children: {
            page: { leaf: "page" },
        },
        why: "Use when you need the document's single main landmark to host a routed page, so a reader can skip past navigation straight to it; it fills the height the navbar leaves and defers any content measure to the page inside rather than deciding one itself.",
    },
    "centred-authentication-page": {
        classes: ["flex", "min-h-screen", "w-full", "items-center", "justify-center", "p-6"],
        children: {
            surface: { layout: "authentication-panel-card" },
        },
        why: "Use when you need a full-height page whose only task is one bounded authentication surface, centred visually instead of following a dashboard's rail-and-main reading order.",
    },
    "authentication-panel-card": {
        classes: ["w-full", "max-w-md", "p-4"],
        children: {
            panel: { layout: "centred-page-column" },
        },
        why: "Use when you need a fixed max-width card that bounds a single authentication control group as one visual unit, while leaving the form panel inside to own its own field rhythm.",
    },
    "title-with-end-action": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            title: { leaf: "heading" },
            end: { leaf: ["button", "see-more-link"], optional: true },
        },
        why: "if you need a title with one control at the far end of its own line, read name-first then action-second, where the control wraps to a line below rather than squeezing the title when space runs out.",
    },
    "title-with-baseline-fact": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "gap-2"],
        children: {
            title: { leaf: "heading" },
            fact: { leaf: "text", props: { size: "sm", tone: "muted" } },
        },
        why: "if you need one short muted fact to read as part of the heading sentence, sitting on the title's own baseline and wrapping beneath it rather than narrowing the title.",
    },
    "profile-tabs-over-body": {
        classes: ["flex", "w-full", "flex-col"],
        children: {
            tabs: { layout: "underlined-tab-strip" },
            body: { layout: "profile-page-measure" },
        },
        why: "if you need persistent tab chrome bound directly above the one measured body it switches, as one owned layout piece rather than a second layer floating over the content.",
    },
    "profile-page-measure": {
        classes: ["@container", "mx-auto", "w-full", "max-w-app-xl"],
        children: { inset: { layout: "profile-page-inset" } },
        why: "if you need a container that holds a wider legacy content measure than the narrower dashboard width cap it would otherwise inherit.",
    },
    "profile-page-inset": {
        classes: ["p-6"],
        children: { shell: { layout: "profile-rail-container" } },
        why: "if you need page padding added inside an already width-capped container without shrinking the measure its container-query breakpoints observe.",
    },
    "profile-rail-container": {
        classes: ["@container", "w-full"],
        children: { split: { layout: "profile-rail-then-main" } },
        why: "if you need a rail/main split whose breakpoint measures its own region's width rather than an ancestor's, so the split stays self-contained.",
    },
    "profile-rail-then-main": {
        classes: ["flex", "w-full", "flex-col", "gap-6", "@app-md:flex-row", "@app-md:items-start", "@app-md:gap-8"],
        children: {
            rail: { layout: "profile-identity-rail" },
            main: { layout: ["profile-main", "centred-empty-notice"] },
        },
        why: "if you need identity content to hold a stable reading width beside flexible evidence on wide screens, then stack above that evidence once the screen narrows.",
    },
    "profile-identity-rail": {
        classes: ["flex", "w-full", "shrink-0", "flex-col", "@app-md:w-72"],
        children: {
            hero: { layout: "profile-hero-rail" },
        },
        why: "if you need a profile rail wrapping one identity hero as a single owned object, rather than splitting identity across separate unrelated cards.",
    },
    "profile-main": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-6"],
        children: {
            section: { layout: ["label-row-over-card", "profile-overview-skill-grid"], repeats: true, restingCount: 4 },
        },
        why: "if you need a vertical stack of independently landing, labelled evidence sections, each separated by the same reading gap.",
    },
    "learner-profile-overview": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-6"],
        children: {
            view: { leaf: "choice-tabs", optional: true },
            progress: { layout: "learner-progress-snapshot", optional: true },
            wrapped: { layout: "learner-wrapped-summary", optional: true },
            public: { layout: "centred-empty-notice", optional: true },
        },
        why: "Use when you need a view switcher to lead a learner's private progress evidence while a public-preview mode stays an explicit, truthful alternate state rather than a silent substitution.",
    },
    "learner-progress-snapshot": {
        classes: ["flex", "flex-col", "gap-5", "p-4"],
        children: {
            metrics: { layout: "profile-metric-ribbon" },
            level: { composite: "labelled-progress-row" },
            notice: { layout: "centred-empty-notice", optional: true },
        },
        why: "Use when you need learning totals to scan together as one metric group before a level bar explains the learner's next milestone.",
    },
    "learner-wrapped-summary": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: {
            heading: { leaf: "heading" },
            metrics: { layout: "profile-metric-ribbon", optional: true },
            notice: { layout: "centred-empty-notice", optional: true },
            action: { leaf: "button", optional: true },
        },
        why: "Use when you need one compact period summary that either shows verified statistics or clearly explains why that period is locked, never a blank or ambiguous state.",
    },
    "learner-wrapped-page": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-6"],
        children: { period: { leaf: "choice-tabs" }, summary: { layout: "learner-wrapped-summary" } },
        why: "Use this when you need a period switcher bound to exactly one summary view, so changing the period swaps only that summary rather than navigating away or duplicating the page.",
    },
    "profile-overview-skill-grid": {
        classes: ["grid", "grid-cols-1", "gap-6", "sm:grid-cols-2"],
        children: {
            section: { layout: "label-row-over-card", repeats: true, restingCount: 2 },
        },
        why: "if you need exactly two labelled evidence sections that stack on narrow screens and sit side by side only once both keep a readable width.",
    },
    "profile-metric-ribbon": {
        classes: ["grid", "grid-cols-2", "gap-3", "p-4", "sm:grid-cols-4"],
        children: { metric: { composite: "profile-metric", repeats: true, restingCount: 4 } },
        why: "if you need up to four composite proof metrics shown as equal-weight peers in a ribbon that reflows from two columns to four as width allows.",
    },
    "profile-breakdown-stack": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: { breakdown: { layout: "profile-breakdown", repeats: true, restingCount: 3 } },
        why: "if you need several independent evidence breakdowns (such as difficulty, topic and language) stacked vertically while each keeps its own label and visual distinct.",
    },
    "profile-breakdown": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            label: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            visual: { layout: ["profile-segment-run", "profile-topic-chip-run"] },
            caption: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
        },
        why: "if you need one labelled breakdown pairing a single compact visual (a segment run or topic-chip run) with an optional explanatory caption.",
    },
    "profile-segment-run": {
        classes: ["flex", "flex-row", "overflow-hidden", "rounded-xl"],
        children: { segment: { composite: "profile-segment", repeats: true, restingCount: 3 } },
        why: "if you need several distribution segments joined into one bounded, rounded run so their relative contribution reads as a single whole rather than separate progress bars.",
    },
    "profile-segment-piece": {
        classes: ["flex-1", "p-2", "text-center"],
        children: { value: { leaf: "text", props: { size: "xs", tone: "muted" } } },
        why: "if you need one proportional slice inside a segment run that still displays its own count value alongside its peers.",
    },
    "profile-topic-chip-run": {
        classes: ["flex", "flex-row", "flex-wrap", "gap-2"],
        children: { topic: { leaf: "badge", repeats: true, restingCount: 4 } },
        why: "if you need a wrapping row of compact topic-count badges that wrap onto new lines as peers before any single label gets squeezed or clipped.",
    },
    "profile-achievement-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2", "lg:grid-cols-3"],
        children: { achievement: { composite: "profile-achievement", repeats: true, restingCount: 3 } },
        why: "if you need a responsive grid of equal achievement cards that gains columns only while each card's name and rarity stay readable.",
    },
    "profile-achievement-card": {
        classes: ["flex", "flex-col", "gap-2", "p-4"],
        children: {
            mark: { leaf: "icon-tile" },
            name: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            rarity: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "if you need one achievement's icon mark, name and rarity combined into a single earned-proof unit rather than three separate, detached facts.",
    },
    "profile-toolbar-over-list": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: { toolbar: { layout: "profile-search-filter-row" }, list: { layout: "profile-evidence-list" } },
        why: "if you need a search/filter toolbar bound directly above the one evidence list it modifies, rather than floating at the whole-route level.",
    },
    "profile-search-filter-row": {
        classes: ["flex", "flex-row", "items-center", "justify-between", "gap-3"],
        children: { search: { leaf: "search-box" }, filter: { leaf: "button" } },
        why: "if you need a control row where a flexible search box owns most of the width and a short filter action stays pinned visible at its end.",
    },
    "profile-cv-page": {
        classes: ["flex", "flex-col", "gap-6"],
        children: { action: { leaf: "button", optional: true }, paper: { layout: "profile-cv-paper" } },
        why: "Use this when you need an owner-only action kept outside the read-only CV document surface, so the action never reads as part of the CV itself.",
    },
    "profile-cv-paper": {
        classes: ["mx-auto", "w-full", "max-w-app-lg", "overflow-hidden", "p-4"],
        children: { document: { leaf: "profile-cv-document" } },
        why: "if you need a document rendered on one bounded-width paper surface, readable without acquiring unrelated profile-card chrome.",
    },
    "profile-proof-header": {
        classes: ["flex", "flex-col", "gap-3"],
        children: { back: { leaf: "button" }, title: { leaf: "heading" }, meta: { leaf: "text", props: { size: "sm", tone: "muted" } } },
        why: "if you need a back action, a proof title and a qualifier combined into one orientation block that sits before detailed evidence begins.",
    },
    "profile-coding-statement": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: { statement: { leaf: "text" }, tags: { layout: "profile-topic-chip-run", optional: true } },
        why: "if you need a coding proof's problem statement and optional topic tags shown, never the underlying source, before its submission evidence.",
    },
    "profile-coding-detail-main": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-6"],
        children: {
            header: { layout: "profile-proof-header" },
            section: { layout: "label-row-over-card", repeats: true, restingCount: 2 },
        },
        why: "Use this when you need a coding-proof detail page combining one route-local orientation header with two independently bounded evidence sections beneath it, such as the statement and the submission proof.",
    },
    "profile-proof-metrics": {
        classes: ["grid", "grid-cols-2", "gap-3", "p-4", "sm:grid-cols-4"],
        children: { metric: { layout: "profile-proof-metric", repeats: true, restingCount: 4 } },
        why: "if you need up to four standing (non-composite) proof metrics arranged as equal peers in the same two-to-four column responsive ribbon layout.",
    },
    "profile-proof-metric": {
        classes: ["flex", "flex-col", "gap-1"],
        children: { figure: { leaf: "text" }, label: { leaf: "text", props: { size: "xs", tone: "muted" } } },
        why: "if you need a proof figure paired with its short qualifier label as one metric sentence, so the two never split into separate rows.",
    },
    "profile-project-card-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2"],
        children: { card: { layout: "profile-project-card", repeats: true, restingCount: 2 } },
        why: "if you need pinned project proof cards laid out single-column on a narrow screen and as two equal peer columns once each card keeps readable title and description width.",
    },
    "profile-project-card": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: {
            badge: { leaf: "badge" },
            title: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            description: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            tech: { layout: "profile-project-tech-run", optional: true },
        },
        why: "if you need one bounded portfolio proof card that combines a verification badge, project title, an optional description, and an optional technology run.",
    },
    "profile-project-tech-run": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: { tech: { leaf: "badge", repeats: true, restingCount: 3 } },
        why: "if you need a compact, wrapping run of technology badges inside a project card, so the list wraps instead of widening or truncating the card.",
    },
    "profile-proof-summary": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            back: { leaf: "button" },
            title: { leaf: "heading" },
            meta: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            progress: { leaf: "progress", optional: true },
        },
        why: "if you need a header that orients the reader before detailed evidence, combining a back action, proof identity, an optional qualifier, and an optional completion measure.",
    },
    "profile-detail-toolbar": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            search: { leaf: "input" },
            filter: { leaf: "button", optional: true },
            fact: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
        },
        why: "if you need a control row combining search, an optional filter action, and an optional result-count fact, wrapping before any control becomes unreadable.",
    },
    "profile-roadmap-list": {
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "p-0"],
        children: { milestone: { composite: "evidence-row", repeats: true, restingCount: 4 } },
        why: "if you need an ordered list of milestones sharing one joined proof list, where separators preserve the sequence instead of turning every milestone into its own card.",
    },
    "profile-hero-rail": {
        classes: ["flex", "flex-col", "gap-4"],
        children: {
            avatar: { leaf: "avatar" },
            identity: { layout: "profile-name-role-stack" },
            bio: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            facts: { layout: "profile-fact-run", optional: true },
            proof: { layout: "profile-proof-row" },
            actions: { layout: "profile-action-row" },
            meta: { layout: "profile-meta-list", optional: true },
        },
        why: "if you need a frameless identity rail combining avatar, name/role identity, optional bio context, optional peer facts, public proof, one contextual action row, and optional supporting links, with no surface boundary invented around them.",
    },
    "profile-name-role-stack": {
        classes: ["flex", "min-w-0", "flex-col", "gap-1"],
        children: {
            name: { leaf: "heading" },
            handle: { leaf: "text", props: { size: "xs", tone: "muted" } },
            role: { leaf: "text", props: { size: "sm" }, optional: true },
        },
        why: "if you need a person's display name paired tightly with their public handle and an optional role as one identity sentence, rather than as competing headings.",
    },
    "profile-fact-run": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            fact: { leaf: "badge", repeats: true, restingCount: 2 },
        },
        why: "if you need a run of short peer facts (such as location or work mode) that wrap together before either fact forces the identity column wider.",
    },
    "profile-proof-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "gap-2"],
        children: {
            fact: { leaf: "text", props: { size: "sm", weight: "semibold" }, repeats: true, restingCount: 2 },
        },
        why: "if you need peer social-proof facts (such as follower count and standing) sharing one text baseline, so they scan as evidence without either becoming a second profile heading.",
    },
    "profile-action-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "gap-2", "[&>*:first-child]:grow"],
        children: {
            primary: { leaf: "button" },
            share: { leaf: "icon-button" },
        },
        why: "Use this when you need one primary contextual action that owns the available width, paired with a compact secondary share action beside it that never competes as a second primary.",
    },
    "profile-meta-list": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            item: { leaf: ["link", "text"], repeats: true, restingCount: 3 },
        },
        why: "Use this when you need a stack of supporting peer rows after the action row (such as external identities and joined date) that scan together without acquiring their own card or heading.",
    },
    "profile-evidence-list": {
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "p-0"],
        children: {
            evidence: { composite: "evidence-row", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need a generic joined list of proof records with full-width separators keeping the scan continuous, where each row owns its own title, qualifier and trailing fact.",
    },
    "evidence-title-subtitle-fact-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "justify-between", "gap-4", "p-4", "[&>*:first-child]:min-w-0", "[&>*:first-child]:grow"],
        children: {
            identity: { layout: "evidence-title-over-subtitle" },
            fact: { leaf: ["badge", "text"], optional: true },
            disclosure: { leaf: "icon", optional: true },
        },
        why: "if you need an evidence row where a title-and-qualifier identity block owns the available width while a short trailing proof fact and an optional disclosure stay scannable at the end, without pushing the title onto an anonymous second line.",
    },
    "evidence-title-over-subtitle": {
        classes: ["flex", "min-w-0", "flex-col", "gap-1"],
        children: {
            title: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            subtitle: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
        },
        why: "if you need a proof title with an optional smaller qualifying line stacked directly beneath it, rather than placed as a peer fact elsewhere in the row.",
    },
    "dashboard-rail-then-main": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "md:gap-8", "px-6", "py-6", "md:flex-row", "md:items-start", "md:[&>*:first-child]:w-72", "md:[&>*:first-child]:shrink-0", "md:[&>*:last-child]:min-w-0", "md:[&>*:last-child]:grow"],
        children: {
            rail: { layout: "dashboard-rail" },
            main: { layout: ["dashboard-main", "dashboard-tab-main", "centred-empty-notice"] },
        },
        why: "Use this when you need a two-column dashboard layout where a fixed 288px-wide rail sits beside a flexible main column and stacks above it on a narrow screen, without becoming a card or a sticky viewport of its own.",
    },
    "dashboard-rail": {
        classes: ["flex", "w-full", "flex-col", "gap-6"],
        children: {
            section: { layout: ["stacked-stat-rows", "label-row-over-card"], repeats: true, restingCount: 2 },
        },
        why: "Use this when you need a bare 288px-wide dashboard rail combining identity-fact rows and quick-destination link rows, with labels aligned and no enclosing surface that would make the rail compete with the content cards.",
    },
    "dashboard-main": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-6"],
        children: {
            section: { layout: ["label-row-over-card", "explore-main"], repeats: true, restingCount: 8 },
        },
        why: "if you need the dashboard's main column to hold a stack of independently loading, labelled sections in one fixed reading order — as many as the product currently shows — without a refactor silently inventing or reordering a section.",
    },
    "dashboard-tab-main": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-6"],
        children: {
            section: { layout: "label-row-over-card", repeats: true, restingCount: 3 },
        },
        why: "if you need a selected dashboard tab to fill the main column with its own independently loading labelled sections in a fixed reading order, without introducing a second column shape just for that tab.",
    },
    "label-row-over-card": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            label: { layout: ["title-with-end-action", "title-with-baseline-fact"] },
            body: { layout: "$content" },
        },
        why: "if you need a section's label to sit outside the surface it names, so a section whose content is itself a set of cards never draws a card inside a card.",
    },
    "empty-notice-card": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: {
            notice: { composite: "empty-notice" },
        },
        why: "if you need a section's empty-state recovery notice bounded inside one card beneath the section label, so its message and way out read as that section's answer rather than as a sibling section.",
    },
    "empty-notice-stack": {
        classes: ["flex", "flex-col", "items-center", "gap-3", "text-center"],
        children: {
            mark: { leaf: "icon-tile", optional: true },
            message: { leaf: "text", props: { size: "sm", tone: "muted" } },
            description: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            action: { leaf: "button", optional: true },
        },
        why: "if you need the centred empty-state content itself: an optional mark (only when the absence has a generic visual identity), a settled message, an optional detail, and an optional recovery action, all in one centred reading order.",
    },
    "resume-item-card": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: {
            title: { leaf: "text", props: { size: "md", weight: "medium" } },
            kind: { leaf: "text", props: { size: "sm", tone: "muted" } },
            resume: { leaf: "see-more-link", optional: true },
        },
        why: "if you need one bounded card identifying a resumable content item by kind and title together with an optional link back into it, since none of the three identifies the item alone.",
    },
    "weekly-challenge-card": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: {
            title: { composite: "weekly-challenge-title" },
            status: { composite: "weekly-challenge-status" },
            passed: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            finishers: { layout: "weekly-challenge-finishers", optional: true },
        },
        why: "Use this when you need one bounded card telling the whole weekly-challenge story - title, timing/status, pass count, and recent finishers - where the finishers only appear as a nested joined list once there are entries.",
    },
    "weekly-challenge-title": {
        classes: ["flex", "flex-row", "items-center", "gap-2", "w-full"],
        children: {
            glyph: { leaf: "icon", optional: true },
            title: { leaf: "text" },
        },
        why: "if you need a challenge's identity title line, where an optional generic practice glyph can lead the title and safely disappear during loading without changing the line's layout.",
    },
    "weekly-challenge-status": {
        classes: ["flex", "flex-row", "items-center", "justify-between", "gap-3", "w-full"],
        children: {
            endsIn: { leaf: "text", props: { size: "xs", tone: "muted" } },
            action: { leaf: ["button", "badge"] },
        },
        why: "if you need a countdown and the viewer's one available action or outcome to share a single row, so the outcome never becomes a second challenge section.",
    },
    "weekly-challenge-finisher-row": {
        classes: ["flex", "flex-row", "items-center", "gap-3", "w-full"],
        children: {
            avatar: { leaf: "avatar" },
            name: { leaf: "text" },
            passedAt: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use this when you need to identify one recent finisher by avatar and username with a relative pass time trailing on the same baseline - not a generic account stat row.",
    },
    "weekly-challenge-finishers": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            finisher: { composite: "weekly-challenge-finisher-row", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need a nested joined list of recent challenge finishers, with full-width separators between rows while avatar, username and relative time stay within each row.",
    },
    "job-readiness-card": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: {
            percentile: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            metrics: { layout: "job-readiness-list" },
            action: { leaf: "button", optional: true },
        },
        why: "if you need a card wrapping a readiness list plus its optional supporting percentile and next-action outcomes; the inner list stays outlined-only since the outer card already supplies elevation.",
    },
    "job-readiness-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            row: { composite: "labelled-progress-row", repeats: true, restingCount: 3 },
        },
        why: "if you need a nested joined list of scored readiness pillars sharing one outlined surface and full-width rules, without adding a second shadow inside a card that already has one.",
    },
    "marked-row-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            // EXTENDED. The slot admitted only the composite, and the composite renders its own
            // `Grammar` - so a row that must be PRESSED could not use this list at all. Admitting the
            // row layout lets a caller wrap the same anatomy in `PressableSurface` instead. The
            // `why` below is unchanged and still true of both: what makes them peers is the mark.
            //
            // A second list entry was the alternative and was refused: its class list would have
            // been identical to this one, which is what `no-duplicate-entry-shape` exists to catch.
            row: { composite: "task-progress-row", layout: "task-mark-title-fact-row", repeats: true, restingCount: 5 },
        },
        why: "if you need a joined list of rows that each carry their own completion mark — something still to finish and something already true, as one statement in two states — with a shared surface and full-width rule (not card spacing) so matching rows stay aligned across side-by-side lists.",
    },
    "rank-title-row": {
        classes: ["flex", "flex-row", "items-center", "gap-2", "w-full", "[&>*:first-child]:w-5", "[&>*:first-child]:shrink-0", "[&>*:first-child]:text-center", "[&>*:first-child]:tabular-nums", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            rank: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            title: { leaf: "text-link", props: { size: "sm" } },
        },
        why: "Use this when you need a row pairing a fixed-width rank number with one actionable title, where the title owns the spare width and the rank column stays comparable down a joined list.",
    },
    "avatar-identity-badge-action-row": {
        classes: ["flex", "flex-row", "items-center", "gap-3", "w-full", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            avatar: { leaf: "avatar" },
            identity: { layout: "name-over-handle" },
            badge: { leaf: "badge", optional: true },
            action: { leaf: "button" },
        },
        why: "if you need a suggested-identity row read in fixed order — avatar recognised first, an optional badge qualifying it only when needed, and an action last — where the name/handle stack owns the flexible middle.",
    },
    "name-over-handle": {
        classes: ["flex", "flex-col", "gap-1"],
        children: {
            name: { leaf: "text-link", props: { size: "sm" } },
            handle: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use this when you need a tight two-line identity stack where a muted handle qualifies the name underneath it without competing with it.",
    },
    "activity-actor-body-time-row": {
        classes: ["flex", "flex-row", "items-start", "gap-3", "w-full", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            avatar: { leaf: "avatar" },
            body: { layout: "activity-sentence-over-reaction" },
            time: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use this when you need a single row reading an activity as actor, event and quiet timestamp, where the event owns the flexible middle and identity/recency stay visible at its edges.",
    },
    "activity-sentence-over-reaction": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            sentence: { layout: "activity-actor-action-target-sentence" },
            reaction: { leaf: "reaction-picker", optional: true },
        },
        why: "Use this when you need an optional reaction control placed beneath a full actor-action-target activity sentence, so the reaction responds to the whole statement rather than one fragment of it.",
    },
    "activity-actor-action-target-sentence": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            actor: { leaf: "text-link", props: { size: "sm" } },
            action: { leaf: "text", props: { size: "sm" } },
            target: { leaf: "text-link", props: { size: "sm" }, optional: true },
        },
        why: "Use this when you need a wrapping actor-action-target sentence whose actor and optional target remain separately clickable names rather than plain text.",
    },
    "contribution-calendar-stack": {
        classes: ["flex", "flex-col", "gap-3", "w-full"],
        children: {
            heading: { layout: "contribution-calendar-heading-row" },
            grid: { leaf: "contribution-grid" },
            footer: { layout: "contribution-calendar-footer-row" },
        },
        why: "if you need a fixed contribution-calendar visualization that closes a year-summary heading, the intrinsic grid plot, and a streak/legend footer into one composite, without owning the grid's own DOM mechanics.",
    },
    "contribution-calendar-heading-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            total: { leaf: "text", props: { size: "xs", tone: "muted" } },
            years: { leaf: "choice-tabs" },
        },
        why: "if you need a header row that pairs an activity-total label with peer year tabs that switch the plot's time window, kept out of the grid's own mechanics.",
    },
    "contribution-calendar-footer-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            streak: { leaf: "text", props: { size: "sm" } },
            intensity: { leaf: "contribution-intensity-legend" },
        },
        why: "if you need a footer row pairing a streak-result caption with an intensity legend that together explain the same contribution plot, which itself stays an intrinsic leaf outside this row.",
    },
    "trending-content-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            item: { composite: "trending-content-row", repeats: true, restingCount: 6 },
        },
        why: "Use this when you need a ranked list of trending-content rows joined by full-width divider rules, preserving a rank-to-title scan without turning each result into a separate card.",
    },
    "activity-feed-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            activity: { composite: "activity-row", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need one day's activities joined into a single list, with each actor/event/response row separated only by a full-width divider rule.",
    },
    "suggested-user-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            user: { composite: "suggested-user-row", repeats: true, restingCount: 4 },
        },
        why: "Use this when you need a scannable list of suggested-user rows, each keeping a profile and its follow action together on one joined surface separated by full-width rules.",
    },
    "explore-main": {
        classes: ["flex", "flex-col", "gap-6", "w-full"],
        children: {
            feed: { layout: "feed-explorer" },
            suggestions: { layout: "suggested-user-list", optional: true },
        },
        why: "Use this when you need a page that places an independently loaded discovery feed above optional follow suggestions, keeping one large seam because the two have separate request lifetimes.",
    },
    "feed-explorer": {
        classes: ["flex", "flex-col", "gap-6", "w-full"],
        children: {
            trending: { layout: "trending-content-list", optional: true },
            stream: { layout: "feed-stream" },
        },
        why: "Use this when you need an optional trending region stacked above a controlled activity stream as two independently stateful discovery regions, separated by a large page seam.",
    },
    "feed-stream": {
        classes: ["flex", "flex-col", "gap-3", "w-full"],
        children: {
            filters: { layout: "dual-tabs-toolbar" },
            feed: { layout: "activity-feed-result" },
            paginationError: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            pagination: { leaf: "button", optional: true },
        },
        why: "Use this when you need a filter toolbar governing a paginated activity-result region beneath it, with the filters and result kept as separate operated units and the finer day-to-card chronology managing its own tighter seam.",
    },
    "activity-feed-result": {
        classes: ["flex", "flex-col", "gap-2", "w-full"],
        children: {
            day: { layout: "activity-day-group", repeats: true, restingCount: 2, optional: true },
            notice: { layout: "empty-notice-card", optional: true },
        },
        why: "Use this when you need the result region of a filtered feed that resolves to either repeating day-grouped activity lists or one explicit empty/error notice, both filling the same governed slot beneath the filters.",
    },
    "activity-day-group": {
        classes: ["flex", "flex-col", "gap-2", "w-full"],
        children: {
            subtitle: { leaf: "text", props: { size: "sm", tone: "muted" } },
            list: { layout: "activity-feed-list" },
        },
        why: "Use this when you need a muted local-day label sitting just above that day's joined activity-row list, kept outside the list's own shared surface with a close seam.",
    },
    "dual-tabs-toolbar": {
        classes: ["flex", "w-full", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            leading: { leaf: "choice-tabs" },
            trailing: { leaf: "choice-tabs" },
        },
        why: "Use this when you need two independent tab-filter axes governing one shared result set inside a single toolbar row, each keeping its own selection state and accessible label without extra container chrome.",
    },
    "changelog-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            entry: { composite: "changelog-entry-row", repeats: true, restingCount: 4 },
        },
        why: "Use this when you need a dated joined history of changelog-entry rows, separated by full-width rules while date, category, title and body all stay in one shared reading column.",
    },
    "changelog-entry-row": {
        classes: ["flex", "w-full", "flex-col", "gap-3"],
        children: {
            meta: { layout: "date-category-row" },
            title: { leaf: ["text", "text-link"], props: { size: "sm" } },
            body: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
        },
        why: "Use this when you need one changelog entry closed as a single dated statement: a date/category line qualifying the title, with an optional smaller muted body explaining that same update beneath it.",
    },
    "date-category-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            date: { leaf: "text", props: { size: "xs", tone: "muted" } },
            category: { leaf: "badge", optional: true },
        },
        why: "Use this when you need a compact metadata line pairing a date with an optional category badge, placed immediately before an update's title.",
    },
    "contribution-calendar-card": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: {
            calendar: { composite: "contribution-calendar" },
        },
        why: "if you need the full contribution-calendar composite (year choice, activity grid, intensity key, streak caption) bounded inside one card surface, rather than split into separate dashboard sections.",
    },
    "weekly-goals-card": {
        classes: ["flex", "flex-col", "gap-3", "p-4"],
        children: {
            summary: { leaf: "text", props: { size: "sm", weight: "medium" } },
            goals: { layout: "bordered-goal-grid" },
        },
        why: "Use when you need a short summary line qualifying a full grid of weekly goals beneath it, on one bounded surface, without the summary being mistaken for one more goal cell.",
    },
    "bordered-goal-grid": {
        classes: ["grid", "grid-cols-2", "overflow-hidden", "rounded-3xl", "border", "border-separator", "[&>*]:p-3", "[&>*:nth-child(odd)]:border-r", "[&>*:nth-child(-n+4)]:border-b", "[&>*]:border-separator"],
        children: {
            goal: { composite: "labelled-progress-row", repeats: true, restingCount: 6 },
        },
        why: "Use when you need up to six compact, comparable goal measures laid out two-per-row inside one bordered grid with shared seams, instead of six separate cards.",
    },
    "course-progress-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            course: { composite: "course-progress-row", repeats: true, restingCount: 2 },
        },
        why: "Use when you need a joined list of enrolled-course rows, each a whole-course destination, separated by full-width dividers for a fast vertical scan.",
    },
    "course-progress-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "gap-4", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            mark: { leaf: "icon-tile" },
            body: { layout: "course-progress-body" },
        },
        why: "Use when you need an enrolled-course row with an icon mark leading a press target whose title, status, progress bars, and legend read as one body, and where hover feedback belongs to the title underlining alone, not to the row dimming.",
    },
    "course-progress-body": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-3"],
        children: {
            heading: { layout: "course-progress-heading" },
            progress: { layout: "segmented-progress-track" },
            legend: { layout: "progress-dimension-legend" },
        },
        why: "Use when you need a course heading with its segmented progress track and matching dimension legend stacked directly beneath it as one compact reading unit.",
    },
    "course-progress-heading": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-2"],
        children: {
            title: { leaf: "text", props: { size: "md", weight: "semibold" } },
            trial: { leaf: "badge", optional: true },
            percent: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use when you need a heading line where the course title reads first at name-weight, with an optional trial badge and the overall completion percent trailing as short qualifiers on the same line.",
    },
    "segmented-progress-track": {
        classes: ["flex", "w-full", "flex-row", "items-center", "gap-1"],
        children: {
            segment: { leaf: "progress", repeats: true, restingCount: 3 },
        },
        why: "Use when you need to show three distinct completion dimensions (e.g. content, challenge, milestone) as adjacent bars representing one overall course outcome, without splitting them into separate cards.",
    },
    "progress-dimension-legend": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-3"],
        children: {
            dimension: { layout: "status-dot-with-label", repeats: true, restingCount: 3 },
        },
        why: "Use when you need a wrapping legend of status dots with labels explaining a segmented progress track it sits directly beneath.",
    },
    "status-dot-with-label": {
        classes: ["flex", "flex-row", "items-center", "gap-2"],
        children: {
            mark: { leaf: "status-dot" },
            label: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use when you need a small semantic dot kept attached to the text that names and counts the dimension it marks, so the dot never floats away from its label.",
    },
    "recommended-course-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: { course: { composite: "recommended-course-row", repeats: true, restingCount: 3 } },
        why: "if you need a joined list of recommended-course offer rows, each carrying title, pricing, and reason, separated by full-width dividers on one surface.",
    },
    "recommended-course-row": {
        classes: ["flex", "w-full", "flex-row", "items-start", "gap-3", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: { mark: { leaf: "icon-tile" }, body: { layout: "recommended-course-body" } },
        why: "if you need a recommended-course row where an icon mark leads a whole-row destination and its commerce facts (price, note, reason) sit together in one flexible column beside it.",
    },
    "recommended-course-body": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-1"],
        children: { title: { leaf: "text", props: { size: "md", weight: "semibold" } }, price: { layout: "price-discount-line" }, note: { layout: "price-note-row", optional: true }, reason: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true } },
        why: "if you need a course offer's title, price with its saving evidence, and suggestion reason stacked in that reading order, with no room for a description paragraph — the shape deliberately excludes one so price and reason stay above the fold.",
    },
    "price-discount-line": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: { price: { leaf: "text", props: { size: "sm", weight: "semibold" } }, original: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true }, discount: { leaf: "badge", optional: true } },
        why: "Use when you need to show a payable price leading, with its original price and a discount badge as optional qualifiers wrapping on the same line.",
    },
    "upcoming-livestream-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: { session: { composite: "upcoming-livestream-row", repeats: true, restingCount: 3 } },
        why: "Use when you need a time-ordered, joined list of upcoming livestream session rows with full-width dividers for a fast scan to the next occurrence.",
    },
    "upcoming-livestream-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "gap-3", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: { mark: { leaf: "icon-tile" }, body: { layout: "evidence-title-over-subtitle" }, time: { leaf: "text", props: { size: "xs", tone: "muted" } } },
        why: "Use when you need a livestream row where an icon mark leads, a flexible title/subtitle body fills the middle, and a concrete time stays visible at the trailing edge of the same destination row.",
    },
    "leaderboard-card": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: { standing: { composite: "leaderboard-standing-row", optional: true }, list: { layout: "ranked-user-list" } },
        why: "Use when you need to show the viewer's own optional standing above a separately-divided ranked list, both on one competition surface.",
    },
    "leaderboard-standing-row": {
        classes: ["flex", "flex-row", "items-center", "gap-3", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: { mark: { leaf: "league-tile" }, body: { layout: "evidence-title-over-subtitle" }, fact: { leaf: "badge", optional: true } },
        why: "Use when you need a standing row where rank artwork and its standing sentence sit directly against each other as one statement, and an optional trailing fact can settle at the far edge without the sentence drifting there when no fact is present.",
    },
    "standing-hero-card": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: { standing: { composite: "leaderboard-standing-row" }, goal: { layout: "standing-goal-meter", optional: true }, action: { leaf: "button" } },
        why: "Use when you need to present a learner's current standing, an optional goal meter showing the distance to the next place, and one action that closes that gap, together as one hero card.",
    },
    "standing-goal-meter": {
        classes: ["flex", "flex-col", "gap-2"],
        children: { label: { leaf: "text", props: { size: "xs", tone: "muted" } }, progress: { leaf: "progress" } },
        why: "Use this when you need a progress bar that also states in words the distance still to cover, since a bar alone shows how full something is but never what filling it would take.",
    },
    "podium": {
        classes: ["flex", "flex-row", "items-end", "justify-center", "gap-4", "w-full", "[&>*:nth-child(1)]:order-2", "[&>*:nth-child(2)]:order-1", "[&>*:nth-child(3)]:order-3"],
        children: { place: { composite: "podium-place", repeats: true, restingCount: 3 } },
        why: "Use this when you need to present exactly three ranked finishers as a dais rather than a list, with first place raised and centered and the visual reordering handled internally so the places still read in rank order.",
    },
    "podium-place": {
        classes: ["flex", "flex-col", "items-center", "gap-2"],
        children: { mark: { leaf: "rank-mark", props: { placement: "row" } }, avatar: { leaf: "avatar" }, name: { leaf: "text" }, points: { leaf: "text", props: { size: "xs", tone: "muted" } }, step: { leaf: "podium-step" } },
        why: "Use this when you need one podium finisher's column — medal, avatar, name, and score stacked above the step whose height itself encodes their place, so the award artwork and the ranking do not have to be inferred from each other.",
    },
    "league-page-column": {
        // The same measure and inset the dashboard uses. The leaderboard is reached from there and
        // returns there, so a second page width would make the chrome appear to shift on a
        // navigation that did not change anything about where the reader is.
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            scope: { layout: "scope-switch-row" },
            board: { layout: "league-board-stack" },
        },
        why: "Use this when you need one board reading column ordered as reader and page identity, selected competition, then that competition, so switching scope changes the answer beneath the question rather than moving the question.",
    },
    "scope-switch-row": {
        // A row, so the switch takes the width of its two words. In the page column it was a
        // direct child of a `flex-col`, which stretches its children - and a segmented control
        // spanning the whole measure reads as a band the page is divided by rather than as one
        // control the reader can press.
        classes: ["flex", "flex-row"],
        children: { tabs: { leaf: "choice-tabs" } },
        why: "Use this when you need a tab/segmented switch to sit at the width of its own options instead of stretching across a flex-col parent, so it reads as a control rather than a band dividing the page.",
    },
    "page-header-stack": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            trail: { leaf: "breadcrumbs", optional: true },
            title: { leaf: "heading" },
        },
        why: "Use this when you need a page header with an optional breadcrumb trail above the title, the trail kept at a smaller scale so it does not compete with the title on one line.",
    },
    "league-board-stack": {
        classes: ["flex", "flex-col", "gap-6"],
        children: {
            hero: { layout: "standing-hero-card" },
            podium: { layout: "podium", optional: true },
            list: { layout: "ranked-user-followable-list" },
        },
        why: "Use this when you need a leaderboard body ordered as the viewer's own standing (the one row they cannot find by scanning), then an optional top-three podium, then the full ranked list of comparable peers.",
    },
    "ranked-user-followable-list": {
        /*
         * The same joined list, plus one track for the follow control.
         *
         * The width lives HERE rather than on the row because whether a board is followable is a
         * property of the BOARD: the dashboard preview has no follow control anywhere and must not
         * reserve a gutter for one, while every row of the leaderboard page needs the same reserved
         * width whether or not that particular row happens to carry a button - the viewer's own row
         * does not, and without the reserved track its score would sit further right than everyone
         * else's. One override on the list keeps both facts in one place instead of forking every
         * row layout in three.
         */
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4", "[&>*:first-child]:rounded-t-3xl", "[&>*:last-child]:rounded-b-3xl", "[&>*]:grid-cols-[auto_auto_1fr_5rem_2.5rem_7rem]"],
        children: { user: { composite: "ranked-user-row", repeats: true, restingCount: 5 } },
        why: "Use this when you need a ranked list where any row may carry a follow action, so every row reserves the same trailing width and scores stay column-aligned whether or not that particular row has the button.",
    },
    "ranked-user-ellipsis-row": {
        classes: ["flex", "flex-row", "items-center", "justify-center", "gap-2", "py-2"],
        children: { label: { leaf: "text", props: { size: "xs", tone: "muted" } } },
        why: "Use this when you need to mark a gap between a fetched slice of ranked rows and a pinned row (such as the viewer's own) that sits far below it, so the two are not read as adjacent.",
    },
    "ranked-user-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4", "[&>*:first-child]:rounded-t-3xl", "[&>*:last-child]:rounded-b-3xl"],
        children: { user: { composite: "ranked-user-row", repeats: true, restingCount: 5 } },
        why: "Use this when you need a plain ranked list of comparable users with no follow action anywhere, aligning rank, identity, points, and movement into one joined board.",
    },
    "ranked-user-row": {
        classes: ["grid", "w-full", "grid-cols-[auto_auto_1fr_5rem_2.5rem]", "items-center", "gap-3", "[&>*:nth-child(3)]:min-w-0", "[&>*:nth-child(4)]:text-right"],
        children: { rank: { leaf: "rank-mark", props: { placement: "row" } }, avatar: { leaf: "avatar" }, identity: { layout: "ranked-user-name-over-subtitle" }, points: { leaf: "text", props: { size: "xs", tone: "muted" } }, movement: { leaf: ["rank-delta-caret", "badge", "text"] }, follow: { leaf: "button", optional: true } },
        why: "Use this when you need a single ranked-user row — rank mark and avatar identifying the learner, identity given the spare width, points kept comparable, and one movement or follow control subordinate at the row end — with no verdict highlighting.",
    },
    "ranked-user-row-success-verdict": {
        classes: ["grid", "w-full", "grid-cols-[auto_auto_1fr_5rem_2.5rem]", "items-center", "gap-3", "pl-4", "inset-shadow-[2px_0_0_0_var(--success)]", "[&>*:nth-child(3)]:min-w-0", "[&>*:nth-child(4)]:text-right"],
        children: { rank: { leaf: "rank-mark", props: { placement: "row" } }, avatar: { leaf: "avatar" }, identity: { layout: "ranked-user-name-over-subtitle" }, points: { leaf: "text", props: { size: "xs", tone: "muted" } }, movement: { leaf: ["rank-delta-caret", "badge", "text"] }, follow: { leaf: "button", optional: true } },
        why: "Use this when you need the standard ranked-user row to also flag positive movement, via a two-pixel success-colored inset band on the row's left edge that stays square since the list itself owns the rounded border.",
    },
    "ranked-user-row-danger-verdict": {
        classes: ["grid", "w-full", "grid-cols-[auto_auto_1fr_5rem_2.5rem]", "items-center", "gap-3", "pl-4", "inset-shadow-[2px_0_0_0_var(--danger)]", "[&>*:nth-child(3)]:min-w-0", "[&>*:nth-child(4)]:text-right"],
        children: { rank: { leaf: "rank-mark", props: { placement: "row" } }, avatar: { leaf: "avatar" }, identity: { layout: "ranked-user-name-over-subtitle" }, points: { leaf: "text", props: { size: "xs", tone: "muted" } }, movement: { leaf: ["rank-delta-caret", "badge", "text"] }, follow: { leaf: "button", optional: true } },
        why: "Use this when you need the standard ranked-user row to also flag negative movement, via a two-pixel danger-colored inset band on the row's left edge that stays square since the list itself owns the rounded border.",
    },
    "ranked-user-name-over-subtitle": {
        classes: ["flex", "min-w-0", "flex-col", "gap-1"],
        children: { name: { leaf: ["text", "text-link"] }, subtitle: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true } },
        why: "Use this when you need a learner's name with an optional qualifier (such as movement or a viewer note) stacked directly beneath it as one identity block, leaving the row's trailing comparison column untouched.",
    },
    "streak-summary-card": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: {
            summary: { layout: "streak-week-with-outcome" },
            nudge: { layout: "streak-daily-nudge", optional: true },
        },
        why: "Use this when you need the week's streak run and an optional next-action nudge shown together in one bounded card, so the nudge explains how a quiet day becomes an active one.",
    },
    "streak-week-with-outcome": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-4"],
        children: {
            week: { composite: "streak-week-run" },
            outcome: { layout: ["streak-empty-prompt", "streak-active-summary"] },
        },
        why: "Use this when you need the week's seven day marks on one side and their outcome or next action on the other, wrapping together in a strip without reserving a false fixed-width aside.",
    },
    "streak-week-run": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            day: { leaf: "day-cell", repeats: true, restingCount: 7 },
        },
        why: "Use this when you need exactly the seven day cells of a streak week as one fixed, reusable sequence, instead of each caller rebuilding the row and its resting count.",
    },
    "streak-empty-prompt": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-center", "gap-4"],
        children: {
            message: { leaf: "text", props: { size: "sm", tone: "muted" } },
            action: { leaf: "button", props: { size: "sm", variant: "primary" } },
        },
        why: "Use this when you need an empty or inactive streak state that pairs its explanation with the single action that resolves it, kept adjacent instead of split into a detached dashboard statistic.",
    },
    "streak-active-summary": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            current: { leaf: "text", props: { size: "sm", weight: "medium" } },
            record: { leaf: "badge" },
        },
        why: "if you need a current streak value and its record/best value to read as one compact line, without a separate column, an invented fixed width, or a decorative icon.",
    },
    "streak-daily-nudge": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-4"],
        children: {
            message: { leaf: "text", props: { size: "sm", weight: "medium" } },
            action: { leaf: "button", props: { size: "sm", variant: "primary" } },
        },
        why: "if you need an idle-today streak's reminder message and the action that preserves it joined into one decision row placed beneath other content, rather than promoted into its own dashboard section.",
    },
    "glyph-title-fact-row": {
        classes: ["flex", "flex-row", "items-center", "gap-2", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            glyph: { leaf: "icon", props: { size: "sm" } },
            title: { leaf: "text", props: { size: "md", tone: "default" } },
            fact: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "if you need a row identified by a leading icon rather than by its own name, with a title that clips instead of pushing content off the end when long, and a quiet fact trailing at the far edge.",
    },
    "task-mark-title-fact-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "gap-2", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            mark: { leaf: "icon" },
            title: { leaf: "text" },
            fact: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "if you need a full-width row with a completion-state mark leading, a title filling the flexible middle, and a quiet target value that stays aligned at the far edge across every row of a joined list.",
    },
    "label-fact-over-progress": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            line: { layout: "label-with-muted-fact-row" },
            progress: { leaf: "progress" },
        },
        why: "if you need a labeled fact row to sit directly above the progress bar it measures, keeping the figure paired with its label rather than floating separately from the bar it describes.",
    },
    "label-with-muted-fact-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "justify-between", "gap-2"],
        children: {
            label: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            fact: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "if you need a row inside a joined list to pair a semibold label with a smaller muted fact on one shared baseline, where list membership alone already identifies the row so no leading icon is needed.",
    },
    "resume-card-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2", "lg:grid-cols-3"],
        children: {
            card: { layout: "resume-item-card", repeats: true, restingCount: 3 },
        },
        why: "if you need a set of resume/next-step cards laid out in a responsive grid running one column on phone, two at mid-width, and three beside a dashboard rail, keeping each card's copy comparable in size across breakpoints.",
    },
    "label-field-hint": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            label: { leaf: "label" },
            field: { leaf: ["input", "field"] },
            hint: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
        },
        why: "if you need a labeled field's optional hint placed under the control itself rather than beside the label, for when the reader only consults it after struggling with the control.",
    },
    "double-navbar": {
        classes: ["sticky", "top-0", "z-50", "w-full", "border-b", "border-separator", "bg-background"],
        children: {
            primary: { layout: "brand-links-then-tools-bar" },
            bottom: { layout: "underlined-tab-strip", optional: true },
        },
        why: "if you need the current page's tab strip to travel with the sticky navbar as one landmark sharing a single bottom border, instead of being drawn as a second, unrelated bar.",
    },
    "brand-links-then-tools-bar": {
        classes: ["flex", "h-16", "min-h-16", "w-full", "flex-row", "items-center", "justify-between", "gap-3", "px-3"],
        children: {
            navigation: { layout: "inline-nav-links" },
            tools: { layout: "inline-tool-row" },
        },
        why: "if you need a navbar row with wayfinding (brand and routes) on the left and action tools on the right, wrapping on narrow widths rather than letting either group be cut off.",
    },
    "inline-nav-links": {
        classes: ["flex", "flex-row", "items-center", "gap-6"],
        children: {
            brand: { leaf: "link", props: { emphasis: "brand" } },
            routes: { layout: "inline-route-links" },
        },
        why: "if you need the product's brand mark sitting beside its route group at the legacy 24px gap, distinct enough to read separately but not detached from the routes it anchors.",
    },
    "inline-route-links": {
        classes: ["hidden", "flex-1", "items-center", "justify-center", "gap-2", "md:flex"],
        children: {
            route: { leaf: "nav-link", props: { kind: "route" }, repeats: true, restingCount: 0 },
        },
        why: "if you need the desktop-only row of route pills at the original 8px gap that disappears as a group below the navigation breakpoint, handing navigation to the compact shell instead.",
    },
    "inline-tool-row": {
        classes: ["flex", "flex-row", "items-center", "gap-2"],
        children: {
            desktop: { layout: "desktop-navbar-tools" },
            tool: { leaf: ["icon-button", "account-menu"], repeats: true, restingCount: 3 },
        },
        why: "if you need desktop-only field controls and round icon/account action buttons to share one centred row despite having different intrinsic heights, so they still align on the same navbar axis.",
    },
    "desktop-navbar-tools": {
        classes: ["hidden", "items-center", "gap-2", "md:flex"],
        children: {
            search: { leaf: "pressable-input-like" },
            locale: { leaf: "icon-button" },
            theme: { leaf: "theme-switch" },
        },
        why: "Use this when you need the desktop-only subgroup of search, locale and theme controls on its own centred axis, so the shorter native theme-switch track does not drop out of alignment against its neighbouring buttons.",
    },
    "underlined-tab-strip": {
        classes: ["w-full"],
        children: {
            tabs: { leaf: "extended-tabs" },
        },
        why: "if you need a tab strip to be the single typed ExtendedTabs primitive (owning inset, compound anatomy, and selected indicator) so no caller can redraw one tab differently from its peers.",
    },
    "centred-page-column": {
        classes: ["mx-auto", "flex", "w-full", "max-w-md", "flex-col", "gap-6"],
        children: {
            header: { layout: "centred-title-pair" },
            body: {
                layout: ["auth-entry-stack", "stacked-peer-controls", "centred-title-pair", "spread-choice-row"],
                leaf: ["form", "divider"],
                repeats: true,
                restingCount: 0,
            },
            footer: { layout: ["spread-choice-row", "centred-prompt-row"], optional: true },
        },
        why: "if you need a surface such as an auth or form page read one control at a time in a centred, narrow column, avoiding a full-desktop-width form where the eye must travel too far between a label and the box it names.",
    },
    "auth-entry-stack": {
        classes: ["flex", "flex-col", "gap-3", "[&>*]:w-full"],
        children: {
            shortcuts: { layout: "auth-shortcuts-over-divider" },
            credentials: { leaf: "form" },
        },
        why: "Use this when you need to join an OAuth shortcut block to a credentials form beneath it as the two entry blocks of an auth surface, kept at the tighter gap-3 because the OR divider between them already draws the boundary a wider gap would otherwise have to supply.",
    },
    "centred-title-pair": {
        classes: ["flex", "flex-col", "gap-3", "items-center", "text-center"],
        children: {
            title: { leaf: "heading" },
            description: { leaf: "text", props: { size: "sm" } },
        },
        why: "if you need a centred title with a supporting description directly beneath it rather than beside it, so the pair reads as the surface's own name rather than the first row of its content.",
    },
    "auth-shortcuts-over-divider": {
        classes: ["flex", "flex-col", "gap-3", "[&>*]:w-full"],
        children: {
            shortcut: { leaf: "button", repeats: true, restingCount: 2 },
            divider: { leaf: "divider" },
        },
        why: "Use this when you need a cluster of OAuth shortcut buttons followed by an OR divider that closes off the alternative-entry choice before a credential form begins — it keeps the cluster's tighter gap rather than the larger seam used between separate form groups.",
    },
    "stacked-peer-controls": {
        classes: ["flex", "flex-col", "gap-4", "[&>*]:w-full"],
        children: {
            control: {
                layout: "spread-choice-row",
                leaf: ["button", "confirm-button", "quick-action-row", "quick-actions-list", "text"],
                composite: ["field", "labelled-progress-row", "stat-row"],
                repeats: true,
                restingCount: 3,
            },
        },
        why: "Use this when you need a vertical stack of mixed-type peer controls (fields, buttons, action rows, stat rows) that must each stay independently legible while still reading as one form through shared width and an ordinary row gap.",
    },
    "stacked-stat-rows": {
        classes: ["flex", "flex-col", "p-0", "[&>*]:w-full", "[&>*]:p-2"],
        children: {
            stat: { composite: "stat-row", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need a column of standing figure rows (icon, label, value) to read like peer select rows with no inset or gap breaking the scan, matching the element geometry of a select-style list beneath it.",
    },
    "profile-over-stat-rows": {
        classes: ["flex", "flex-col", "gap-3", "[&>*]:w-full"],
        children: {
            profile: { composite: "profile-row" },
            stats: { layout: "stacked-stat-rows" },
        },
        why: "Use this when you need a person's identity block stacked above their group of standing stat rows, with a wider seam between the profile and the figure list than between the figures themselves, because they are two distinct groups.",
    },
    "profile-avatar-name-handle-disclosure-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "justify-between", "gap-3", "px-2", "py-2", "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow"],
        children: {
            avatar: { leaf: "avatar" },
            identity: { layout: "profile-name-over-handle" },
            disclosure: { leaf: "icon" },
        },
        why: "Use this when you need a tappable identity row — avatar, then a name-over-handle stack that owns the remaining width, then a trailing disclosure icon signalling the row leads somewhere else.",
    },
    "profile-name-over-handle": {
        classes: ["flex", "min-w-0", "flex-col", "gap-1"],
        children: {
            name: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            handle: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use this when you need a tight two-line identity stack — display name above @handle — where the handle qualifies the name without competing with it for attention.",
    },
    "spread-choice-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            choice: { leaf: ["checkbox", "text-link"] },
            exit: { leaf: "text-link", props: { size: "sm" }, optional: true },
        },
        why: "Use this when you need a single line offering a selectable choice and an exit from it as two peers a reader picks BETWEEN, pushed to opposite ends of the row rather than laid out as a label and the thing it names.",
    },
    "centred-prompt-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-center", "gap-2"],
        children: {
            prompt: { leaf: "text", props: { size: "sm", tone: "muted" } },
            action: { leaf: "text-link", props: { size: "sm" } },
        },
        why: "Use this when you need a prompt and its action link to read as one sentence — sharing a single centred line rather than splitting across two lines, which would read as two separate, unrelated offers.",
    },
    "centred-empty-notice": {
        classes: ["flex", "flex-col", "items-center", "gap-3", "p-4", "text-center"],
        children: {
            notice: { composite: "empty-notice" },
        },
        why: "Use this when you need a centred empty-state region that carries its own recovery action built in, so a caller does not have to remember to add one beside it.",
    },
    /*
     * PROPOSED - learn-content-page. Target path on materialization: the locked table.
     *
     * The reader read top to bottom: where this content sits and what it is called, which of the
     * content's own faces is open, the face itself, then what the reader does next. Everything below
     * the body is evidence about the content rather than the content, which is why they are peers of
     * the body rather than parts of it.
     */
    /*
     * PROPOSED - the reader, rebuilt from `pages/ContentPage` at 9a19342 rather than from a
     * reading of it. The legacy page is three blocks at one seam - header, tab bar, and a
     * ZERO-gap column holding the reading region above its footer - and that last seam is the
     * detail a redrawing loses: reading region, footer and advertisement sit flush there, each
     * owning its own trailing space, because a gap between them would separate a content from the
     * chrome that belongs to it.
     */
    "content-reading-column": {
        classes: ["flex", "w-full", "min-w-0", "flex-col"],
        children: {
            reading: { layout: "content-reading-paper" },
            footer: { layout: "content-reader-footer", optional: true },
        },
        why: "if you need the article and its footer chrome to sit flush with no seam between them, because each already closes with its own trailing space and a gap here would read as the page changing subject.",
    },
    "content-reading-paper": {
        classes: ["mx-auto", "flex", "w-full", "min-w-0", "max-w-app-md", "flex-col", "gap-4", "p-4"],
        children: {
            hint: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            article: { leaf: "article" },
            paywall: { composite: "empty-notice", optional: true },
        },
        why: "if you need the article rendered on its own raised page separate from surrounding chrome, with a paywall notice joining inside alongside the faded article when the content is locked, so the reader can see what they'd be paying for.",
    },
    "content-reader-footer": {
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-6"],
        children: {
            reactions: { layout: "content-reaction-card", optional: true },
            discussion: { layout: "content-discussion-panel", optional: true },
            next: { layout: "content-next-list", optional: true },
            pager: { leaf: "pagination", optional: true },
        },
        why: "if you need the run of stand-alone blocks that follow content — reactions, discussion, next-up, pager — each spaced at the block seam as independent peers, and omitted entirely when the content is locked.",
    },
    "content-discussion-panel": {
        host: "section",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-4", "p-4"],
        children: {
            title: { leaf: "heading" },
            composer: { leaf: "textarea", optional: true },
            submit: { leaf: "button", optional: true },
            notice: { composite: "empty-notice", optional: true },
            list: { layout: "content-discussion-list", optional: true },
        },
        why: "if you need a self-contained discussion block — heading, one top-level composer, and the settled comment list — held at reading width so posting only changes the action state.",
    },
    "content-discussion-list": {
        host: "ul",
        classes: ["flex", "w-full", "flex-col", "divide-y", "divide-separator"],
        children: {
            comment: { layout: "content-discussion-comment-row", repeats: true, restingCount: 3 },
        },
        why: "if you need an ordered list of top-level comment rows on the same lesson, joined by a stable divider, rather than rendered as unrelated cards.",
    },
    "content-discussion-comment-row": {
        host: "li",
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-2", "py-3"],
        children: {
            author: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            meta: { leaf: "text", props: { size: "xs", tone: "muted" } },
            body: { leaf: "text", props: { size: "sm" } },
        },
        why: "if you need a single comment row that fixes the reading order as author, then time-and-reply metadata, then body, so the metadata cannot be mistaken for the authored response.",
    },
    "content-reaction-card": {
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-row", "items-center", "gap-3", "p-4", "[&>*:first-child]:grow"],
        children: {
            prompt: { leaf: "text", props: { size: "sm", tone: "muted" } },
            reactions: { leaf: "reaction-picker" },
        },
        why: "if you need a reaction control set held to the reading measure but on its own ground rather than loose beneath the article, so it doesn't read as the article's last line.",
    },

    /*
     * PROPOSED - the reader's frame, and the two rails the plan record puts INSIDE this work item
     * rather than in the shell: `learn-content-page` settles the content body, the contents panel,
     * the on-this-page outline, the pager and the paywall boundary.
     *
     * Revision 1.2 shipped the middle column alone and called the rails somebody else's job. They
     * are not: a reading measure is only a decision once you can see what stands beside it, and a
     * content read without the map it sits in is a different product - the reader loses both where
     * they are in the course and where they are in the page.
     *
     * The spine - the eleven learn modes - stays out, because that one IS the shell layout's item
     * and hangs every other mode off it.
     */
    "content-reader-frame": {
        classes: [
            "mx-auto", "flex", "w-full", "min-w-0", "max-w-app-xl", "flex-col", "items-start", "gap-6", "px-6", "py-6",
            "md:flex-row", "md:items-start", "md:gap-8",
            "md:[&>*:first-child]:w-72", "md:[&>*:first-child]:shrink-0",
            "md:[&>*:first-child]:sticky", "md:[&>*:first-child]:top-rail",
            "md:[&>*:first-child]:self-start", "md:[&>*:first-child]:max-h-rail",
            "md:[&>*:first-child]:overflow-y-auto",
            "md:[&>*:nth-child(2)]:min-w-0", "md:[&>*:nth-child(2)]:grow",
            "md:[&>*:last-child]:w-72", "md:[&>*:last-child]:shrink-0",
            "md:[&>*:last-child]:sticky", "md:[&>*:last-child]:top-rail",
            "md:[&>*:last-child]:self-start", "md:[&>*:last-child]:max-h-rail",
            "md:[&>*:last-child]:overflow-y-auto",
        ],
        children: {
            contents: { layout: "content-map-panel" },
            main: { layout: "learn-content-page" },
            outline: { layout: "content-outline-rail", optional: true },
        },
        why: "if you need a two-rail reading frame — a course-position rail and a page-position rail flanking a flexible middle body, each sticky and independently scrollable — with the outline rail dropped entirely whenever the body carries no headings.",
    },
    "content-map-panel": {
        host: "nav",
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-4"],
        children: {
            progress: { composite: "labelled-progress-row" },
            search: { leaf: "search-box" },
            module: { layout: "content-map-module", repeats: true, restingCount: 4 },
        },
        why: "if you need a course navigation panel that orders progress, search, and module structure in that fixed sequence, with search sitting above the module Grammar because it filters the whole Grammar.",
    },
    "content-map-module-summary": {
        classes: ["flex", "w-full", "min-w-0", "flex-row", "items-center", "gap-3", "px-3", "py-2", "[&>*:first-child]:min-w-0", "[&>*:first-child]:grow", "[&>*:nth-child(2)]:shrink-0", "[&>*:last-child]:shrink-0"],
        children: {
            title: { leaf: "text", props: { size: "sm" } },
            fact: { leaf: "text", props: { size: "xs", tone: "muted" } },
            caret: { leaf: "icon", props: { role: "chip" } },
        },
        why: "if you need one summary line for a collapsible module that states its name, its progress fact, and whether it is open, in that reading order, with the caret isolated at the far end.",
    },
    "content-map-module": {
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-1"],
        children: {
            title: { layout: "content-map-module-summary" },
            row: { leaf: "content-map-row", repeats: true, restingCount: 0 },
        },
        why: "if you need a module block that keeps its own summary row and its content rows as one identity, rendering zero rows rather than an empty placeholder run while unopened.",
    },
    "content-outline-rail": {
        host: "nav",
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-2"],
        children: {
            label: { leaf: "text", props: { size: "sm", tone: "muted" } },
            heading: { leaf: "nav-link", props: { kind: "section" }, repeats: true, restingCount: 5 },
        },
        why: "if you need a labeled, in-page navigation list of real section links that move the reader inside the current content, not lines of descriptive text.",
    },

    "learn-content-page": {
        // The reader IS this screen, so it opens the document's one main landmark itself rather
        // than being posted inside somebody else's - which is what let a review harness draw a
        // second one, and what a rule caught before any of it was seen.
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            faces: { layout: "dual-tabs-toolbar", optional: true },
            body: { layout: ["content-reading-column", "centred-empty-notice"] },
        },
        why: "Use this when you need content read straight down one measure through trail, title, available faces, open face, and ways on, with the body slot admitting either the article or an empty notice when locked.",
    },
    /*
    /*
     * PROPOSED - content-next-list and content-next-row. Target path on materialization: the locked table.
     *
     * Legacy draws an up-next card and a related-content list beneath the content. Both answer one
     * question - where does the reader go from here - so they are one joined list of destinations
     * rather than two surfaces. The row carries no completion mark: a tick would promise something
     * to finish, and these are places to open.
     */
    "content-next-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            step: { layout: "content-next-row", repeats: true, restingCount: 2 },
        },
        why: "if you need a short, ordered run of where-to-go-next destinations on one shared surface with full-width rules between them, matching the dashboard's joined-list pattern.",
    },
    "content-next-row": {
        classes: ["flex", "w-full", "flex-row", "items-center", "gap-3", "[&>*:first-child]:min-w-0", "[&>*:first-child]:grow"],
        children: {
            label: { leaf: "text", props: { size: "md" } },
            disclosure: { leaf: "icon", optional: true },
        },
        why: "if you need a single next-destination row — a label that owns the width plus a trailing open-indicator glyph — with no completion mark, since a tick would wrongly promise something to finish rather than a place to open.",
    },
    "courses-catalog-page": {
        // The same measure and inset the dashboard and the leaderboard use. A catalog reached from
        // the navbar and returned to must not appear to shift the chrome, so the page width belongs
        // to the product rather than to this page. An earlier revision carried no measure at all:
        // the preview harness supplied padding the entry did not, so it looked correct until it
        // finally had a route and rendered flush against the viewport edge.
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            toolbar: { layout: "catalog-search-count-view-row" },
            owned: { layout: "course-progress-list", optional: true },
            discover: { layout: "catalog-section-group", optional: true },
            notice: { composite: "empty-notice", optional: true },
            pager: { leaf: "pagination", optional: true },
        },
        why: "Use this when you need one toolbar to narrow both catalog groups as their peer rather than belonging to either, while every route region keeps the same seam instead of choosing its own spacing.",
    },
    "course-qa-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            composer: { layout: "catalog-search-count-view-row" },
            thread: { layout: "catalog-section-group", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need course Q&A search and its inline question composer together before the selected question-or-reply thread, with settled empty and failed states replacing that thread without turning the route into a catalog.",
    },
    "course-headhuntings-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            search: { layout: "catalog-search-count-view-row" },
            directories: { layout: "catalog-section-group", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a headhunting directory read from course identity through one company query into the company and consultant runs it narrows, with empty and failed outcomes replacing those directories in place.",
    },
    "course-headhunting-company-page": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            actions: { layout: "catalog-search-count-view-row" },
            profile: { layout: "catalog-section-group", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need one company profile with back and contact actions ahead of its description and consultant contacts, while not-found and failed outcomes replace the profile without losing the company route identity.",
    },
    "catalog-search-count-view-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-4"],
        children: {
            search: { layout: "catalog-query-with-count" },
            view: { leaf: "choice-tabs" },
        },
        why: "Use this when you need a toolbar row that puts the search-and-result-count on one end and the grid/list view toggle on the other, so narrowing the results and choosing how they're drawn stay visually separate.",
    },
    "catalog-query-with-count": {
        classes: ["flex", "flex-row", "items-center", "gap-3", "[&>*:last-child]:shrink-0"],
        children: {
            query: { leaf: "search-box" },
            count: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
        },
        why: "Use this when you need a search field paired with its own result count, kept beside the field that produced it rather than parked elsewhere where it would misread as a caption on another control. The pair must sit in a non-wrapping container - the field fills its own line, so a wrapping parent drops the count onto a second line, which this entry exists to prevent.",
    },
    "catalog-section-group": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            title: { leaf: "heading" },
            // The slot admits EITHER arrangement because the group's own statement does not
            // change with it: this is still a titled set of purchasable courses whether the
            // reader is comparing them side by side or scanning them down a column.
            grid: { layout: ["catalog-card-grid", "catalog-card-list"] },
        },
        why: "Use this when you need a titled group of purchasable-course cards - rendered as grid or list without changing the group's own meaning - kept separate from an owned-courses group so the reader isn't forced to tell purchase intent apart card by card.",
    },
    "catalog-card-grid": {
        classes: ["grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-4"],
        children: {
            course: { layout: "catalog-card", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need a responsive side-by-side grid for comparing interchangeable purchasable courses; it accepts only that one card kind, since an already-owned course belongs in the dashboard's joined list, not a grid card.",
    },
    "catalog-card-list": {
        classes: ["overflow-hidden", "divide-y", "divide-separator", "p-0", "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4"],
        children: {
            course: { layout: "catalog-card-line", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need to scan many courses at once rather than compare a few side by side: the rows share one surface with a full-width rule between each, avoiding the per-card edge cost of twenty separate cards, and the row itself owns the inset so every divider spans full width.",
    },
    "catalog-card-line": {
        classes: [
            "flex", "flex-row", "items-center", "gap-4",
            "[&>*:first-child]:w-36", "[&>*:first-child]:shrink-0",
            "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow",
            "[&>*:last-child]:shrink-0",
        ],
        children: {
            cover: { leaf: "cover-image" },
            body: { layout: "catalog-card-line-body" },
            action: { layout: "catalog-card-action-row" },
        },
        why: "Use this when you need one course offer read across a row (cover, name/price, action) instead of down a card; it deliberately omits the promises list, since in a one-course-per-row layout that list would set every row's height to the longest course's claims.",
    },
    "catalog-card-line-body": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-1"],
        children: {
            heading: { layout: "title-with-baseline-fact" },
            price: { layout: "catalog-price-group" },
        },
        why: "Use this when you need the name-and-price pair inside a course row, held at the tightest seam since nothing sits between them - unlike the full card's three-part rhythm, this row has no third element to space against.",
    },
    "catalog-card": {
        classes: ["flex", "grow", "flex-col", "gap-4", "p-4"],
        children: {
            cover: { leaf: "cover-image" },
            body: { layout: "catalog-card-body" },
            action: { layout: "catalog-card-action-row" },
        },
        why: "Use this when you need a standalone purchasable-course card that fills its grid cell so its action buttons align on one line across the row; without growing to fill the surface its branch provides, mismatched card heights would read as three different kinds of offer instead of one consistent grid.",
    },
    "course-price-detail-stack": {
        classes: ["flex", "flex-col", "gap-4", "p-6"],
        children: {
            title: { leaf: "heading" },
            reckoning: { layout: "stacked-stat-rows", optional: true },
            notice: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            reason: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            forward: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
        },
        why: "Reach for this when you need a vertical price breakdown that argues downward through what it is, what it is made of, why it is lower, and what changes if the reader waits. It also needs to carry its own padding, since the shell it sits inside passes the interior through unstyled.",
    },
    "price-note-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            fact: { leaf: "text", props: { size: "xs", tone: "muted" }, optional: true },
            action: { leaf: "text-link", props: { size: "xs" } },
        },
        why: "Reach for this when you need one line pairing what a price saved with a link to how it was reached, sized at the small caption step as supporting copy beneath the price - a step larger and the note would outrank the price it is explaining.",
    },
    "catalog-card-action-row": {
        classes: ["flex", "flex-row", "items-center", "gap-2", "[&>*]:w-full"],
        children: {
            cart: { leaf: "button" },
            open: { leaf: "button" },
        },
        why: "Reach for this when you need two peer actions (e.g. buy now vs. learn more) on one line at the foot of an offer card, each taking equal width rather than their own word-width, so neither reads as an afterthought and cards stay aligned across a grid.",
    },
    "catalog-card-body": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-4"],
        children: {
            heading: { layout: "catalog-card-heading-row" },
            price: { layout: "catalog-price-group" },
            promises: { layout: "marked-row-list" },
        },
        why: "Reach for this when you need the body of a purchasable course card to stack heading, price and promised value in that fixed reading order at the card's own rhythm. Price stays one combined part here - the tighter internal seam between price and its note belongs one level down, not at this level.",
    },
    "catalog-price-group": {
        classes: ["flex", "flex-col", "gap-1"],
        children: {
            price: { layout: "price-discount-line" },
            note: { layout: "price-note-row", optional: true },
        },
        why: "Reach for this when you need a price and its savings note grouped a step closer to each other than to the heading above or the promises below, so they read as one fact restated rather than two separate answers.",
    },
    "catalog-card-heading-row": {
        classes: ["flex", "flex-row", "items-baseline", "justify-between", "gap-2", "[&>*:first-child]:min-w-0", "[&>*:first-child]:grow",
        ],
        children: {
            title: { leaf: "heading" },
            count: { leaf: "text", props: { size: "xs" } },
        },
        why: "Reach for this when you need a title and a trailing qualifying count on one baseline, where the title owns the flexible width and yields it back first as the card narrows, so the count is never clipped by the card's own rounded overflow.",
    },
    "course-detail-page": {
        classes: ["flex", "min-w-0", "flex-col", "gap-4"],
        children: {
            navigation: { layout: "course-section-navigation" },
            body: { layout: "main-then-rail" },
            action: { layout: "course-mobile-action-bar", optional: true },
        },
        why: "Use this when you need a course-detail page to begin at the navbar seam with peer section navigation as its second layer, leaving body measure to the body and both viewport edges reachable by the pinned phone action.",
    },
    "course-section-navigation": {
        host: "nav",
        classes: ["flex", "w-full", "border-b", "border-separator", "px-6"],
        children: { tabs: { leaf: "choice-tabs" } },
        why: "Reach for this when you need a full-width nav landmark for switching between sections of one course document, sitting directly under the primary navbar - distinct from an in-page breadcrumb, which preserves route ancestry rather than switching sections.",
    },
    "main-then-rail": {
        classes: ["mx-auto", "w-full", "max-w-6xl", "px-6", "pb-6", "flex", "flex-col", "gap-6", "md:gap-8", "md:flex-row", "md:items-start", "md:[&>*:first-child]:min-w-0", "md:[&>*:first-child]:grow",
            "md:[&>*:last-child]:w-72", "md:[&>*:last-child]:shrink-0",
            "md:[&>*:last-child]:sticky", "md:[&>*:last-child]:top-rail",
            "md:[&>*:last-child]:self-start", "md:[&>*:last-child]:max-h-rail",
            "md:[&>*:last-child]:overflow-y-auto",
        ],
        children: {
            main: { layout: "course-hero" },
            rail: { layout: "course-pricing-rail" },
        },
        why: "Reach for this when you need a two-column course layout where the narrative takes the flexible measure and a purchase rail stays a fixed column that follows the reader down a long page - the same mechanic as rail-then-main, just on the opposite child. It is also the layer that closes the page's own bottom space, which the frame cannot do without lifting a pinned mobile action bar off the edge it is pinned to.",
    },
    "course-hero": {
        host: "section",
        classes: ["flex", "min-w-0", "flex-col", "gap-6"],
        children: {
            trail: { leaf: "breadcrumbs" },
            heading: { layout: "course-hero-heading" },
            evidence: { layout: "course-signal-board" },
            section: { layout: "course-section", repeats: true, restingCount: 2 },
        },
        why: "Reach for this when you need the top of a course page to open with route ancestry, then course identity, then a scannable bounded proof board, then the detailed sections that back it up - in that fixed reading order. Section tabs elsewhere do not substitute for this ancestry trail.",
    },
    "course-hero-heading": {
        classes: ["flex", "flex-col", "gap-4", "sm:flex-row", "sm:items-start", "sm:justify-between"],
        children: {
            identity: { layout: "course-hero-title-stack" },
            rating: { layout: "course-hero-rating", optional: true },
        },
        why: "Reach for this when you need course identity paired with a compact population rating that appears only once the course has actual reviews, on a row that owns the flexible reading measure and introduces no second commerce action.",
    },
    "course-hero-title-stack": {
        classes: ["flex", "min-w-0", "grow", "flex-col", "gap-2"],
        children: {
            title: { leaf: "heading" },
            tagline: { leaf: "text", props: { size: "sm" } },
        },
        why: "Reach for this when you need a course name and its qualifying tagline as one identity block holding the flexible measure, so a long tagline wraps before it squeezes whatever sits beside it.",
    },
    "course-hero-rating": {
        classes: ["flex", "shrink-0", "flex-col", "items-center", "gap-1", "rounded-2xl", "bg-accent-soft", "p-4", "text-center"],
        children: {
            score: { leaf: "heading" },
            count: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Reach for this when you need a compact score-and-count proof badge for a course, shown only once the course has been rated so a zero score is never mistaken for a verdict.",
    },
    "course-signal-board": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2", "lg:grid-cols-3"],
        children: {
            signal: { layout: ["course-signal-card-accent", "course-signal-card-success", "course-signal-card-warning", "course-signal-card-neutral"], repeats: true, restingCount: 5 },
        },
        why: "Reach for this when you need a responsive grid of course facts where the primary conversion signals carry a status-tinted surface and supporting inventory facts stay on neutral ground, so the eye finds the decision evidence before it scans every card.",
    },
    "course-signal-card-accent": {
        classes: ["flex", "min-w-0", "flex-col", "gap-2", "rounded-2xl", "bg-accent-soft", "p-4"],
        children: { label: { leaf: "text", props: { size: "xs", tone: "muted" } }, value: { leaf: "text", props: { size: "md", weight: "semibold" } } },
        why: "Reach for this when you need a single course-fact card tinted as the lead adoption signal on brand-soft ground, keeping the same label-over-value rank as its sibling signal cards.",
    },
    "course-signal-card-success": {
        classes: ["flex", "min-w-0", "flex-col", "gap-2", "rounded-2xl", "bg-success-soft", "p-4"],
        children: { label: { leaf: "text", props: { size: "xs", tone: "muted" } }, value: { leaf: "text", props: { size: "md", weight: "semibold" } } },
        why: "Reach for this when you need a single course-fact card tinted as affirmative evidence (e.g. curriculum depth) on success-soft ground, while keeping the same label-over-value shape as its sibling signal cards.",
    },
    "course-signal-card-warning": {
        classes: ["flex", "min-w-0", "flex-col", "gap-2", "rounded-2xl", "bg-warning-soft", "p-4"],
        children: { label: { leaf: "text", props: { size: "xs", tone: "muted" } }, value: { leaf: "text", props: { size: "md", weight: "semibold" } } },
        why: "Reach for this when you need a single course-fact card tinted to draw attention before purchase (e.g. time commitment) on warning-soft ground, without it reading as an error state.",
    },
    "course-signal-card-neutral": {
        classes: ["flex", "min-w-0", "flex-col", "gap-2", "rounded-2xl", "p-4"],
        children: { label: { leaf: "text", props: { size: "xs", tone: "muted" } }, value: { leaf: "text", props: { size: "md", weight: "semibold" } } },
        why: "Reach for this when you need a course-fact card for supporting inventory evidence that stays a real bounded card but carries no chromatic priority, yielding tint emphasis to the accent, success and warning signal cards.",
    },
    "course-section": {
        host: "section",
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            title: { leaf: "heading" },
            body: { layout: ["course-promise-list", "course-module-list", "course-prerequisite-list", "course-review-block", "course-faq-list"] },
        },
        why: "Use when you need a named page region wrapping a heading together with the body content that heading introduces, so the region's name travels with its content for anything navigating by region.",
    },
    "course-promise-list": {
        host: "ul",
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "p-0", "[&>*]:px-4", "[&>*]:py-3"],
        children: {
            promise: { layout: "course-promise-row", repeats: true, restingCount: 4 },
        },
        why: "Use when you need a joined, unordered list of a course's promises where full-width separators keep the scan continuous and no single promise gets its own card. Mechanically identical to profile-evidence-list but named for the course domain — reach for that one instead outside course promises.",
    },
    "course-promise-row": {
        host: "li",
        classes: ["flex", "flex-row", "items-start", "gap-3", "[&>*:last-child]:min-w-0", "[&>*:last-child]:grow"],
        children: {
            mark: { leaf: "text", props: { size: "sm" } },
            promise: { leaf: "text", props: { size: "sm" } },
        },
        why: "Use when you need one promise-list row where a leading affirmative mark introduces its sentence and the sentence owns the remaining width, so a long promise wraps under itself rather than under the mark.",
    },
    "course-faq-list": {
        host: "ul",
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "p-0", "[&>*]:px-4", "[&>*]:py-3"],
        children: {
            faq: { layout: "course-faq-row", repeats: true, restingCount: 3 },
        },
        why: "Use when you need a joined, unordered list of question/answer entries that a reader can enter at any point (not a sequence of steps), with full-width dividers keeping the scan continuous and each answer bounded.",
    },
    "course-faq-row": {
        host: "li",
        classes: ["flex", "min-w-0", "flex-col", "gap-1"],
        children: {
            question: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            answer: { leaf: "text", props: { size: "sm", tone: "muted" } },
        },
        why: "Use when you need one question paired directly with its answer beneath it in a single row, so long copy wraps within the same readable measure and the pairing stays visually inseparable.",
    },
    "course-prerequisite-list": {
        host: "ol",
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "p-0", "[&>*]:px-4", "[&>*]:py-3"],
        children: {
            prerequisite: { layout: "course-prerequisite-row", repeats: true, restingCount: 3 },
        },
        why: "Use when you need an ordered list of prerequisites whose sequence matters — the backend stores them in order and a learner who lacks the first cannot judge the second — so the list must convey ordering to a reader who can't see numbering. Do not substitute course-promise-list here: its unordered ul would drop the ordering the data carries.",
    },
    "course-prerequisite-row": {
        host: "li",
        classes: ["flex", "flex-row", "items-start", "gap-3", "[&>*:last-child]:min-w-0", "[&>*:last-child]:grow"],
        children: {
            mark: { leaf: "text", props: { size: "sm", tone: "muted" } },
            requirement: { leaf: "text", props: { size: "sm" } },
        },
        why: "Use when you need one item of an ordered prerequisite list whose leading mark must stay neutral/muted rather than a checkmark, because the platform has not verified the reader has met the condition.",
    },
    "course-review-block": {
        host: "section",
        classes: ["flex", "flex-col", "gap-4"],
        children: {
            summary: { layout: "course-review-summary" },
            list: { layout: "course-review-list" },
        },
        why: "Use when you need a review section split into a top-level rating summary and a separate review list, kept as two distinct composed groups so a reader who only wants the aggregate score is not forced to scan through individual reviews.",
    },
    "course-review-summary": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "gap-3"],
        children: {
            score: { leaf: "heading" },
            scale: { layout: "rating-star-run" },
            count: { leaf: "text", props: { size: "sm", tone: "muted" } },
        },
        why: "Use when you need one row stating the mean score, the scale it's measured against, and the review count together, aligned on a shared text baseline so the figure doesn't float against its own qualifier.",
    },
    "rating-star-run": {
        classes: ["flex", "flex-row", "items-center", "gap-1"],
        children: {
            star: { leaf: "icon", repeats: true, restingCount: 5 },
        },
        why: "Use when you need a compact run of star marks that shows the maximum of the rating scale itself (not the actual score value) — pair it with a separate number for where a given course sits on that scale, since this product has no filled-star glyph to encode the value directly.",
    },
    "course-review-list": {
        host: "ul",
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "p-0", "[&>*]:px-4", "[&>*]:py-3"],
        children: {
            review: { layout: "course-review-row", repeats: true, restingCount: 3 },
        },
        why: "Use when you need a joined, unordered list of reviews where no review depends on the one before it, with full-width separators keeping the scan continuous and no single opinion boxed into its own card.",
    },
    "course-review-row": {
        host: "li",
        classes: ["flex", "min-w-0", "flex-col", "gap-1"],
        children: {
            author: { layout: "course-review-author-line" },
            body: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
        },
        why: "Use when you need one review-list item pairing an author line with optional review text, where a score alone is a complete, valid review and prose is not required.",
    },
    "course-review-author-line": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "gap-2"],
        children: {
            name: { leaf: "text", props: { size: "sm", weight: "medium" } },
            score: { leaf: "text", props: { size: "xs" } },
        },
        why: "Use when you need a compact one-row reading of a reviewer's name next to the score that specific person gave — this score is a fact about that reviewer's opinion, not the course's aggregate rating.",
    },
    "course-module-list": {
        host: "ol",
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "p-0", "[&>*]:px-4", "[&>*]:py-3"],
        children: {
            module: { layout: "course-module-row", repeats: true, restingCount: 5 },
        },
        why: "Use when you need an ordered list of a course's modules whose sequence matters (module three cannot be read before module two), where each row independently owns whether its lessons are disclosed and the list itself stays agnostic to that state.",
    },
    "course-module-row": {
        host: "li",
        classes: ["flex", "min-w-0", "flex-col"],
        children: {
            module: { leaf: "curriculum-module-row" },
        },
        why: "Use when you need one ordered-list item that hosts a disclosure (details) element as its content, since a details element cannot be a direct ol child without breaking sequence numbering; this also keeps the list's padding on the item so a disclosed module's lessons stay inset with its title instead of escaping it.",
    },
    "curriculum-module-lesson-list": {
        classes: ["flex", "flex-col", "gap-2", "pl-4", "mt-3"],
        children: {
            lesson: { leaf: "curriculum-lesson-row", repeats: true, restingCount: 0 },
        },
        why: "Use when you need the indented lesson list that appears only once its parent module is disclosed — it carries no loading skeleton and is simply absent while collapsed, and the shared indent is what visually reads the lessons as this module's children rather than unrelated siblings.",
    },
    "course-pricing-rail": {
        host: "aside",
        classes: ["flex", "flex-col", "gap-4"],
        children: {
            phase: { leaf: "badge", optional: true },
            cover: { leaf: "cover-image" },
            price: { layout: "course-price-block" },
            ladder: { layout: "course-pricing-phase-grid", optional: true },
            action: { leaf: "button" },
            proof: { leaf: "text", props: { size: "xs" }, optional: true },
        },
        why: "Use when you need the complementary buy-box rail alongside the course narrative — active phase badge, cover artwork, price, an optional compact phase-comparison ladder, the purchase action, and enrolment proof stacked as one sticky top-to-bottom decision.",
    },
    "course-price-block": {
        classes: ["flex", "flex-col", "gap-1"],
        children: {
            line: { layout: "price-discount-line" },
            savings: { leaf: "text", props: { size: "xs" }, optional: true },
            scarcity: { leaf: "badge", optional: true },
        },
        why: "Use when you need the payable price grouped tightly with its savings line and a scarcity badge as one combined cost claim, kept visually closer to each other than to the pricing ladder that follows.",
    },
    "course-pricing-phase-grid": {
        classes: ["grid", "grid-cols-1", "gap-2", "sm:grid-cols-2"],
        children: { phase: { layout: "course-pricing-phase-card", repeats: true, restingCount: 3 } },
        why: "Use this when you need to lay out several pricing-phase offers as peers to compare side by side, not as a sequence meant to be read in order.",
    },
    "course-pricing-phase-card": {
        classes: ["flex", "min-w-0", "flex-col", "gap-1", "rounded-xl", "border", "border-separator", "p-2"],
        children: {
            name: { leaf: ["text", "badge"] },
            value: { leaf: "text", props: { size: "xs", tone: "muted" } },
        },
        why: "Use this when you need a single compact pricing-phase offer with its name leading, a resolved price or open-status line beneath it, and a badge marking the active phase without switching layouts.",
    },
    "cart-line-list": {
        classes: [
            "overflow-hidden", "divide-y", "divide-separator", "p-0",
            "[&>*]:px-4", "[&>*]:py-3", "[&>*:first-child]:pt-4", "[&>*:last-child]:pb-4",
        ],
        children: {
            line: { layout: "cart-line-row", repeats: true, restingCount: 3 },
        },
        why: "if you need courses already committed to a basket listed as one joined list rather than as separate offer cards, with just enough division between rows that a single line can still be located and removed.",
    },
    "cart-line-row": {
        classes: [
            "flex", "flex-row", "items-center", "gap-3", "w-full",
            // The artwork track is FIXED and it is the same track the catalog row uses, so one
            // course is the same width wherever it is listed. Without it the cover has no measure
            // at all and takes the whole row: the image is `w-full` inside its own leaf, so a
            // parent that states no track hands it everything and the name, the price and the
            // removal are pushed off the line. Nothing in the DOM says so - the row still reports
            // three children in a row - which is why this was caught by looking at it.
            //
            // And it is HIDDEN below the breakpoint rather than shrunk, which the narrow render
            // then forced: 144px of artwork plus a name, a price and a removal does not fit a
            // phone, and the overflow pushed the removal off the screen entirely. The reference
            // hides it too.
            "[&>*:first-child]:hidden", "md:[&>*:first-child]:block",
            "[&>*:first-child]:w-36", "[&>*:first-child]:shrink-0",
            "[&>*:nth-child(2)]:min-w-0", "[&>*:nth-child(2)]:grow",
            // The price group must be allowed to SHRINK, or its own `flex-wrap` never engages: a
            // flex child defaults to `min-width: auto`, so the charged price, the struck original
            // and the discount badge held their full width, pushed the row past the viewport and
            // took the removal control off the screen with them. The narrow render is the only
            // thing that showed it.
            "[&>*:nth-child(3)]:min-w-0",
            "[&>*:last-child]:shrink-0",
        ],
        children: {
            cover: { leaf: "cover-image" },
            identity: { layout: "evidence-title-over-subtitle" },
            price: { layout: "price-discount-line" },
            remove: { leaf: "icon-button" },
        },
        why: "if you need one committed-basket line showing its cover, identity, and price alongside a single removal control, with that control placed as a glyph at the trailing edge — farthest from the artwork — so undoing a purchase is the hardest action on the row to trigger by accident.",
    },
    "order-summary-stack": {
        classes: [
            "flex", "flex-col", "gap-2",
            "[&>*:last-child]:border-t", "[&>*:last-child]:border-separator",
            "[&>*:last-child]:pt-3", "[&>*:last-child]:mt-1",
        ],
        children: {
            subtotal: { layout: "label-with-muted-fact-row" },
            savings: { layout: "label-with-muted-fact-row", optional: true },
            surcharge: { layout: "label-with-muted-fact-row", optional: true },
            total: { layout: "order-total-row" },
        },
        why: "Use this when you need a stack of cost lines that resolves to a total rather than reads as a set of even, peer figures, and where the savings and instalment-surcharge lines must appear only when there is an actual saving or surcharge to report.",
    },
    "order-total-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "justify-between", "gap-2"],
        children: {
            label: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            amount: { leaf: "text", props: { size: "md", weight: "semibold" } },
        },
        why: "Use this when you need the final payable amount in the same column as muted subtotal rows while reading at a visibly higher rank than those rows.",
    },
    "cart-page-column": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            lines: { layout: "cart-line-list", optional: true },
            summary: { layout: "order-summary-stack", optional: true },
            hint: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            actions: { layout: "stacked-peer-controls", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need the full cart body to match catalog and leaderboard measure and inset, while every region below its header disappears together for an empty basket instead of rendering in an emptied state.",
    },
    "cart-drawer-column": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: {
            lines: { layout: "cart-line-list", optional: true },
            summary: { layout: "order-summary-stack", optional: true },
            actions: { layout: "stacked-peer-controls", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "if you need basket contents shown inside a slide-out drawer rather than the full cart page, at a narrower measure with its own inset, and only when the drawer's own title bar already names what is open so no second heading is needed inside.",
    },
    "course-mobile-action-bar": {
        classes: ["sticky", "bottom-0", "z-40", "flex", "flex-row", "items-center", "justify-between", "gap-3", "border-t", "border-separator", "bg-background", "px-4", "py-3", "md:hidden"],
        children: {
            price: { layout: "price-discount-line" },
            action: { leaf: "button" },
        },
        why: "Use this when you need the purchase price and its action pinned to the bottom edge below the pricing rail's breakpoint because they would otherwise scroll out of view, until the rail can hold them again.",
    },
    "coding-practice-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            resume: { layout: "resume-item-card", optional: true },
            domains: { layout: "domain-mastery-grid" },
            standing: { layout: "leaderboard-card", optional: true },
        },
        why: "Use this when you need coding practice ordered as the resumable next move, then the domain choice, then ranking, keeping the already-started work first and optional while evidence unrelated to the next action remains last.",
    },
    "domain-mastery-grid": {
        classes: ["grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-4"],
        children: {
            domain: { layout: "domain-mastery-card", repeats: true, restingCount: 6 },
        },
        why: "Use this when you need to lay out many domain-mastery cards for scanning toward the weakest one, as a field the eye can cross in two directions rather than a single column read top to bottom.",
    },
    "domain-mastery-card": {
        classes: ["flex", "grow", "flex-col", "items-start", "gap-2", "p-4"],
        children: {
            name: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            count: { leaf: "text", props: { size: "xs", tone: "muted" } },
            meter: { leaf: "progress" },
        },
        why: "Use this when you need one domain's mastery as both a scannable meter for comparison across topics and a precise count to read after stopping on one.",
    },
    "coding-domain-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-6", "py-6"],
        children: {
            header: { layout: "page-header-stack" },
            standing: { layout: "label-fact-over-progress", optional: true },
            problems: { layout: "marked-row-list", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a topic page to open with the reader's progress before its problems, answering the question carried from the hub before presenting what remains.",
    },
    "coding-problem-page": {
        classes: ["flex", "w-full", "min-h-screen", "flex-col", "md:flex-row"],
        children: {
            reading: { layout: "problem-reading-column" },
            work: { layout: "problem-work-column" },
        },
        why: "Use this when you need a problem statement consulted beside its solution editor on desktop and stacked before that editor below the breakpoint so each side retains a readable measure.",
    },
    "problem-reading-column": {
        // `md:shrink-0` is not decoration. Without it the work column's `grow` squeezes this one
        // well past the measure `md:w-2/5` asked for - measured at 273px inside a 934px viewport
        // where two fifths is 373 - and a problem statement at that width wraps every few words.
        // A proportional width is a REQUEST until shrinking is refused.
        classes: ["flex", "w-full", "min-w-0", "flex-col", "gap-4", "border-b", "border-separator", "p-6", "md:w-2/5", "md:shrink-0", "md:border-b-0", "md:border-r"],
        children: {
            tabs: { leaf: "extended-tabs" },
            body: { layout: "problem-statement-stack" },
        },
        why: "if you need the reading side of a coding-problem layout where tabs above the content stay fixed in place while the content beneath them switches, so a reader who moves between tabs and back does not lose their place.",
    },
    "problem-statement-stack": {
        classes: ["flex", "min-w-0", "flex-col", "gap-3"],
        children: {
            heading: { layout: "title-with-baseline-fact" },
            // `article` REUSED, and a proposed `markdown-prose` leaf withdrawn. The repository
            // already renders authored Markdown - `leaves/Article` parses to mdast and decides what
            // each node becomes - and its own comment records that canon refused `react-markdown`
            // here twice: every replacement takes `children`, and heading replacements wrote raw
            // tags that split the outline from the visible size. A second markdown owner would have
            // walked into both refusals again, and pulled in a dependency to do it.
            prose: { leaf: "article" },
            tags: { layout: "profile-topic-chip-run", optional: true },
        },
        why: "if you need a title carrying its difficulty on the title's own baseline, followed by the authored problem body, with optional topic tags closing the statement for a reader scanning whether to skip it.",
    },
    "problem-work-column": {
        classes: ["flex", "w-full", "min-w-0", "grow", "flex-col"],
        children: {
            // TWO BLOCKS, NOT ONE. The verdict strip and the editor are separate owners with
            // separate situations - one is driven by a socket, the other by a keyboard - so the
            // PAGE composes them here rather than the editor drawing a strip it cannot fill.
            verdict: { layout: "judge-status-strip" },
            work: { layout: "editor-over-console" },
        },
        why: "if you need a socket-driven verdict strip pinned above a keyboard-driven editor-and-console block, so the verdict stays watched during a wait while the editor takes whatever height remains and grows on taller screens.",
    },
    "judge-status-strip": {
        classes: ["flex", "flex-row", "items-center", "gap-3", "w-full", "border-b", "border-separator", "px-4", "py-3", "[&>*:nth-child(3)]:min-w-0", "[&>*:nth-child(3)]:grow"],
        children: {
            mark: { leaf: "status-dot" },
            verdict: { leaf: "text", props: { size: "sm", weight: "semibold" } },
            detail: { leaf: "text", props: { size: "xs", tone: "muted" } },
            action: { leaf: "button", optional: true },
        },
        why: "Use this when you need one fixed strip (status mark, verdict text, a detail line, optional action) that is present before the first submission and never relocates, so it can host any of several judging outcomes or a lost connection without retraining where the reader looks.",
    },
    "editor-over-console": {
        classes: ["flex", "min-w-0", "grow", "flex-col"],
        children: {
            toolbar: { layout: "editor-toolbar-row" },
            editor: { leaf: "code-editor" },
            console: { layout: "judge-console", optional: true },
        },
        why: "Use this when you need a code editor that owns the surrounding toolbar and takes whatever height remains, with a console tray that appears only once a run has produced output rather than sitting open and empty before the first submission.",
    },
    "editor-toolbar-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3", "w-full", "border-b", "border-separator", "px-4", "py-3"],
        children: {
            language: { leaf: "select" },
            // REUSED, not invented. `catalog-card-action-row` already owns "two peer actions share
            // one line and an equal measure", which is exactly running and submitting an attempt.
            // `stacked-peer-controls` was the first reach and was wrong: it is `flex-col`, so it
            // would have stacked Run above Submit at full width inside a toolbar.
            //
            // Its NAME still says `catalog`, which is now false for one of its two callers. That is
            // recorded as an open question rather than fixed here: renaming a shipped entry touches
            // every call site and belongs to a consolidation run, not to this candidate.
            actions: { layout: "catalog-card-action-row" },
        },
        why: "Use this when you need a single toolbar row that keeps a language selector separate from the run/submit action pair, anchoring each to an opposite end instead of queueing both on the same side.",
    },
    "judge-console": {
        classes: ["flex", "flex-col", "gap-2", "w-full", "border-t", "border-separator", "px-4", "py-3"],
        children: {
            cases: { layout: "testcase-chip-run" },
            message: { leaf: "code-block", optional: true },
        },
        why: "Use this when you need a console tray that always shows the per-testcase result badges as the summary and reveals raw compiler/runtime output only for the verdicts that actually produced any.",
    },
    "testcase-chip-run": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "gap-2"],
        children: {
            testcase: { leaf: "badge", repeats: true, restingCount: 5 },
        },
        why: "Use this when you need a wrapping row of equal-status testcase badges read together as one run rather than ranked, sized for however many cases the problem itself defines.",
    },
    "exam-catalog-page": {
        classes: ["mx-auto", "flex", "w-full", "min-w-0", "max-w-full", "max-w-6xl", "flex-col", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            header: { layout: "page-header-stack" },
            premium: { layout: "premium-value-band", optional: true },
            query: { layout: "catalog-query-with-count" },
            collections: { leaf: "choice-tabs" },
            section: { layout: "exam-program-section", optional: true },
            pagination: { leaf: "pagination", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need an exam library read from its promise through collection choice to a bounded paper set, keeping a future hundred-paper bank navigable rather than rendering one wall of cards.",
    },
    "premium-value-band": {
        classes: ["flex", "flex-col", "gap-3", "rounded-xl", "border", "border-accent", "bg-accent-soft", "p-5", "md:flex-row", "md:items-center", "md:justify-between"],
        children: {
            copy: { layout: "premium-copy-stack" },
            action: { leaf: "button", optional: true },
        },
        why: "Use this when you need a highlighted band pairing a premium value statement with an optional action that sits beneath it on narrow screens and beside it only once both keep a readable measure.",
    },
    "premium-copy-stack": {
        classes: ["flex", "min-w-0", "flex-col", "gap-2"],
        children: { title: { leaf: "heading" }, body: { leaf: "text" } },
        why: "Use this when you need a two-line value stack — a named promise followed by its supporting sentence — that an adjacent action can be judged to have earned.",
    },
    "exam-program-section": {
        classes: ["flex", "flex-col", "gap-4"],
        children: {
            heading: { layout: "title-with-baseline-fact" },
            papers: { layout: "exam-paper-grid" },
        },
        why: "Use this when you need a section that names one selected exam collection as a heading and lists its papers beneath it as comparable peers within that set.",
    },
    "exam-paper-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2", "lg:grid-cols-3"],
        children: { paper: { layout: "exam-paper-card", repeats: true, restingCount: 6 } },
        why: "Use this when you need a responsive grid holding a bounded page of paper cards (up to about a dozen) for side-by-side comparison, without rendering an entire future bank at once.",
    },
    "exam-paper-card": {
        classes: ["flex", "h-full", "flex-col", "gap-3", "p-4", "[&>*:last-child]:mt-auto"],
        children: {
            badge: { leaf: "badge", optional: true },
            title: { leaf: "heading" },
            description: { leaf: "text", optional: true },
            fact: { layout: "label-with-muted-fact-row", repeats: true, restingCount: 2 },
            action: { leaf: "button" },
        },
        why: "Use this when you need a paper card that states entitlement badge, title, description and a couple of key facts before a single action, with that action resting at a common bottom edge shared across peer cards of uneven content.",
    },
    "exam-session-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-5", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            header: { layout: "exam-session-header" },
            body: { layout: ["exam-passage-question", "exam-result-summary", "exam-state-notice"] },
            actions: { layout: "exam-session-actions", optional: true },
        },
        why: "Use this when you need one exam route to retain its orientation while the body changes from answering to a graded result, without exposing answers in the runner state.",
    },
    "exam-state-notice": {
        classes: ["flex", "min-h-72", "items-center", "justify-center"],
        children: { notice: { composite: "empty-notice" } },
        why: "Use this when you need one centered notice to explain and recover a blocked, failed, or empty exam session while the route keeps its orientation.",
    },
    "exam-session-header": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            title: { layout: "title-with-baseline-fact" },
            exit: { leaf: "confirm-button", optional: true },
        },
        why: "Use this when you need an in-session header that orients the learner with the paper name and question position while keeping a confirmation-gated exit control pinned to the far edge.",
    },
    "exam-passage-question": {
        classes: ["grid", "grid-cols-1", "gap-4", "md:grid-cols-2", "[&>*:only-child]:md:col-span-2"],
        children: {
            passage: { leaf: "article", optional: true },
            question: { layout: "exam-question-card" },
        },
        why: "Use this when you need a question paired with a reading passage side by side on desktop and in source order on a phone, while passage-free questions take the full measure without an empty column.",
    },
    "exam-question-card": {
        classes: ["flex", "flex-col", "gap-4", "rounded-xl", "border", "border-separator", "p-5"],
        children: {
            eyebrow: { leaf: "text" },
            stem: { leaf: "heading" },
            answer: { leaf: "single-choice" },
        },
        why: "Use this when you need one bounded question task — a position eyebrow, the question stem, and its single answer group — where the position marker supports the stem instead of competing with it for attention.",
    },
    "exam-session-actions": {
        classes: ["sticky", "bottom-20", "z-30", "flex", "flex-row", "items-center", "justify-between", "gap-3", "rounded-xl", "border", "border-separator", "bg-background", "p-3", "md:bottom-4"],
        children: {
            previous: { leaf: "button", optional: true },
            progress: { leaf: "text" },
            forward: { leaf: "button" },
        },
        why: "Use this when you need a sticky navigation bar during an exam attempt where a single forward action doubles as submit on the final question, with an optional back button and a progress indicator between them.",
    },
    "exam-result-summary": {
        classes: ["flex", "flex-col", "gap-6"],
        children: {
            score: { layout: "premium-value-band" },
            skills: { layout: "exam-skill-list", optional: true },
            answers: { layout: "exam-answer-review-list" },
            actions: { layout: "exam-session-actions" },
        },
        why: "Use this when you need to assemble an exam result view that orders overall score, current-attempt skill breakdown, and every graded answer, before the return actions.",
    },
    "exam-skill-list": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            title: { leaf: "heading" },
            skill: { composite: "labelled-progress-row", repeats: true, restingCount: 3 },
        },
        why: "Use this when you need a titled list of skill progress rows scoped to a single submitted paper's results, not a historical or cross-attempt weakness trend.",
    },
    "exam-answer-review-list": {
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "rounded-xl", "border", "border-separator"],
        children: { answer: { layout: "exam-answer-review", repeats: true, restingCount: 4 } },
        why: "Use this when you need to list every graded answer from one attempt as rows on a single divided surface rather than as separate cards, so scanning many mistakes stays cheap.",
    },
    "exam-answer-review": {
        classes: ["flex", "flex-col", "gap-2", "p-4"],
        children: {
            title: { layout: "title-with-baseline-fact" },
            stem: { leaf: "text" },
            selected: { layout: "label-with-muted-fact-row" },
            correct: { layout: "label-with-muted-fact-row" },
            explanation: { leaf: "article", optional: true },
        },
        why: "Use this when you need one graded-answer row that keeps the question stem, the learner's selected answer, the correct answer, and an optional explanation attached to each other.",
    },
    "pricing-page-stack": {
        host: "main",
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            status: { layout: "payment-return-status", optional: true },
            catalog: { layout: "pricing-offer-catalog" },
        },
        why: "Use this when you need a verified payment outcome to interrupt the buying decision before the catalog offers another purchase while the application shell remains route-stable.",
    },
    "pricing-offer-catalog": {
        classes: ["flex", "flex-col", "gap-6"],
        children: {
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            learning: { layout: "pricing-offer-card" },
            licenseTitle: { leaf: "heading" },
            licenses: { layout: "pricing-license-grid" },
        },
        why: "if you need a pricing catalog body that presents the recurring learning-access offer before the lifetime license grid, so a subscription is never confused with owning downloadable material.",
    },
    "pricing-license-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "md:grid-cols-2"],
        children: { offer: { layout: "pricing-offer-card", repeats: true, restingCount: 3 } },
        why: "if you need a comparison grid of lifetime license offers, shown only after the separate subscription offer has already been presented.",
    },
    "pricing-offer-card": {
        classes: ["flex", "h-full", "flex-col", "gap-4", "p-6"],
        children: {
            badge: { leaf: "badge" },
            title: { leaf: "heading" },
            price: { leaf: "text" },
            body: { leaf: "text" },
            benefit: { leaf: "text", repeats: true, restingCount: 3 },
            action: { leaf: "button" },
        },
        why: "if you need a single reusable offer card, subscription or license, that keeps its price, benefit list, and one purchase action together so cost and consequence are never compared apart.",
    },
    "payment-return-status": {
        classes: ["flex", "flex-col", "gap-4", "p-6", "border", "border-accent"],
        children: {
            badge: { leaf: "badge" },
            title: { leaf: "heading" },
            body: { leaf: "text" },
            action: { leaf: "button", optional: true },
        },
        why: "Use this when you need a bounded banner announcing a provider-confirmed payment outcome and its one valid next action, positioned above any new purchase offer.",
    },
    "purchase-checkout-panel": {
        classes: ["flex", "flex-col", "gap-4", "p-6"],
        children: {
            title: { leaf: "heading" },
            body: { leaf: "text" },
            price: { leaf: "text" },
            benefit: { leaf: "text", repeats: true, restingCount: 3 },
            notice: { composite: "empty-notice", optional: true },
            action: { leaf: "button", repeats: true, restingCount: 2 },
        },
        why: "Use this when you need a checkout panel that states a server-owned price and benefit list with up to two actions, without merging subscription and download-license purchase behavior.",
    },
    "white-label-inquiry-panel": {
        host: "form",
        classes: ["flex", "flex-col", "gap-4", "p-6"],
        children: {
            title: { leaf: "heading" },
            body: { leaf: "text" },
            name: { composite: "field" },
            email: { composite: "field" },
            messageLabel: { leaf: "label" },
            message: { leaf: "textarea" },
            messageHint: { leaf: "text", optional: true },
            notice: { composite: "empty-notice", optional: true },
            action: { leaf: "button", repeats: true, restingCount: 2 },
        },
        why: "Use this when you need an anonymous inquiry form, name, email, message, for an assisted sale, keeping labelled fields, a validation notice, and submission actions inside one form boundary.",
    },
    "coming-soon-panel": {
        classes: ["flex", "flex-col", "gap-4", "p-6"],
        children: {
            title: { leaf: "heading" },
            body: { leaf: "text" },
            action: { leaf: "button" },
        },
        why: "Use this when you need a placeholder panel for a not-yet-built destination that gives one explanation and one way back, instead of behaving like a broken link.",
    },
    "study-home-grid": {
        classes: ["mx-auto", "grid", "w-full", "max-w-6xl", "grid-cols-1", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            resume: { layout: "study-resume-hero" },
            progress: { layout: "study-progress-card" },
        },
        why: "Use this when you need the next learning move at full reading width before private progress, preserving the hero-first hierarchy while both requests settle independently.",
    },
    "study-resume-hero": {
        classes: ["flex", "h-full", "flex-col", "gap-4", "p-6"],
        children: {
            eyebrow: { leaf: "badge" },
            title: { leaf: "heading" },
            body: { leaf: "text" },
            action: { leaf: "button" },
            secondary: { leaf: "button", optional: true },
        },
        why: "Use this when you need a visually dominant hero offering one server-backed resume action, falling back to a discovery action when no resume target exists.",
    },
    "study-progress-card": {
        classes: ["flex", "h-full", "flex-col", "gap-4", "p-6"],
        children: {
            title: { leaf: "heading" },
            stat: { composite: "stat-row", repeats: true, restingCount: 3, optional: true },
            progress: { composite: "labelled-progress-row", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a private card showing a learner's verified stat totals and level-progress meter together, where a guest or failed state replaces only that evidence, not the whole card.",
    },
    "study-catalog-stack": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" } },
            query: { leaf: "search-box" },
            filter: { leaf: "choice-tabs" },
            topics: { layout: "study-topic-grid", optional: true },
            notice: { composite: "empty-notice", optional: true },
        },
        why: "Use this when you need a topic question and level choice to resolve before matching public topics appear, with settled absence retaining one recovery path.",
    },
    "study-topic-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2", "lg:grid-cols-3"],
        children: { topic: { layout: "study-topic-card", repeats: true, restingCount: 6 } },
        why: "Use this when you need a responsive grid of equal topic cards that only adds columns once each card can still keep a readable line measure.",
    },
    "study-topic-card": {
        classes: ["flex", "h-full", "flex-col", "gap-3", "p-5"],
        children: {
            level: { leaf: "badge" },
            title: { leaf: "heading" },
            body: { leaf: "text" },
            fact: { leaf: "text", props: { size: "sm", tone: "muted" } },
            action: { leaf: "button" },
        },
        why: "Use when you need a compact topic card that shows level, promise, and phrase-count evidence, ending in exactly one action that opens the topic's full detail.",
    },
    "study-topic-overview": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            back: { leaf: "button" },
            header: { layout: "page-header-stack" },
            description: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
            phrases: { layout: "study-phrase-list", optional: true },
            notice: { composite: "empty-notice", optional: true },
            action: { leaf: "button", optional: true },
        },
        why: "Use when you need the full single-topic screen: a back control and header, an optional self-explaining description, an ordered phrase list (or empty-state notice), and one optional deliberate action into practice.",
    },
    "study-phrase-list": {
        classes: ["flex", "flex-col", "divide-y", "divide-separator", "overflow-hidden", "rounded-3xl", "border", "border-separator"],
        children: { phrase: { layout: "study-phrase-row", repeats: true, restingCount: 6 } },
        why: "Use when you need a topic's phrases shown as one continuous divided sequence, so meaning and example can be scanned row to row without a separate card border around each phrase.",
    },
    "study-phrase-row": {
        classes: ["flex", "flex-col", "gap-2", "p-4"],
        children: {
            phrase: { leaf: "heading" },
            meaning: { leaf: "text" },
            example: { leaf: "text", props: { size: "sm", tone: "muted" }, optional: true },
        },
        why: "Use when you need a single study row that leads with the English phrase, follows with its localized meaning, and optionally adds a muted usage example.",
    },
    "study-practice-stack": {
        classes: ["mx-auto", "flex", "w-full", "max-w-app-md", "flex-col", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: {
            header: { layout: "title-with-baseline-fact" },
            prompt: { leaf: "heading", optional: true },
            options: { layout: "study-option-grid", optional: true },
            result: { layout: "study-result-stack", optional: true },
            notice: { composite: "empty-notice", optional: true },
            action: { leaf: "button", repeats: true, restingCount: 2, optional: true },
            exit: { leaf: "button", optional: true },
        },
        why: "Use when you need the shell for one practice sitting: a baseline header, an optional prompt, an optional answer grid that is replaced in place by a result summary once the sitting is settled, plus up to two forward actions and an exit, all without changing route identity.",
    },
    "study-option-grid": {
        classes: ["grid", "grid-cols-1", "gap-3"],
        children: { answer: { leaf: "single-choice" } },
        why: "Use when you need a single-select grid of phrase candidates so exactly one recalled phrase can answer the current meaning prompt.",
    },
    "study-result-stack": {
        classes: ["flex", "flex-col", "gap-4", "rounded-3xl", "bg-success-soft", "p-6"],
        children: {
            title: { leaf: "heading" },
            stat: { composite: "stat-row", repeats: true, restingCount: 3 },
            action: { leaf: "button", repeats: true, restingCount: 2 },
        },
        why: "Use when you need to close a practice sitting on a success-tinted surface with a title, up to three verified/local stat counters, and up to two follow-up actions such as repeat or return.",
    },
    "game-hub-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-6", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: { standing: { layout: "standing-hero-card" }, catalog: { layout: "game-catalog-section" } },
        why: "Use this when you need friend rivalry to establish the reason to play before four legacy-backed games provide the concrete choice.",
    },
    "game-active-session-page": {
        classes: ["mx-auto", "flex", "w-full", "max-w-6xl", "flex-col", "gap-4", "px-4", "py-6", "pb-28", "md:px-6", "md:pb-6"],
        children: { runner: { layout: "game-runner-stack" } },
        why: "Use this when you need an active game to replace discovery in place, leaving room identity and the Phaser canvas as the only task.",
    },
    "game-catalog-section": {
        classes: ["flex", "flex-col", "gap-4"],
        children: { header: { layout: "page-header-stack" }, games: { layout: "game-grid" } },
        why: "if you need a header announcing the games catalog immediately followed by the grid of available games.",
    },
    "game-grid": {
        classes: ["grid", "grid-cols-1", "gap-4", "sm:grid-cols-2"],
        children: { game: { composite: "game-catalog-card", repeats: true, restingCount: 4 } },
        why: "if you need a responsive grid of game-catalog cards, each carrying its own mode evidence and one setup action.",
    },
    "game-card": {
        classes: ["flex", "h-full", "flex-col", "gap-4", "p-4"],
        children: { cover: { leaf: "cover-image" }, body: { layout: "evidence-title-over-subtitle" }, modes: { layout: "game-card-actions" }, action: { leaf: "button" } },
        why: "if you need a single game's catalog card combining cover art, a title/subtitle promise, its supported-mode chips, and one unambiguous setup action.",
    },
    "game-card-actions": {
        classes: ["flex", "flex-wrap", "items-center", "gap-2"],
        children: { mode: { leaf: "badge", repeats: true, restingCount: 2 } },
        why: "if you need up to two mode-availability chips wrapped together as a row of supporting facts, kept visually separate from the card's setup action.",
    },
    "game-setup-panel": {
        classes: ["flex", "flex-col", "gap-5", "p-5"],
        children: { header: { layout: "page-header-stack" }, back: { leaf: "button", optional: true }, content: { layout: ["game-mode-grid", "game-character-grid", "game-code-join-row"] } },
        why: "if you need a modal that advances through exactly one setup decision at a time — mode, character, or code entry — with an optional back control while the already-chosen game stays visible.",
    },
    "game-mode-grid": {
        classes: ["grid", "grid-cols-1", "gap-3", "sm:grid-cols-2"],
        children: { mode: { leaf: "button", repeats: true, restingCount: 3 } },
        why: "if you need a grid of mutually exclusive launch-mode buttons, such as solo, friend room, and team matchmaking.",
    },
    "game-character-grid": {
        classes: ["grid", "grid-cols-2", "gap-3"],
        children: { character: { leaf: "button", repeats: true, restingCount: 2 } },
        why: "if you need a two-up grid of parallel playable-character buttons, shown after the launch mode has already been chosen.",
    },
    "game-code-join-row": {
        classes: ["flex", "flex-col", "gap-3"],
        children: { create: { leaf: "button" }, label: { leaf: "text" }, code: { leaf: "input" }, join: { leaf: "button" } },
        why: "if you need one row that keeps creating a room and joining one by code as two distinct actions, with the code input attached directly to its join control.",
    },
    "game-runner-stack": {
        classes: ["flex", "flex-col", "gap-4"],
        children: { lobby: { composite: "game-lobby-panel", optional: true }, canvas: { layout: "game-canvas-frame", optional: true }, result: { composite: "game-result-card", optional: true }, notice: { composite: "empty-notice", optional: true }, exit: { leaf: "button" } },
        why: "if you need the in-session game shell that shows lobby, canvas, and result panels in phase order, with an optional empty-state notice and an exit control reachable in every state.",
    },
    "game-canvas-frame": {
        classes: ["w-full"],
        children: { canvas: { leaf: "game-canvas" } },
        why: "if you need a frame that holds the Phaser game canvas at its intrinsic 16:9 aspect ratio with one stable visual boundary, regardless of screen size.",
    },
    "game-lobby-card": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: { title: { leaf: "heading" }, code: { leaf: "text", optional: true }, players: { layout: "game-player-list" }, action: { leaf: "button", optional: true } },
        why: "if you need a pre-match card that shows the room code next to the live connected-player roster in one glance, with an optional action to start the match.",
    },
    "game-player-list": {
        classes: ["flex", "flex-col", "gap-2"],
        children: { player: { leaf: "text", repeats: true, restingCount: 2 } },
        why: "if you need a vertical, single-axis list of connected players' names and scores kept comparable row by row, instead of collapsing into an unreadable inline run.",
    },
    "game-result-card": {
        classes: ["flex", "flex-col", "gap-4", "p-4"],
        children: { title: { leaf: "heading" }, players: { layout: "game-player-list" }, actions: { layout: "game-result-actions" } },
        why: "if you need a post-match card that shows the verified winner with the ordered player scores and leads straight into rematch-or-lobby actions, without a reward-receipt display.",
    },
    "game-result-actions": {
        classes: ["flex", "flex-wrap", "gap-3"],
        children: { action: { leaf: "button", repeats: true, restingCount: 2 } },
        why: "if you need the two explicit next-move buttons, rematch and return to lobby, offered once the authoritative match result has settled.",
    },
})

/** Every key in the catalog. A key not in this union is a compile error at the call site. */
export type LayoutKey = keyof typeof LAYOUTS

/** Slot names whose layout entry declares a repeated run. */
type RepeatedSlotNames<K extends LayoutKey> = {
    [S in keyof (typeof LAYOUTS)[K]["children"]]:
        (typeof LAYOUTS)[K]["children"][S] extends { readonly repeats: true } ? S : never
}[keyof (typeof LAYOUTS)[K]["children"]]

/**
 * Layouts a joined-list surface may host: a separated root made only from repeated slots.
 * The class and cardinality are both checked so a grid or a mixed header/list node cannot enter.
 */
export type JoinedListLayoutKey = {
    [K in LayoutKey]:
        "divide-y" extends (typeof LAYOUTS)[K]["classes"][number]
            ? [RepeatedSlotNames<K>] extends [never]
                ? never
                : Exclude<keyof (typeof LAYOUTS)[K]["children"], RepeatedSlotNames<K>> extends never
                    ? K
                    : never
            : never
}[LayoutKey]

/**
 * Read one entry, widened to the shared shape.
 *
 * @param name - The catalog key to read.
 */
export const layoutSpec = (name: LayoutKey): LayoutSpec => LAYOUTS[name]

/** Resolve one layout into the props its branch places on the real layout node. */
export const layoutNodeProps = (name: LayoutKey) => {
    const spec = layoutSpec(name)
    return {
        className: cn(...spec.classes, `layout-name-${name}`),
    }
}

/** Every catalog key, in declaration order, so gates and tests can walk the vocabulary. */
export const LAYOUT_KEYS: ReadonlyArray<LayoutKey> = Object.keys(LAYOUTS) as Array<LayoutKey>
