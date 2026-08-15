import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"; import { Button } from "@/components/leaves/Button"; import { CoverImage } from "@/components/leaves/CoverImage"; import { Text } from "@/components/leaves/Text"
import { defineContractComponent, defineLeafComponent, type CompositeProps } from "@/components/contracts/props"
import type { GameMode } from "@/modules/games/types"

type GameCatalogCardData = { readonly title: string; readonly description: string; readonly cover: string; readonly modes: ReadonlyArray<GameMode>; readonly actionLabel: string }
type GameCatalogCardActions = { readonly pick?: () => void }
/** Draw one legacy-backed game choice with supported modes and one setup action. */
export const GameCatalogCard = ({ props, on }: CompositeProps<GameCatalogCardData, GameCatalogCardActions>) => <SurfaceCard contract="game-card" render={defineContractComponent("game-card", {
    cover: defineLeafComponent("cover-image", {}, () => <CoverImage props={{ src: props.cover, alt: "", ratio: "wide" }} />),
    body: defineContractComponent("evidence-title-over-subtitle", {
        title: defineLeafComponent("text", { size: "sm", weight: "semibold" }, () => <Text props={{ content: props.title, size: "sm", weight: "semibold" }} />),
        subtitle: defineLeafComponent("text", { size: "xs", tone: "muted" }, () => <Text props={{ content: props.description, size: "xs", tone: "muted" }} />),
    }),
    modes: defineContractComponent("game-card-actions", { mode: props.modes.map((mode) => defineLeafComponent("badge", {}, () => <Badge props={{ content: mode === "SINGLE" ? "Chơi đơn" : mode === "COUPLE" ? "Chơi cùng bạn" : "Đội 2v2", tone: mode === "SINGLE" ? "neutral" : "accent" }} />)) }), // vn-ok: localized runtime copy
    action: defineLeafComponent("button", {}, () => <Button props={{ label: props.actionLabel, variant: "primary", icon: "next", iconPlacement: "trailing" }} on={{ press: on?.pick }} />),
})} />
/** Declares the game catalog card as a pure composite. */
export const meta = { shape: "composite", world: "pure" } as const
