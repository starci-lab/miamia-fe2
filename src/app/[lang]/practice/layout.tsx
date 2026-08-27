import type { ReactNode } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { ShellNav } from "@/components/layouts/ShellNav"
import {
    createGrammarNode,
    createGrammarProjection,
    createLeafNode,
} from "@/components/contracts/props"

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

export default PracticeLayout
