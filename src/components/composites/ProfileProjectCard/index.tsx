import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { PressableSurface } from "@/components/branches/PressableSurface"
import { Badge } from "@/components/leaves/Badge"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"

/** Resolved showcase facts for one pinned project. */
export type ProfileProjectCardData = {
    readonly title?: string
    readonly description?: string
    readonly kind?: string
    readonly technologies: ReadonlyArray<string>
    readonly verified?: boolean
}

/** Optional external-project outcome reported by a pressable showcase. */
export type ProfileProjectCardActions = { readonly press?: () => void }
/** Closed composite input for one project showcase tile. */
export type ProfileProjectCardProps = CompositeProps<ProfileProjectCardData, ProfileProjectCardActions>

/** One pinned-project tile; unlike a proof row, its tags and verification form a bounded showcase. */
export const ProfileProjectCard = ({ props, on, isLoading = false }: ProfileProjectCardProps) => {
    const content = layoutNode("profile-project-card", {
        badge: renderLeaf("badge", {}, () => (
            <Badge props={{ content: props.verified ? "Verified by StarCi" : props.kind ?? "External", tone: props.verified ? "success" : "neutral" }} isLoading={isLoading} />
        )),
        title: renderLeaf("text", { size: "sm", weight: "semibold" }, () => (
            <Text props={{ content: props.title, size: "sm", weight: "semibold" }} isLoading={isLoading} />
        )),
        ...(props.description === undefined ? {} : {
            description: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
                <Text props={{ content: props.description, size: "xs" }} isLoading={isLoading} />
            )),
        }),
        ...(props.technologies.length === 0 ? {} : {
            tech: layoutNode("profile-project-tech-run", {
                tech: props.technologies.map((technology) => renderLeaf("badge", {}, () => (
                    <Badge props={{ content: technology }} isLoading={isLoading} />
                ))),
            }),
        }),
    })
    /*
     * ONE GRID, ONE KIND OF CARD. A project with a link is pressable and a project without one is
     * not, but both are the same object standing on the same ground - so the surface comes from the
     * same branch either way and only the press target differs.
     */
    return on?.press === undefined
        ? <SurfaceCard layout="profile-project-card" render={content} />
        : <PressableSurface layout="profile-project-card" render={content} label={props.title ?? "Project"} press={on.press} isRaised />
}

/** Source-level tier marker. */
