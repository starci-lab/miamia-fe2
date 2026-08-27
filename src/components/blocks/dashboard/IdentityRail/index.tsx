"use client"

import { Grammar } from "@/components/branches/Grammar"
import { StreakStatRow } from "@/components/blocks/dashboard/StreakStatRow"
import { CreditStatRow } from "@/components/blocks/dashboard/CreditStatRow"
import { RewardStatRow } from "@/components/blocks/dashboard/RewardStatRow"
import { ProfileIdentityRow } from "@/components/blocks/dashboard/ProfileIdentityRow"
import { createCompositeNode, createGrammarNode } from "@/components/contracts/props"

/**
 * BLOCK - `IdentityRail`: the three standing figures, read as one rail.
 *
 * A BLOCK MADE OF BLOCKS. It owns no request of its own - each row settles on its own - so it has
 * no state either, and the three rows appear as each one answers rather than all at the speed of
 * the slowest. That is the deliberate trade: out of step beats held hostage.
 *
 * WHAT IT DOES OWN is the seam between them, which is a contract, and the name over them, which is
 * copy. Nothing else.
 *
 * THE BASE SUFFIX'S PROMISE IS LOCAL, NOT TRANSITIVE. There is no `IdentityRailBase` because there is
 * nothing to resolve here; and a test rendering this mounts three blocks that fetch.
 */
export const IdentityRail = () => {
    return (
        <Grammar
            contract="profile-over-stat-rows"
            render={createGrammarNode("profile-over-stat-rows", {
                profile: createCompositeNode("profile-row", {}, () => <ProfileIdentityRow />),
                stats: createGrammarNode("stacked-stat-rows", {
                    stat: [
                        createCompositeNode("stat-row", {}, () => <StreakStatRow />),
                        createCompositeNode("stat-row", {}, () => <CreditStatRow />),
                        createCompositeNode("stat-row", {}, () => <RewardStatRow />),
                    ],
                }),
            })}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { world: "connected", domain: "identity" } as const
