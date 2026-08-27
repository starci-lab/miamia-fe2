import { Grammar } from "@/components/branches/Grammar"
import { Link } from "@/components/leaves/Link"
import { NavLink } from "@/components/leaves/NavLink"
import { IconButton } from "@/components/leaves/IconButton"
import { AccountMenu } from "@/components/blocks/auth/AccountMenu"
import { PressableInputLike } from "@/components/leaves/PressableInputLike"
import { ThemeSwitch } from "@/components/leaves/ThemeSwitch"
import { ExtendedTabs } from "@/components/leaves/ExtendedTabs"
import type { IconName } from "@/components/leaves/Icon"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

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
        contract="double-navbar"
        render={createGrammarNode("double-navbar", {
            primary: createGrammarNode("brand-links-then-tools-bar", {
                navigation: createGrammarNode("inline-nav-links", {
                    brand: createLeafNode("link", { emphasis: "brand" }, () => (
                        <Link
                            props={{ label: input.props.brand, emphasis: "brand" }}
                            on={{ press: () => input.on?.navigate?.("dashboard") }}
                        />
                    )),
                    routes: createGrammarNode("inline-route-links", {
                        route: input.props.routes.map((route) => createLeafNode("nav-link", { kind: "route" }, () => (
                            <NavLink
                                props={{ label: route.label, isCurrent: route.isCurrent, kind: "route" }}
                                on={{ press: () => input.on?.navigate?.(route.id) }}
                            />
                        ))),
                    }),
                }),
                tools: createGrammarNode("inline-tool-row", {
                    desktop: createGrammarNode("desktop-navbar-tools", {
                        search: createLeafNode("pressable-input-like", {}, () => (
                            <PressableInputLike
                                props={{ placeholder: input.props.searchPlaceholder, label: input.props.searchLabel, shortcut: input.props.searchShortcut }}
                                on={{ press: input.on?.openSearch }}
                            />
                        )),
                        locale: createLeafNode("icon-button", {}, () => (
                            <IconButton props={{ icon: "locale", label: input.props.localeLabel }} on={{ press: input.on?.toggleLocale }} />
                        )),
                        theme: createLeafNode("theme-switch", {}, () => (
                            <ThemeSwitch
                                props={{ isDark: input.props.isDark, label: input.props.themeLabel }}
                                on={{ change: input.on?.toggleTheme }}
                            />
                        )),
                    }),
                    tool: [
                        createLeafNode("icon-button", {}, () => (
                            <IconButton props={{ icon: "cart", label: input.props.cartLabel }} on={{ press: input.on?.openCart }} />
                        )),
                        ...(input.props.isSignedIn ? [createLeafNode("icon-button", {}, () => (
                            <IconButton props={{ icon: "notification", label: input.props.notificationLabel }} />
                        ))] : []),
                        ...(input.props.isSignedIn ? [createLeafNode("icon-button", {}, () => (
                            <IconButton props={{ icon: "account", label: input.props.accountLabel }} />
                        ))] : [createLeafNode("account-menu", {}, () => (
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
            bottom: input.props.tabs === undefined ? undefined : createGrammarNode("underlined-tab-strip", {
                tabs: createLeafNode("extended-tabs", {}, () => (
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
export const meta = { world: "pure", domain: "shell" } as const
