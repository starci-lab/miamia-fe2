import type { GameSnapshot } from "@/modules/games/types"
import { BaseGameScene, GAME_HEIGHT, GAME_WIDTH } from "./BaseGameScene"
/** Move both mascot sprites along a server-controlled vocabulary race track. */
export class VocabRaceScene extends BaseGameScene {
    constructor() { super("vocab-race", "VOCAB_RACE") }
    protected paintBackground(): void { this.cameras.main.setBackgroundColor("#eaf7ff"); this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 110, GAME_WIDTH, 220, 0xcdeafc) }
    protected positionPlayers(snapshot: GameSnapshot): void { const track = GAME_WIDTH - 480; const mia = snapshot.players.find((p) => p.character === "MIA"); const max = snapshot.players.find((p) => p.character === "MAX"); if (this.mia && mia) this.mia.x = 220 + Math.min(100, mia.progress) / 100 * track; if (this.max && max) this.max.x = 220 + Math.min(100, max.progress) / 100 * track }
}
