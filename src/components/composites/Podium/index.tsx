import { Grammar } from "@/components/branches/Grammar"
import { Avatar } from "@/components/leaves/Avatar"
import { PodiumStep, type PodiumPlace } from "@/components/leaves/PodiumStep"
import { RankMark } from "@/components/leaves/RankMark"
import { Text } from "@/components/leaves/Text"
import {
    createCompositeNode,
    createGrammarNode,
    createLeafNode,
    type CompositeProps,
} from "@/components/contracts/props"

/**
 * COMPOSITE - `Podium`: the top three, arranged so the ranking is the picture.
 *
 * WHY NOT A LIST. `ranked-user-list` states that its rows are comparable peers. The first three
 * places are not peers - that is the entire claim a dais makes - so expressing them as three list
 * rows with different numbers would be the wrong sentence in the right grammar.
 *
 * READING ORDER IS NOT VISUAL ORDER. Places are emitted best-first, so anyone reading in sequence
 * hears first, second, third. The 2-1-3 dais is produced by the `podium` contract's own nth-child
 * ordering, because "champion in the middle" is a fact about the dais rather than about whoever
 * happens to be standing on it.
 */

/** One resolved finisher. */
export type PodiumEntryData = {
    /** One-based place; only the first three are drawn. */
    readonly rank: number
    readonly username: string | null
    readonly avatar: string | null
    /** Resolved accessible label retaining the numeric place. */
    readonly rankLabel?: string
    /** Already-translated score, e.g. "480 XP". */
    readonly pointsLabel: string
    /** True when this finisher is the viewer. */
    readonly isMe: boolean
}

/** Resolved podium data. */
export type PodiumData = {
    readonly entries: ReadonlyArray<PodiumEntryData>
    /** Suffix appended to the viewer's own name. */
    readonly meLabel: string
    /** Fallback for a finisher with no username. */
    readonly anonymousLabel: string
}

/** Props for {@link Podium}. */
export type PodiumProps = CompositeProps<PodiumData>

/** Places are emitted best-first; the `podium` contract turns this into the 2-1-3 dais. */
const PLACES: ReadonlyArray<PodiumPlace> = [1, 2, 3]

/** Resolves the displayed name for one finisher, appending the viewer suffix when it is the viewer. */
const nameFor = (entry: PodiumEntryData | undefined, meLabel: string, anonymousLabel: string): string | undefined => {
    if (entry === undefined) return undefined
    const displayName = entry.username ?? anonymousLabel
    if (entry.isMe) return `${displayName} · ${meLabel}`
    return displayName
}

/** Draw the top three as a dais. */
export const Podium = ({ props, isLoading = false }: PodiumProps) => {
    const byRank = new Map(props.entries.map((entry) => [entry.rank, entry]))
    const place = PLACES.flatMap((rank) => {
        const entry = byRank.get(rank)
        if (entry === undefined && !isLoading) return []
        const name = nameFor(entry, props.meLabel, props.anonymousLabel)
        return [createCompositeNode("podium-place", {}, () => (
            <Grammar contract="podium-place" render={createGrammarNode("podium-place", {
                mark: createLeafNode("rank-mark", { placement: "row" }, () => (
                    <RankMark
                        props={{ rank, placement: "row", accessibleLabel: entry?.rankLabel }}
                        isLoading={isLoading}
                    />
                )),
                avatar: createLeafNode("avatar", {}, () => (
                    <Avatar
                        props={{ name, src: entry?.avatar ?? undefined, size: rank === 1 ? "lg" : "md" }}
                        isLoading={isLoading}
                    />
                )),
                name: createLeafNode("text", {}, () => (
                    <Text
                        props={{
                            content: name,
                            size: "sm",
                            weight: entry?.isMe === true ? "semibold" : undefined,
                            tone: entry?.isMe === true ? "accent" : "default",
                        }}
                        isLoading={isLoading}
                    />
                )),
                points: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
                    <Text props={{ content: entry?.pointsLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
                )),
                step: createLeafNode("podium-step", {}, () => (
                    <PodiumStep props={{ place: rank }} isLoading={isLoading} />
                )),
            })} />
        ))]
    })
    return <Grammar contract="podium" render={createGrammarNode("podium", { place })} />
}

/** Source-level tier marker. */
export const meta = { shape: "composite", world: "pure" } as const
