import type { ReactNode } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    layoutNode,
    layoutContent,
    renderLeaf,
} from "@/modules/types/layout"

/** Props for the practice route family layout. */
type PracticeLayoutProps = {
    readonly children: ReactNode
}

/**
 * Keep global navigation mounted across the practice route cluster.
 *
 * `/practice` is a SIBLING of `/dashboard`, not a child, so without this it inherits the bare root
 * layout: correct content, no shell, and no way out of it. That is exactly how `/courses` first
 * shipped, and this file is that lesson applied before the run rather than after it.
 *
 * The routed page opens a `main` because its registry entry names that host: the landmark is what
 * lets assistive technology skip the navbar instead of walking every link again on each route
 * change.
 */
const PracticeLayout = ({ children }: PracticeLayoutProps) => (
    <Grammar
        layout="nav-over-body-page"
        render={layoutNode("nav-over-body-page", {
            navigation: layoutContent("double-navbar", () => <ShellNav />),
            body: layoutContent("routed-page-main", () => (
                <Grammar
                    layout="routed-page-main"
                    render={layoutNode("routed-page-main", {
                        page: renderLeaf("page", {}, () => children),
                    })}
                />
            )),
        })}
    />
)

export default PracticeLayout
