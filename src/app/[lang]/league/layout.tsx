import type { ReactNode } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    createGrammarNode,
    createGrammarProjection,
    createLeafNode,
} from "@/components/contracts/props"

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

export default LeagueLayout
