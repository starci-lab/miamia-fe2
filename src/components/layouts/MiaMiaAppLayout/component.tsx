import { Grammar } from "@/components/layouts/Grammar"
import { learnSpine, type LearnSpineActions, type LearnSpineData } from "@/components/blocks/learn/LearnSpine/component"
import { NavLink } from "@/components/leaves/NavLink"
import type { IconName } from "@/components/leaves/Icon"
import { layoutNode, renderLeaf } from "@/modules/types/layout"
import type { ComponentType } from "react"

/** Enumerates destinations shared by desktop navigation and the mobile footbar. */
export type MiaMiaDestination = "home" | "exam" | "study" | "game" | "ranking" | "profile"
/** Describes one destination in MiaMia navigation. */
export type MiaMiaNavItem = { readonly id: MiaMiaDestination; readonly label: string; readonly icon: IconName; readonly isCurrent?: boolean }
/** Holds the desktop spine and mobile navigation data. */
export type MiaMiaAppLayoutData = { readonly spine: LearnSpineData; readonly mobileTabs: ReadonlyArray<MiaMiaNavItem> }
/** Defines navigation actions exposed by the MiaMia shell. */
export type MiaMiaAppLayoutActions = LearnSpineActions & { readonly openDestination?: (id: string) => void }
/** Defines the pure MiaMia application layout layout. */
export type MiaMiaAppLayoutProps = { readonly props: MiaMiaAppLayoutData; readonly on?: MiaMiaAppLayoutActions; readonly surface: ComponentType }

/** Renders the desktop sidebar or mobile footbar around the active surface. */
export const MiaMiaAppLayoutBase = (input: MiaMiaAppLayoutProps) => {
    const Surface = input.surface
    return (
        <Grammar layout="learn-shell-frame" render={layoutNode("learn-shell-frame", {
            spine: learnSpine({ props: input.props.spine, on: { openRow: input.on?.openDestination } }),
            body: renderLeaf("page", {}, () => <Surface />),
            bar: layoutNode("learn-mobile-tab-bar", {
                tab: input.props.mobileTabs.map((tab) => renderLeaf("nav-link", { kind: "tab" }, () => (
                    <NavLink props={{ label: tab.label, icon: tab.icon, kind: "tab", isCurrent: tab.isCurrent }} on={{ press: () => input.on?.openDestination?.(tab.id) }} />
                ))),
            }),
        })} />
    )
}

/** Declares the component architecture metadata. */
