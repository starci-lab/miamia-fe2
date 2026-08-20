import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ProfileHeroBase, type ProfileHeroData } from "./component"

const full: ProfileHeroData = {
    name: "Ada Lovelace",
    handle: "ada",
    avatar: "/ada.png",
    role: "Engineer",
    bio: "Builds useful things",
    location: "London",
    workMode: "Remote",
    followerLabel: "10 followers",
    followingLabel: "8 following",
    primaryLabel: "Follow",
    primaryPending: false,
    shareLabel: "Share",
    githubUrl: "https://github.com/ada",
    linkedinUrl: "https://linkedin.test/ada",
    websiteUrl: "https://ada.test",
    joinedLabel: "Joined January 2020",
}

describe("ProfileHeroBase", () => {
    it("draws identity, facts, links and actions for a complete profile", () => {
        const markup = renderToStaticMarkup(<ProfileHeroBase state="ready" props={full} on={{ primary: vi.fn(), share: vi.fn() }} />)
        expect(markup).toContain("Ada Lovelace")
        expect(markup).toContain("Engineer")
        expect(markup).toContain("https://github.com/ada")
        expect(markup).toContain("Joined January 2020")
    })

    it("keeps optional profile regions absent and marks the skeleton loading", () => {
        const minimal: ProfileHeroData = {
            name: full.name,
            handle: full.handle,
            followerLabel: full.followerLabel,
            followingLabel: full.followingLabel,
            primaryLabel: full.primaryLabel,
            primaryPending: true,
            shareLabel: full.shareLabel,
            joinedLabel: full.joinedLabel,
        }
        const markup = renderToStaticMarkup(<ProfileHeroBase state="pending" props={minimal} />)
        expect(markup).toContain("Ada Lovelace")
        expect(markup).not.toContain("Engineer")
    })
})
