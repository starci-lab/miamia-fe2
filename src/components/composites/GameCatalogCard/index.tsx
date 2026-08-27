import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"; import { Button } from "@/components/leaves/Button"; import { CoverImage } from "@/components/leaves/CoverImage"; import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createLeafNode, type CompositeProps } from "@/components/contracts/props"
import type { GameMode } from "@/modules/games/types"

type GameCatalogCardData = { readonly title: string; readonly description: string; readonly cover: string; readonly modes: ReadonlyArray<GameMode>; readonly actionLabel: string }
type GameCatalogCardActions = { readonly pick?: () => void }

const modeLabel = (mode: GameMode): string => {
    if (mode === "SINGLE") return "Chơi đơn" // vn-ok: localized runtime copy
    if (mode === "COUPLE") return "Chơi cùng bạn" // vn-ok: localized runtime copy
    return "Đội 2v2" // vn-ok: localized runtime copy
}
/** Draw one legacy-backed game choice with supported modes and one setup action. */
export const GameCatalogCard = ({ props, on }: CompositeProps<GameCatalogCardData, GameCatalogCardActions>) => <SurfaceCard contract="game-card" render={createGrammarNode("game-card", {
    cover: createLeafNode("cover-image", {}, () => <CoverImage props={{ src: props.cover, alt: "", ratio: "wide" }} />),
    body: createGrammarNode("evidence-title-over-subtitle", {
        title: createLeafNode("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.title, size: "sm", weight: "semibold" }} />),
        subtitle: createLeafNode("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.description, size: "xs", tone: "muted" }} />),
    }),
    modes: createGrammarNode("game-card-actions", { mode: props.modes.map((mode) => createLeafNode("badge", {}, () => <Badge props={{ content: modeLabel(mode), tone: mode === "SINGLE" ? "neutral" : "accent" }} />)) }),
    action: createLeafNode("button", {}, () => <Button props={{ label: props.actionLabel, variant: "primary", icon: "next", iconPlacement: "trailing" }} on={{ press: on?.pick }} />),
})} />
/** Declares the game catalog card as a pure composite. */
export const meta = { shape: "composite", world: "pure" } as const
