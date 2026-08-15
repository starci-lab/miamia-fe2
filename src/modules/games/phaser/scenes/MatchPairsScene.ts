import { BaseGameScene, GAME_HEIGHT, GAME_WIDTH } from "./BaseGameScene"
/** Present the shared prompt-and-option play field for Match Pairs. */
export class MatchPairsScene extends BaseGameScene { constructor() { super("match-pairs", "MATCH_PAIRS") } protected paintBackground(): void { this.cameras.main.setBackgroundColor("#fff6ec"); this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, GAME_WIDTH, 200, 0xfae3cb) } }
