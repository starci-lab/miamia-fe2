import { beforeEach, describe, expect, it, vi } from "vitest"
import type { GameSnapshot } from "@/modules/games/types"

const mocks = vi.hoisted(() => ({
    spritesheet: vi.fn(),
    setBackgroundColor: vi.fn(),
    animations: new Set<string>(),
    animationCreate: vi.fn(),
    generateFrameNumbers: vi.fn(() => []),
    tween: vi.fn(),
    ready: vi.fn(),
    answer: vi.fn(),
    position: vi.fn(),
    decorate: vi.fn(),
    pointerHandlers: [] as Array<() => void>,
}))

vi.mock("phaser", () => ({ Scene: class { public constructor(public readonly key?: string) {} } }))

import { BaseGameScene, GAME_HEIGHT, GAME_WIDTH } from "./BaseGameScene"

type FakeDisplay = {
    readonly list?: ReadonlyArray<FakeDisplay>
    readonly anims?: { currentAnim?: { key: string } }
    setStrokeStyle: () => FakeDisplay
    setInteractive: () => FakeDisplay
    on: (event: string, callback: () => void) => FakeDisplay
    setOrigin: () => FakeDisplay
    setWordWrapWidth: () => FakeDisplay
    setScale: () => FakeDisplay
    setFlipX: () => FakeDisplay
    play: (key: string) => FakeDisplay
    setText: (value: string) => FakeDisplay
    setVisible: (value: boolean) => FakeDisplay
}
type AnimationConfig = { readonly key: string }

const display = (list?: ReadonlyArray<FakeDisplay>): FakeDisplay => {
    const value: FakeDisplay = {
        list,
        anims: {},
        setStrokeStyle: () => value,
        setInteractive: () => value,
        on: (_event, callback) => { mocks.pointerHandlers.push(callback); return value },
        setOrigin: () => value,
        setWordWrapWidth: () => value,
        setScale: () => value,
        setFlipX: () => value,
        play: (key) => { value.anims!.currentAnim = { key }; return value },
        setText: vi.fn(() => value),
        setVisible: vi.fn(() => value),
    }
    return value
}

class TestScene extends BaseGameScene {
    public constructor() { super("test", "MATCH_PAIRS") }
    protected override decorate(): void { mocks.decorate() }
    protected override positionPlayers(snapshot: GameSnapshot): void { mocks.position(snapshot) }
}

const snapshot = (phase: GameSnapshot["phase"], winner = ""): GameSnapshot => ({
    phase, gameType: "MATCH_PAIRS", mode: "COUPLE", remainingMs: -100, round: 3, question: "Choose", options: ["A", "B"],
    players: [{ id: "mia", name: "Mia", character: "MIA", team: "A", score: 12, combo: 1, hp: 3, progress: 1, action: "ATTACK", bot: false }], winner, roomCode: "room",
})

describe("BaseGameScene", () => {
    beforeEach(() => {
        vi.clearAllMocks(); mocks.animations.clear(); mocks.pointerHandlers.length = 0
        mocks.animationCreate.mockReset(); mocks.generateFrameNumbers.mockReturnValue([])
    })

    it("loads the complete sprite sheet set and builds the game canvas", () => {
        const scene = new TestScene()
        scene.load = { spritesheet: mocks.spritesheet } as never
        scene.cameras = { main: { setBackgroundColor: mocks.setBackgroundColor } } as never
        scene.anims = {
            exists: (key: string) => mocks.animations.has(key),
            create: (config: AnimationConfig) => { mocks.animations.add(config.key); mocks.animationCreate(config); return undefined },
            generateFrameNumbers: mocks.generateFrameNumbers,
        } as never
        scene.tweens = { add: mocks.tween } as never
        scene.add = {
            rectangle: vi.fn(() => display()),
            text: vi.fn(() => display()),
            container: vi.fn((_x: number, _y: number, children: ReadonlyArray<FakeDisplay>) => display(children)),
            sprite: vi.fn(() => display()),
        } as never
        scene.setAnswer(mocks.answer); scene.setReady(mocks.ready)
        scene.preload(); scene.create()
        expect(mocks.spritesheet).toHaveBeenCalledTimes(14)
        expect(mocks.setBackgroundColor).toHaveBeenCalledWith("#fff3f8")
        expect(mocks.animationCreate).toHaveBeenCalledTimes(14)
        expect(mocks.ready).toHaveBeenCalledOnce()
        expect(GAME_WIDTH).toBe(1280); expect(GAME_HEIGHT).toBe(720)
        mocks.pointerHandlers[0]?.(); expect(mocks.answer).toHaveBeenCalledWith(0); expect(mocks.tween).toHaveBeenCalledOnce()
    })

    it("applies scores, options, player animations and finish outcomes", () => {
        const scene = new TestScene()
        scene.cameras = { main: { setBackgroundColor: vi.fn() } } as never
        const textDisplays: Array<FakeDisplay> = []
        scene.anims = { exists: () => true, create: vi.fn(), generateFrameNumbers: vi.fn(() => []) } as never
        scene.add = {
            rectangle: vi.fn(() => display()),
            text: vi.fn(() => { const value = display(); textDisplays.push(value); return value }),
            container: vi.fn((_x: number, _y: number, children: ReadonlyArray<FakeDisplay>) => display(children)),
            sprite: vi.fn(() => display()),
        } as never
        scene.load = { spritesheet: vi.fn() } as never; scene.tweens = { add: vi.fn() } as never
        scene.create()
        scene.applySnapshot(snapshot("PLAYING")); scene.applyAnswerResult({ correct: true, character: "MIA" }); scene.applyAnswerResult({ correct: false, character: "MAX" })
        scene.applySnapshot(snapshot("FINISHED", "MIA")); scene.applySnapshot(snapshot("FINISHED", "MAX"))
        expect(textDisplays.some((value) => vi.mocked(value.setText).mock.calls.some(([text]) => text === "0.0s"))).toBe(true)
        expect(mocks.position).toHaveBeenCalled()
    })
})
