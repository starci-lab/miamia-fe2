import { Grammar } from "@/components/branches/Grammar"
import { Avatar } from "@/components/leaves/Avatar"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { IconButton } from "@/components/leaves/IconButton"
import { Link } from "@/components/leaves/Link"
import { Text } from "@/components/leaves/Text"
import {
    createGrammarNode,
    createLeafNode,
} from "@/components/contracts/props"

/** Resolved public identity drawn by the profile rail. */
export type ProfileHeroData = {
    readonly name: string
    readonly handle: string
    readonly avatar?: string
    readonly role?: string
    readonly bio?: string
    readonly location?: string
    readonly workMode?: string
    readonly followerLabel: string
    readonly followingLabel: string
    readonly primaryLabel: string
    readonly primaryPending: boolean
    readonly shareLabel: string
    readonly githubUrl?: string
    readonly linkedinUrl?: string
    readonly websiteUrl?: string
    readonly joinedLabel: string
}

/** Product outcomes exposed by the pure profile hero. */
export type ProfileHeroActions = {
    readonly primary?: () => void
    readonly share?: () => void
}

/** State and settled data accepted by the profile hero. */
export type ProfileHeroProps = {
    readonly state: "pending" | "ready"
    readonly props: ProfileHeroData
    readonly on?: ProfileHeroActions
}

/** Draw the complete identity rail without resolving profile behavior. */
export const ProfileHeroBase = (input: ProfileHeroProps) => {
    const isLoading = input.state === "pending"
    const factValues = [input.props.location, input.props.workMode].filter((value): value is string => Boolean(value))
    const meta = [
        input.props.githubUrl === undefined ? undefined : createLeafNode("link", {}, () => (
            <Link props={{ label: "GitHub", externalHref: input.props.githubUrl, icon: "github" }} />
        )),
        input.props.linkedinUrl === undefined ? undefined : createLeafNode("link", {}, () => (
            <Link props={{ label: "LinkedIn", externalHref: input.props.linkedinUrl }} />
        )),
        input.props.websiteUrl === undefined ? undefined : createLeafNode("link", {}, () => (
            <Link props={{ label: input.props.websiteUrl ?? "", externalHref: input.props.websiteUrl, icon: "explore" }} />
        )),
        createLeafNode("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: input.props.joinedLabel, size: "xs" }} isLoading={isLoading} />
        )),
    ].filter((item): item is NonNullable<typeof item> => item !== undefined)

    return (
        <Grammar
            contract="profile-hero-rail"
            render={createGrammarNode("profile-hero-rail", {
                avatar: createLeafNode("avatar", {}, () => (
                    <Avatar props={{ name: input.props.name, src: input.props.avatar, size: "lg" }} isLoading={isLoading} />
                )),
                identity: createGrammarNode("profile-name-role-stack", {
                    name: createLeafNode("heading", {}, () => (
                        <Heading props={{ content: input.props.name, level: 2 }} isLoading={isLoading} />
                    )),
                    handle: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                        <Text props={{ content: `@${input.props.handle}`, size: "xs" }} isLoading={isLoading} />
                    )),
                    ...(input.props.role === undefined ? {} : {
                        role: createLeafNode("text", { size: "sm" }, () => (
                            <Text props={{ content: input.props.role, size: "sm", weight: "medium" }} isLoading={isLoading} />
                        )),
                    }),
                }),
                ...(input.props.bio === undefined ? {} : {
                    bio: createLeafNode("text", { size: "sm", tone: "muted" }, () => (
                        <Text props={{ content: input.props.bio, size: "sm", tone: "muted" }} isLoading={isLoading} />
                    )),
                }),
                ...(factValues.length === 0 ? {} : {
                    facts: createGrammarNode("profile-fact-run", {
                        fact: factValues.map((fact) => createLeafNode("badge", {}, () => (
                            <Badge props={{ content: fact }} isLoading={isLoading} />
                        ))),
                    }),
                }),
                proof: createGrammarNode("profile-proof-row", {
                    fact: [input.props.followerLabel, input.props.followingLabel].map((fact) => (
                        createLeafNode("text", { size: "sm", weight: "semibold" }, () => (
                            <Text props={{ content: fact, size: "sm", weight: "semibold" }} isLoading={isLoading} />
                        ))
                    )),
                }),
                actions: createGrammarNode("profile-action-row", {
                    primary: createLeafNode("button", {}, () => (
                        <Button
                            props={{ label: input.props.primaryLabel, variant: "primary", isPending: input.props.primaryPending }}
                            on={{ press: input.on?.primary }}
                            isLoading={isLoading}
                        />
                    )),
                    share: createLeafNode("icon-button", {}, () => (
                        <IconButton props={{ icon: "send", label: input.props.shareLabel }} on={{ press: input.on?.share }} />
                    )),
                }),
                meta: createGrammarNode("profile-meta-list", { item: meta }),
            })}
        />
    )
}

/** Source-level marker for the pure profile block. */
export const meta = { world: "pure", domain: "profile" } as const
