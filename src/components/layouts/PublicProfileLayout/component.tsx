import type { ComponentType } from "react"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { ProfileHero } from "@/components/blocks/profile/ProfileHero"
import { ProfileTabsBase as ProfileTabsView, type ProfileTabsData } from "@/components/blocks/profile/ProfileTabs"
import {
    renderComposite,
    layoutNode,
    layoutContent,
} from "@/modules/types/layout"

/** Screen-level situations settled by the persistent public-profile layout. */
export type PublicProfileLayoutProps = {
    readonly state: "loading" | "failed" | "not-found" | "locked" | "ready"
    readonly props: {
        readonly notFoundMessage: string
        readonly failedMessage: string
        readonly lockedMessage: string
        readonly lockedDescription: string
        readonly homeLabel: string
        readonly retryLabel: string
        readonly browseLabel: string
        readonly tabs: ProfileTabsData
    }
    readonly on: {
        readonly home: () => void
        readonly browse: () => void
        readonly retry: () => void
        readonly selectTab: (key: string) => void
    }
    readonly body: ComponentType
}

/** Draw persistent profile chrome and its screen-level alternatives. */
export const PublicProfileLayoutBase = (input: PublicProfileLayoutProps) => {
    const Body = input.body
    if (input.state === "failed") {
        return (
            <SurfaceCard
                layout="centred-empty-notice"
                render={layoutNode("centred-empty-notice", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{ icon: "retry", message: input.props.failedMessage, actionLabel: input.props.retryLabel }}
                            on={{ act: input.on.retry }}
                        />
                    )),
                })}
            />
        )
    }

    if (input.state === "not-found") {
        return (
            <SurfaceCard
                layout="centred-empty-notice"
                render={layoutNode("centred-empty-notice", {
                    notice: renderComposite("empty-notice", {}, () => (
                        <EmptyNotice
                            props={{ icon: "account", message: input.props.notFoundMessage, actionLabel: input.props.homeLabel }}
                            on={{ act: input.on.home }}
                        />
                    )),
                })}
            />
        )
    }

    if (input.state === "locked") {
        return (
            <Grammar layout="profile-page-measure" render={layoutNode("profile-page-measure", {
                inset: layoutNode("profile-page-inset", {
                    shell: layoutNode("profile-rail-container", {
                        split: layoutNode("profile-rail-then-main", {
                            rail: layoutNode("profile-identity-rail", {
                                hero: layoutContent("profile-hero-rail", () => <ProfileHero />),
                            }),
                            main: layoutContent("centred-empty-notice", () => (
                                <SurfaceCard layout="centred-empty-notice" render={layoutNode("centred-empty-notice", {
                                    notice: renderComposite("empty-notice", {}, () => (
                                        <EmptyNotice
                                            props={{
                                                icon: "password",
                                                message: input.props.lockedMessage,
                                                description: input.props.lockedDescription,
                                                actionLabel: input.props.browseLabel,
                                            }}
                                            on={{ act: input.on.browse }}
                                        />
                                    )),
                                })} />
                            )),
                        }),
                    }),
                }),
            })} />
        )
    }

    return (
        <Grammar layout="profile-tabs-over-body" render={layoutNode("profile-tabs-over-body", {
            tabs: layoutContent("underlined-tab-strip", () => (
                <ProfileTabsView props={input.props.tabs} on={{ select: input.on.selectTab }} />
            )),
            body: layoutNode("profile-page-measure", {
                inset: layoutNode("profile-page-inset", {
                    shell: layoutNode("profile-rail-container", {
                        split: layoutNode("profile-rail-then-main", {
                            rail: layoutNode("profile-identity-rail", {
                                hero: layoutContent("profile-hero-rail", () => <ProfileHero />),
                            }),
                            main: layoutContent("profile-main", () => <Body />),
                        }),
                    }),
                }),
            }),
        })} />
    )
}

/** Source-level marker for the pure profile layout. */
