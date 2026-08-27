import { SurfaceCard } from "@/components/branches/SurfaceCard"; import { Button } from "@/components/leaves/Button"; import { Heading } from "@/components/leaves/Heading"; import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"
type GameLobbyPanelData = { readonly title: string; readonly roomCode?: string; readonly players: ReadonlyArray<string>; readonly copyLabel: string }
type GameLobbyPanelActions = { readonly copyCode?: () => void }
/** Draw the share code and authoritative roster while a room waits. */
// vn-ok: This composite formats localized Vietnamese room copy for display.
export const GameLobbyPanel = ({ props, on }: CompositeProps<GameLobbyPanelData, GameLobbyPanelActions>) => <SurfaceCard contract="game-lobby-card" render={createGrammarNode("game-lobby-card", {
    title: createLeafNode("heading", {}, () => <Heading props={{ content: props.title, level: 2 }} />),
    ...(props.roomCode === undefined ? {} : { code: createLeafNode("text", { size: "md", weight: "semibold" }, () => <Text props={{ content: `Mã phòng: ${props.roomCode}`, weight: "semibold" }} />) }), // vn-ok: localized runtime copy
    players: createGrammarNode("game-player-list", { player: props.players.map((player) => createLeafNode("text", { size: "sm" }, () => <Text props={{ content: player, size: "sm" }} />)) }),
    ...(props.roomCode === undefined ? {} : { action: createLeafNode("button", {}, () => <Button props={{ label: props.copyLabel, variant: "outline", size: "sm" }} on={{ press: on?.copyCode }} />) }),
})} />
/** Declares the waiting-room panel as a pure composite. */
export const meta = { shape: "composite", world: "pure" } as const
