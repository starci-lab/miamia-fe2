import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { NavLink } from "@/components/leaves/NavLink"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** One task destination retained in the personal-project workspace rail. */
export type PersonalProjectWorkspaceMilestone = {
    readonly id: string
    readonly label: string
    readonly isCurrent?: boolean
}

/** Pure workspace frame data and routed surface layout. */
export type PersonalProjectWorkspaceLayoutProps = {
    readonly milestones: ReadonlyArray<PersonalProjectWorkspaceMilestone>
    readonly surface: ComponentType
    readonly onTask?: (id: string) => void
    readonly isLoading?: boolean
}

/** Keeps milestone navigation mounted around dashboard, task and result surfaces. */
export const PersonalProjectWorkspaceLayoutBase = (input: PersonalProjectWorkspaceLayoutProps) => {
    const Surface = input.surface
    const milestones: ReadonlyArray<PersonalProjectWorkspaceMilestone> = input.isLoading === true && input.milestones.length === 0
        ? Array.from({ length: 4 }, (_, index) => ({ id: `pending-${index}`, label: "", isCurrent: false }))
        : input.milestones
    return (
        <Grammar
            layout="personal-project-workspace-frame"
            render={layoutNode("personal-project-workspace-frame", {
                milestone: milestones.map((milestone) => renderLeaf("nav-link", { kind: "section" }, () => (
                    <NavLink
                        props={{ label: milestone.label, kind: "section", isCurrent: milestone.isCurrent }}
                        on={{ press: () => input.onTask?.(milestone.id) }}
                        isLoading={input.isLoading}
                    />
                ))),
                body: renderLeaf("page", {}, () => <Surface />),
            })}
        />
    )
}

/** Architectural identity for the pure personal-project layout twin. */
