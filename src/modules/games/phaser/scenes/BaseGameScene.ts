import * as Phaser from "phaser"
import type { GameAnswerResult, GameSnapshot, GameType } from "@/modules/games/types"

/** Intrinsic game width shared by every scene. */
export const GAME_WIDTH = 1280
/** Intrinsic game height shared by every scene. */
export const GAME_HEIGHT = 720
const ACTIONS = ["idle", "run", "attack", "shield", "think", "hurt", "celebrate"] as const

/** Browser-only Phaser base. React pushes authoritative snapshots into it. */
export abstract class BaseGameScene extends Phaser.Scene {
    private answer!: (index: number) => void
    private ready?: () => void
    private timer?: Phaser.GameObjects.Text; private score?: Phaser.GameObjects.Text; private round?: Phaser.GameObjects.Text
    private question?: Phaser.GameObjects.Text; private cards: ReadonlyArray<Phaser.GameObjects.Container> = []
    protected mia?: Phaser.GameObjects.Sprite; protected max?: Phaser.GameObjects.Sprite
    protected readonly gameType: GameType

    constructor(key: string, gameType: GameType) { super(key); this.gameType = gameType }
    public setAnswer(action: (index: number) => void): void { this.answer = action }
    public setReady(action: () => void): void { this.ready = action }
    preload(): void {
        for (const character of ["mia", "max"] as const) for (const action of ACTIONS) {
            this.load.spritesheet(`${character}-${action}`, `/game-assets/sprites/${character}/${action}.png`, { frameWidth: 256, frameHeight: 256 })
        }
    }
    create(): void {
        this.paintBackground(); this.buildAnimations(); this.decorate()
        this.round = this.add.text(40, 30, "", this.style(24, "#76536c"))
        this.timer = this.add.text(GAME_WIDTH - 40, 30, "", this.style(28, "#d5287a")).setOrigin(1, 0)
        this.score = this.add.text(GAME_WIDTH / 2, 34, "Mia 0 — 0 Max", this.style(26, "#241b25")).setOrigin(0.5, 0)
        this.question = this.add.text(GAME_WIDTH / 2, 150, "", { ...this.style(34, "#241b25"), backgroundColor: "#fffdf9", padding: { x: 28, y: 16 }, align: "center", wordWrap: { width: 760 } }).setOrigin(0.5)
        this.cards = [[400, 300], [880, 300], [400, 392], [880, 392]].map(([x, y], index) => {
            const ground = this.add.rectangle(0, 0, 400, 68, index % 2 === 0 ? 0xffc0dc : 0x9fe7d2).setStrokeStyle(3, 0x241b25).setInteractive({ useHandCursor: true })
            const label = this.add.text(0, 0, "", this.style(21, "#241b25")).setOrigin(0.5).setWordWrapWidth(350)
            const card = this.add.container(x, y, [ground, label])
            ground.on("pointerdown", () => { this.answer(index); this.tweens.add({ targets: card, scale: 0.96, yoyo: true, duration: 90 }) })
            return card
        })
        this.mia = this.add.sprite(320, 650, "mia-idle").setScale(0.82).setOrigin(0.5, 1).play("mia-idle")
        this.max = this.add.sprite(960, 650, "max-idle").setScale(0.82).setOrigin(0.5, 1).setFlipX(true).play("max-idle")
        this.ready?.()
    }
    public applySnapshot(snapshot: GameSnapshot): void {
        // vn-ok: The current game canvas renders Vietnamese round copy as localized runtime output.
        this.timer?.setText(`${(Math.max(0, snapshot.remainingMs) / 1000).toFixed(1)}s`); this.round?.setText(`Vòng ${snapshot.round}`); this.question?.setText(snapshot.question)
        this.cards.forEach((card, index) => { const value = snapshot.options[index]; card.setVisible(value !== undefined); (card.list[1] as Phaser.GameObjects.Text | undefined)?.setText(value ?? "") })
        const mia = snapshot.players.find((player) => player.character === "MIA"); const max = snapshot.players.find((player) => player.character === "MAX")
        this.score?.setText(`Mia ${mia?.score ?? 0} — ${max?.score ?? 0} Max`)
        this.sync(this.mia, mia?.action, "mia"); this.sync(this.max, max?.action, "max"); this.positionPlayers(snapshot)
        if (snapshot.phase === "FINISHED") this.finish(snapshot.winner)
    }
    public applyAnswerResult(result: GameAnswerResult): void { this.sync(result.character === "MIA" ? this.mia : this.max, result.correct ? "ATTACK" : "HURT", result.character.toLowerCase()) }
    protected paintBackground(): void { this.cameras.main.setBackgroundColor("#fff3f8"); this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 70, GAME_WIDTH, 200, 0xf3d9ea, 0.7) }
    protected decorate(): void { /* game-specific decoration */ }
    protected positionPlayers(snapshot: GameSnapshot): void { void snapshot }
    protected style(size: number, color: string): Phaser.Types.GameObjects.Text.TextStyle { return { fontFamily: "system-ui, sans-serif", fontSize: `${size}px`, fontStyle: "bold", color } }
    private buildAnimations(): void { for (const character of ["mia", "max"] as const) for (const action of ACTIONS) { const key = `${character}-${action}`; if (!this.anims.exists(key)) this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 5 }), frameRate: action === "idle" || action === "think" ? 6 : 10, repeat: action === "idle" || action === "run" || action === "think" ? -1 : 0 }) } }
    private sync(sprite: Phaser.GameObjects.Sprite | undefined, action: string | undefined, character: string): void { const key = `${character}-${(action ?? "IDLE").toLowerCase()}`; if (sprite !== undefined && this.anims.exists(key) && sprite.anims.currentAnim?.key !== key) sprite.play(key, true) }
    private finish(winner: string): void { if (winner === "MIA") this.sync(this.mia, "CELEBRATE", "mia"); if (winner === "MAX") this.sync(this.max, "CELEBRATE", "max") }
}
