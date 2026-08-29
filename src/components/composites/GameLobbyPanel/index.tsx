import { SurfaceCard } from "@/components/branches/SurfaceCard"; import { Button } from "@/components/leaves/Button"; import { Heading } from "@/components/leaves/Heading"; import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"
type GameLobbyPanelData = { readonly title: string; readonly roomCode?: string; readonly players: ReadonlyArray<string>; readonly copyLabel: string }
type GameLobbyPanelActions = { readonly copyCode?: () => void }
/** Draw the share code and authoritative roster while a room waits. */
// vn-ok: This composite formats localized Vietnamese room copy for display.
export const GameLobbyPanel = ({ props, on }: CompositeProps<GameLobbyPanelData, GameLobbyPanelActions>) => <SurfaceCard layout="game-lobby-card" render={layoutNode("game-lobby-card", {
    title: renderLeaf("heading", {}, () => <Heading props={{ content: props.title, level: 2 }} />),
    ...(props.roomCode === undefined ? {} : { code: renderLeaf("text", { size: "md", weight: "semibold" }, () => <Text props={{ content: `Mã phòng: ${props.roomCode}`, weight: "semibold" }} />) }), // vn-ok: localized runtime copy
    players: layoutNode("game-player-list", { player: props.players.map((player) => renderLeaf("text", { size: "sm" }, () => <Text props={{ content: player, size: "sm" }} />)) }),
    ...(props.roomCode === undefined ? {} : { action: renderLeaf("button", {}, () => <Button props={{ label: props.copyLabel, variant: "outline", size: "sm" }} on={{ press: on?.copyCode }} />) }),
})} />
/** Declares the waiting-room panel as a pure composite. */
