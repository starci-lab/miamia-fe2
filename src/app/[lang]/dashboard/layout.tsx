import type { ReactNode } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    createGrammarNode,
    createGrammarProjection,
    createLeafNode,
} from "@/components/contracts/props"

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
        contract="nav-over-body-page"
        render={createGrammarNode("nav-over-body-page", {
            navigation: createGrammarProjection("double-navbar", () => <ShellNav />),
            body: createGrammarProjection("routed-page-main", () => (
                <Grammar
                    contract="routed-page-main"
                    render={createGrammarNode("routed-page-main", {
                        page: createLeafNode("page", {}, () => children),
                    })}
                />
            )),
        })}
    />
)

export default DashboardLayout
