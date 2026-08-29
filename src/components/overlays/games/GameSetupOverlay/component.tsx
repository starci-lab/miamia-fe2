import { Button } from "@/components/leaves/Button"; import { Heading } from "@/components/leaves/Heading"; import { Input } from "@/components/leaves/Input"; import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf } from "@/modules/types/layout"; import { ModalBranch } from "@/components/branches/ModalBranch"
import type { GameCharacter, GameMode } from "@/modules/games/types"

/** Finite decision step shown by the game setup overlay. */
export type GameSetupState = "mode" | "room" | "character"
/** Resolved setup copy, capability and current room-code value. */
export type GameSetupData = { readonly title: string; readonly gameTitle: string; readonly supportsTeam: boolean; readonly roomCode: string; readonly pendingMode?: GameMode }
/** All setup transitions emitted by the pure overlay. */
export type GameSetupActions = { readonly back?: () => void; readonly chooseMode?: (mode: GameMode) => void; readonly createRoom?: () => void; readonly changeCode?: (code: string) => void; readonly joinRoom?: () => void; readonly chooseCharacter?: (character: GameCharacter) => void }
/** Pure overlay input including controlled covering-surface state. */
export type GameSetupOverlayProps = { readonly isOpen: boolean; readonly state: GameSetupState; readonly props: GameSetupData; readonly on?: GameSetupActions; readonly onDismiss: () => void }

// vn-ok: This overlay presents localized Vietnamese game setup copy at runtime.
/** Resolve the one setup-step body shown for the overlay's current decision state. */
const resolveGameSetupContent = (input: GameSetupOverlayProps) => {
    if (input.state === "mode") {
        return layoutNode("game-mode-grid", { mode: [
            renderLeaf("button", {}, () => <Button props={{ label: "Chơi đơn", variant: "secondary" }} on={{ press: () => input.on?.chooseMode?.("SINGLE") }} />), // vn-ok: localized runtime copy
            renderLeaf("button", {}, () => <Button props={{ label: "Chơi cùng bạn", variant: "primary" }} on={{ press: () => input.on?.chooseMode?.("COUPLE") }} />), // vn-ok: localized runtime copy
            ...(input.props.supportsTeam ? [renderLeaf("button", {}, () => <Button props={{ label: "Đội 2v2", variant: "outline" }} on={{ press: () => input.on?.chooseMode?.("TEAM2V2") }} />)] : []), // vn-ok: localized runtime copy
        ] })
    }
    if (input.state === "room") {
        return layoutNode("game-code-join-row", {
            create: renderLeaf("button", {}, () => <Button props={{ label: "Tạo phòng mới", variant: "primary" }} on={{ press: input.on?.createRoom }} />), // vn-ok: localized runtime copy
            label: renderLeaf("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: "Hoặc nhập mã phòng bạn gửi", size: "sm", tone: "muted" }} />), // vn-ok: localized runtime copy
            code: renderLeaf("input", {}, () => <Input props={{ id: "game-room-code", name: "roomCode", kind: "text", placeholder: "Mã phòng" }} on={{ change: input.on?.changeCode }} />), // vn-ok: localized runtime copy
            join: renderLeaf("button", {}, () => <Button props={{ label: "Vào phòng", variant: "outline", disabled: input.props.roomCode.trim().length === 0 }} on={{ press: input.on?.joinRoom }} />), // vn-ok: localized runtime copy
        })
    }
    return layoutNode("game-character-grid", { character: [
        renderLeaf("button", {}, () => <Button props={{ label: "Chọn Mia", variant: "primary" }} on={{ press: () => input.on?.chooseCharacter?.("MIA") }} />), // vn-ok: localized runtime copy
        renderLeaf("button", {}, () => <Button props={{ label: "Chọn Max", variant: "secondary" }} on={{ press: () => input.on?.chooseCharacter?.("MAX") }} />), // vn-ok: localized runtime copy
    ] })
}

/** Render exactly one setup decision inside the shared modal shell. */
export const GameSetupOverlayBase = (input: GameSetupOverlayProps) => {
    const header = layoutNode("page-header-stack", { title: renderLeaf("heading", {}, () => <Heading props={{ content: `${input.props.title} · ${input.props.gameTitle}`, level: 2 }} />) })
    const content = resolveGameSetupContent(input)
    return <ModalBranch
        isOpen={input.isOpen}
        size="md"
        layout="game-setup-panel"
        render={layoutNode("game-setup-panel", {
            header,
            ...(input.state === "mode" ? {} : { back: renderLeaf("button", {}, () => <Button props={{ label: "Quay lại", variant: "ghost", size: "sm" }} on={{ press: input.on?.back }} />) }), // vn-ok: localized runtime copy
            content,
        })}
        onDismiss={input.onDismiss}
    />
}
/** Declares the setup renderer as a pure game overlay. */
