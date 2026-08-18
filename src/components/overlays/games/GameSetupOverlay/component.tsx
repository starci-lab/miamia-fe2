import { Button } from "@/components/leaves/Button"; import { Heading } from "@/components/leaves/Heading"; import { Input } from "@/components/leaves/Input"; import { Text } from "@/components/leaves/Text"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"; import { ModalBranch } from "@/components/branches/ModalBranch"
import type { GameCharacter, GameMode } from "@/modules/games/types"

/** Finite decision step shown by the game setup overlay. */
export type GameSetupState = "mode" | "room" | "character"
/** Resolved setup copy, capability and current room-code value. */
export type GameSetupData = { readonly title: string; readonly gameTitle: string; readonly supportsTeam: boolean; readonly roomCode: string; readonly pendingMode?: GameMode }
/** All setup transitions emitted by the pure overlay. */
export type GameSetupActions = { readonly back?: () => void; readonly chooseMode?: (mode: GameMode) => void; readonly createRoom?: () => void; readonly changeCode?: (code: string) => void; readonly joinRoom?: () => void; readonly chooseCharacter?: (character: GameCharacter) => void }
/** Pure overlay input including controlled covering-surface state. */
export type GameSetupOverlayProps = { readonly isOpen: boolean; readonly state: GameSetupState; readonly props: GameSetupData; readonly on?: GameSetupActions; readonly onDismiss: () => void }

/** Render exactly one setup decision inside the shared modal shell. */
export const _GameSetupOverlay = (input: GameSetupOverlayProps) => {
    const header = defineContractComponent("page-header-stack", { title: defineLeafComponent("heading", {}, () => <Heading props={{ content: `${input.props.title} · ${input.props.gameTitle}`, level: 2 }} />) })
    // vn-ok: This overlay presents localized Vietnamese game setup copy at runtime.
    const content = input.state === "mode"
        ? defineContractComponent("game-mode-grid", { mode: [
            defineLeafComponent("button", {}, () => <Button props={{ label: "Chơi đơn", variant: "secondary" }} on={{ press: () => input.on?.chooseMode?.("SINGLE") }} />), // vn-ok: localized runtime copy
            defineLeafComponent("button", {}, () => <Button props={{ label: "Chơi cùng bạn", variant: "primary" }} on={{ press: () => input.on?.chooseMode?.("COUPLE") }} />), // vn-ok: localized runtime copy
            ...(input.props.supportsTeam ? [defineLeafComponent("button", {}, () => <Button props={{ label: "Đội 2v2", variant: "outline" }} on={{ press: () => input.on?.chooseMode?.("TEAM2V2") }} />)] : []), // vn-ok: localized runtime copy
        ] })
        : input.state === "room"
            ? defineContractComponent("game-code-join-row", {
                create: defineLeafComponent("button", {}, () => <Button props={{ label: "Tạo phòng mới", variant: "primary" }} on={{ press: input.on?.createRoom }} />), // vn-ok: localized runtime copy
                label: defineLeafComponent("text", { size: "sm", tone: "muted" }, () => <Text props={{ content: "Hoặc nhập mã phòng bạn gửi", size: "sm", tone: "muted" }} />), // vn-ok: localized runtime copy
                code: defineLeafComponent("input", {}, () => <Input props={{ id: "game-room-code", name: "roomCode", kind: "text", placeholder: "Mã phòng" }} on={{ change: input.on?.changeCode }} />), // vn-ok: localized runtime copy
                join: defineLeafComponent("button", {}, () => <Button props={{ label: "Vào phòng", variant: "outline", disabled: input.props.roomCode.trim().length === 0 }} on={{ press: input.on?.joinRoom }} />), // vn-ok: localized runtime copy
            })
            : defineContractComponent("game-character-grid", { character: [
                defineLeafComponent("button", {}, () => <Button props={{ label: "Chọn Mia", variant: "primary" }} on={{ press: () => input.on?.chooseCharacter?.("MIA") }} />), // vn-ok: localized runtime copy
                defineLeafComponent("button", {}, () => <Button props={{ label: "Chọn Max", variant: "secondary" }} on={{ press: () => input.on?.chooseCharacter?.("MAX") }} />), // vn-ok: localized runtime copy
            ] })
    return <ModalBranch
        isOpen={input.isOpen}
        size="md"
        contract="game-setup-panel"
        render={defineContractComponent("game-setup-panel", {
            header,
            ...(input.state === "mode" ? {} : { back: defineLeafComponent("button", {}, () => <Button props={{ label: "Quay lại", variant: "ghost", size: "sm" }} on={{ press: input.on?.back }} />) }), // vn-ok: localized runtime copy
            content,
        })}
        onDismiss={input.onDismiss}
    />
}
/** Declares the setup renderer as a pure game overlay. */
export const meta = { shape: "overlay", world: "pure", domain: "games" } as const
