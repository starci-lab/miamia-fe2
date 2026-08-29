import type { ReactNode } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    layoutNode,
    layoutContent,
    renderLeaf,
} from "@/modules/types/layout"

/** Props for the courses route family layout. */
type CoursesLayoutProps = {
    readonly children: ReactNode
}

/**
 * Keep global navigation mounted across the courses route cluster.
 *
 * The catalog is a product surface, so it wears the product navbar for the same reason the
 * dashboard and the profile do: a reader who arrives here can still leave. Without this the route
 * rendered on the bare root layout - correct content, no shell, and no way out of it - which is
 * what the first run of the real page showed.
 *
 * The routed page opens a `main` because its registry entry names that host: the landmark is what
 * lets assistive technology skip the navbar instead of walking every link again on each route
 * change.
 */
const CoursesLayout = ({ children }: CoursesLayoutProps) => (
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

export default CoursesLayout
