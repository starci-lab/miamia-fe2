import { Grammar } from "@/components/layouts/Grammar"
import { ExtendedTabs, type ExtendedTab } from "@/components/leaves/ExtendedTabs"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** Route-derived public-profile destinations resolved by the persistent layout. */
export type ProfileTabsData = {
    readonly label: string
    readonly selectedKey: string
    readonly tabs: ReadonlyArray<ExtendedTab>
}

/** The one outcome exposed by profile route chrome. */
export type ProfileTabsActions = { readonly select?: (key: string) => void }

/** The tab set this chrome draws, plus the one outcome it reports. */
type ProfileTabsInput = { readonly props: ProfileTabsData, readonly on?: ProfileTabsActions }

/** Draw profile-owned route chrome without borrowing the global navbar owner. */
export const ProfileTabsBase = (input: ProfileTabsInput) => (
    <Grammar layout="underlined-tab-strip" render={layoutNode("underlined-tab-strip", {
        tabs: renderLeaf("extended-tabs", {}, () => (
            <ExtendedTabs props={input.props} on={{ select: input.on?.select }} />
        )),
    })} />
)

/** Source-level marker for the pure profile route-chrome block. */
