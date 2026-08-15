import { SurfaceCard } from "@/components/branches/SurfaceCard"; import { Button } from "@/components/leaves/Button"; import { Heading } from "@/components/leaves/Heading"; import { Text } from "@/components/leaves/Text"
import { defineContractComponent, defineLeafComponent, type CompositeProps } from "@/components/contracts/props"
type GameResultCardData = { readonly title: string; readonly players: ReadonlyArray<string>; readonly rematchLabel: string; readonly lobbyLabel: string }
type GameResultCardActions = { readonly rematch?: () => void; readonly lobby?: () => void }
/** Draw the verified winner, ordered scores and two post-match actions. */
export const GameResultCard = ({ props, on }: CompositeProps<GameResultCardData, GameResultCardActions>) => <SurfaceCard contract="game-result-card" render={defineContractComponent("game-result-card", {
    title: defineLeafComponent("heading", {}, () => <Heading props={{ content: props.title, level: 2 }} />),
    players: defineContractComponent("game-player-list", { player: props.players.map((player) => defineLeafComponent("text", { size: "sm" }, () => <Text props={{ content: player, size: "sm" }} />)) }),
    actions: defineContractComponent("game-result-actions", { action: [defineLeafComponent("button", {}, () => <Button props={{ label: props.rematchLabel, variant: "primary" }} on={{ press: on?.rematch }} />), defineLeafComponent("button", {}, () => <Button props={{ label: props.lobbyLabel, variant: "outline" }} on={{ press: on?.lobby }} />)] }),
})} />
/** Declares the result card as a pure composite. */
export const meta = { shape: "composite", world: "pure" } as const
