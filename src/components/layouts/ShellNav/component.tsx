import { Grammar } from "@/components/layouts/Grammar"
import { Link } from "@/components/leaves/Link"
import { NavLink } from "@/components/leaves/NavLink"
import { IconButton } from "@/components/leaves/IconButton"
import { AccountMenu } from "@/components/blocks/auth/AccountMenu"
import { PressableInputLike } from "@/components/leaves/PressableInputLike"
import { ThemeSwitch } from "@/components/leaves/ThemeSwitch"
import { ExtendedTabs } from "@/components/leaves/ExtendedTabs"
import type { IconName } from "@/components/leaves/Icon"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** One destination in the primary navbar row. */
export type ShellNavRoute = {
    readonly id: string
    readonly label: string
    readonly isCurrent?: boolean
}

/** One destination in the page-owned bottom navbar layer. */
export type ShellNavTab = ShellNavRoute & {
    readonly icon: IconName
}

/** Resolved copy and state drawn by the double navbar. */
export type ShellNavData = {
    readonly brand: string
    readonly routes: ReadonlyArray<ShellNavRoute>
    readonly tabs?: ReadonlyArray<ShellNavTab>
    readonly themeLabel: string
    readonly isDark: boolean
    readonly localeLabel: string
    readonly searchPlaceholder: string
    readonly searchLabel: string
    readonly searchShortcut: string
    readonly cartLabel: string
    readonly notificationLabel: string
    readonly accountLabel: string
    readonly guestMessage: string
    readonly signInLabel: string
    readonly signUpLabel: string
    readonly isSignedIn: boolean
}

/** Events reported by navbar controls. */
export type ShellNavActions = {
    readonly openSignIn?: () => void
    readonly openSignUp?: () => void
    readonly navigate?: (id: string) => void
    readonly selectTab?: (key: string) => void
    readonly openSearch?: () => void
    readonly toggleTheme?: () => void
    readonly toggleLocale?: () => void
    /** Opens the basket panel. The navbar owns the control; the shell owns the panel. */
    readonly openCart?: () => void
}

/** Props for the presentational double navbar. */
export type ShellNavProps = {
    readonly props: ShellNavData
    readonly on?: ShellNavActions
}

/** Draw the primary navbar and its optional page-tab bottom layer as one landmark. */
export const ShellNavBase = (input: ShellNavProps) => (
    <Grammar
        layout="double-navbar"
        render={layoutNode("double-navbar", {
            primary: layoutNode("brand-links-then-tools-bar", {
                navigation: layoutNode("inline-nav-links", {
                    brand: renderLeaf("link", { emphasis: "brand" }, () => (
                        <Link
                            props={{ label: input.props.brand, emphasis: "brand" }}
                            on={{ press: () => input.on?.navigate?.("dashboard") }}
                        />
                    )),
                    routes: layoutNode("inline-route-links", {
                        route: input.props.routes.map((route) => renderLeaf("nav-link", { kind: "route" }, () => (
                            <NavLink
                                props={{ label: route.label, isCurrent: route.isCurrent, kind: "route" }}
                                on={{ press: () => input.on?.navigate?.(route.id) }}
                            />
                        ))),
                    }),
                }),
                tools: layoutNode("inline-tool-row", {
                    desktop: layoutNode("desktop-navbar-tools", {
                        search: renderLeaf("pressable-input-like", {}, () => (
                            <PressableInputLike
                                props={{ placeholder: input.props.searchPlaceholder, label: input.props.searchLabel, shortcut: input.props.searchShortcut }}
                                on={{ press: input.on?.openSearch }}
                            />
                        )),
                        locale: renderLeaf("icon-button", {}, () => (
                            <IconButton props={{ icon: "locale", label: input.props.localeLabel }} on={{ press: input.on?.toggleLocale }} />
                        )),
                        theme: renderLeaf("theme-switch", {}, () => (
                            <ThemeSwitch
                                props={{ isDark: input.props.isDark, label: input.props.themeLabel }}
                                on={{ change: input.on?.toggleTheme }}
                            />
                        )),
                    }),
                    tool: [
                        renderLeaf("icon-button", {}, () => (
                            <IconButton props={{ icon: "cart", label: input.props.cartLabel }} on={{ press: input.on?.openCart }} />
                        )),
                        ...(input.props.isSignedIn ? [renderLeaf("icon-button", {}, () => (
                            <IconButton props={{ icon: "notification", label: input.props.notificationLabel }} />
                        ))] : []),
                        ...(input.props.isSignedIn ? [renderLeaf("icon-button", {}, () => (
                            <IconButton props={{ icon: "account", label: input.props.accountLabel }} />
                        ))] : [renderLeaf("account-menu", {}, () => (
                            <AccountMenu
                                props={{
                                    label: input.props.accountLabel,
                                    guestMessage: input.props.guestMessage,
                                    signInLabel: input.props.signInLabel,
                                    signUpLabel: input.props.signUpLabel,
                                }}
                                on={{ signIn: input.on?.openSignIn, signUp: input.on?.openSignUp }}
                            />
                        ))]),
                    ],
                }),
            }),
            bottom: input.props.tabs === undefined ? undefined : layoutNode("underlined-tab-strip", {
                tabs: renderLeaf("extended-tabs", {}, () => (
                    <ExtendedTabs
                        props={{
                            label: input.props.brand,
                            selectedKey: input.props.tabs?.find((tab) => tab.isCurrent)?.id ?? "overview",
                            tabs: input.props.tabs ?? [],
                        }}
                        on={{ select: input.on?.selectTab }}
                    />
                )),
            }),
        })}
    />
)

/** Source-level tier marker for the pure shell layout. */
