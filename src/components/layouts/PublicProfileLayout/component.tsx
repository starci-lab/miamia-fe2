import type { ComponentType } from "react"
import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { ProfileHero } from "@/components/blocks/profile/ProfileHero"
import { ProfileTabsBase as ProfileTabsView, type ProfileTabsData } from "@/components/blocks/profile/ProfileTabs"
import {
    createCompositeNode,
    createGrammarNode,
    createGrammarProjection,
} from "@/components/contracts/props"

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
                contract="centred-empty-notice"
                render={createGrammarNode("centred-empty-notice", {
                    notice: createCompositeNode("empty-notice", {}, () => (
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
                contract="centred-empty-notice"
                render={createGrammarNode("centred-empty-notice", {
                    notice: createCompositeNode("empty-notice", {}, () => (
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
            <Grammar contract="profile-page-measure" render={createGrammarNode("profile-page-measure", {
                inset: createGrammarNode("profile-page-inset", {
                    shell: createGrammarNode("profile-rail-container", {
                        split: createGrammarNode("profile-rail-then-main", {
                            rail: createGrammarNode("profile-identity-rail", {
                                hero: createGrammarProjection("profile-hero-rail", () => <ProfileHero />),
                            }),
                            main: createGrammarProjection("centred-empty-notice", () => (
                                <SurfaceCard contract="centred-empty-notice" render={createGrammarNode("centred-empty-notice", {
                                    notice: createCompositeNode("empty-notice", {}, () => (
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
        <Grammar contract="profile-tabs-over-body" render={createGrammarNode("profile-tabs-over-body", {
            tabs: createGrammarProjection("underlined-tab-strip", () => (
                <ProfileTabsView props={input.props.tabs} on={{ select: input.on.selectTab }} />
            )),
            body: createGrammarNode("profile-page-measure", {
                inset: createGrammarNode("profile-page-inset", {
                    shell: createGrammarNode("profile-rail-container", {
                        split: createGrammarNode("profile-rail-then-main", {
                            rail: createGrammarNode("profile-identity-rail", {
                                hero: createGrammarProjection("profile-hero-rail", () => <ProfileHero />),
                            }),
                            main: createGrammarProjection("profile-main", () => <Body />),
                        }),
                    }),
                }),
            }),
        })} />
    )
}

/** Source-level marker for the pure profile layout. */
export const meta = { world: "pure", domain: "profile" } as const
