import type { ReactNode } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    layoutNode,
    layoutContent,
    renderLeaf,
} from "@/modules/types/layout"

/** Props for the dashboard route family layout. */
type DashboardLayoutProps = {
    readonly children: ReactNode
}

/**
 * Keep dashboard navigation beside the routed dashboard body.
 *
 * Authentication deliberately lives outside this nested layout, so its route receives providers
 * from the root but cannot accidentally inherit the product navbar.
 *
 * The routed page opens a `main` because its registry entry names that host, not because a second
 * a reader came for: the landmark is what lets assistive technology skip the navbar above it
 * instead of walking every link again on each route change.
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => (
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

export default DashboardLayout
