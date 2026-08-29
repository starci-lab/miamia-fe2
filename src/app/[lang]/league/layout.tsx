import type { ReactNode } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    layoutNode,
    layoutContent,
    renderLeaf,
} from "@/modules/types/layout"

/** Props for the leaderboard route family layout. */
type LeagueLayoutProps = {
    readonly children: ReactNode
}

/**
 * Keep product navigation beside the routed leaderboard body.
 *
 * WHY THIS FILE EXISTS AT ALL. The leaderboard is reached from the dashboard, so it is easy to
 * assume it inherits the dashboard's chrome - and it does not: `app/dashboard/layout.tsx` wraps the
 * `dashboard` segment only, and a sibling segment receives the ROOT layout, which carries providers
 * and no navbar. The first render of this route proved it by arriving with no navigation at all.
 *
 * The routed page opens a `main` because its contract entry names that host: the landmark is what
 * lets assistive technology skip the navbar rather than walk every link again on each route change.
 */
const LeagueLayout = ({ children }: LeagueLayoutProps) => (
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

export default LeagueLayout
