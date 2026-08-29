import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"; import { Button } from "@/components/leaves/Button"; import { CoverImage } from "@/components/leaves/CoverImage"; import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type CompositeProps } from "@/modules/types/layout"
import type { GameMode } from "@/modules/games/types"

type GameCatalogCardData = { readonly title: string; readonly description: string; readonly cover: string; readonly modes: ReadonlyArray<GameMode>; readonly actionLabel: string }
type GameCatalogCardActions = { readonly pick?: () => void }

const modeLabel = (mode: GameMode): string => {
    if (mode === "SINGLE") return "Chơi đơn" // vn-ok: localized runtime copy
    if (mode === "COUPLE") return "Chơi cùng bạn" // vn-ok: localized runtime copy
    return "Đội 2v2" // vn-ok: localized runtime copy
}
/** Draw one legacy-backed game choice with supported modes and one setup action. */
export const GameCatalogCard = ({ props, on }: CompositeProps<GameCatalogCardData, GameCatalogCardActions>) => <SurfaceCard layout="game-card" render={layoutNode("game-card", {
    cover: renderLeaf("cover-image", {}, () => <CoverImage props={{ src: props.cover, alt: "", ratio: "wide" }} />),
    body: layoutNode("evidence-title-over-subtitle", {
        title: renderLeaf("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.title, size: "sm", weight: "semibold" }} />),
        subtitle: renderLeaf("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.description, size: "xs", tone: "muted" }} />),
    }),
    modes: layoutNode("game-card-actions", { mode: props.modes.map((mode) => renderLeaf("badge", {}, () => <Badge props={{ content: modeLabel(mode), tone: mode === "SINGLE" ? "neutral" : "accent" }} />)) }),
    action: renderLeaf("button", {}, () => <Button props={{ label: props.actionLabel, variant: "primary", icon: "next", iconPlacement: "trailing" }} on={{ press: on?.pick }} />),
})} />
/** Declares the game catalog card as a pure composite. */
