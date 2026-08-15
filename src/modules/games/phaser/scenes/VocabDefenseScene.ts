import { BaseGameScene, GAME_HEIGHT, GAME_WIDTH } from "./BaseGameScene"
/** Render the dark defensive arena around server-owned health and answers. */
export class VocabDefenseScene extends BaseGameScene { constructor() { super("vocab-defense", "VOCAB_DEFENSE") } protected paintBackground(): void { this.cameras.main.setBackgroundColor("#1e1330"); this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, GAME_WIDTH, 200, 0x2c1c46); this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 158, GAME_WIDTH, 6, 0xffb6d7, 0.5) } }
