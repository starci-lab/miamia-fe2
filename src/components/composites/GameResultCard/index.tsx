import { SurfaceCard } from "@/components/branches/SurfaceCard"; import { Button } from "@/components/leaves/Button"; import { Heading } from "@/components/leaves/Heading"; import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"
type GameResultCardData = { readonly title: string; readonly players: ReadonlyArray<string>; readonly rematchLabel: string; readonly lobbyLabel: string }
type GameResultCardActions = { readonly rematch?: () => void; readonly lobby?: () => void }
/** Draw the verified winner, ordered scores and two post-match actions. */
export const GameResultCard = ({ props, on }: CompositeProps<GameResultCardData, GameResultCardActions>) => <SurfaceCard layout="game-result-card" render={layoutNode("game-result-card", {
    title: renderLeaf("heading", {}, () => <Heading props={{ content: props.title, level: 2 }} />),
    players: layoutNode("game-player-list", { player: props.players.map((player) => renderLeaf("text", { size: "sm" }, () => <Text props={{ content: player, size: "sm" }} />)) }),
    actions: layoutNode("game-result-actions", { action: [renderLeaf("button", {}, () => <Button props={{ label: props.rematchLabel, variant: "primary" }} on={{ press: on?.rematch }} />), renderLeaf("button", {}, () => <Button props={{ label: props.lobbyLabel, variant: "outline" }} on={{ press: on?.lobby }} />)] }),
})} />
/** Declares the result card as a pure composite. */
