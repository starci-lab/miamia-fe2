"use client"
import { CLASS_NAME_1 } from "./classNames"

import { useEffect, useRef } from "react"
import type * as Phaser from "phaser"
import type { GameAnswerResult, GameCharacter, GameSnapshot, GameType } from "@/modules/games/types"
import type { ComponentProps } from "@/modules/types/layout"

/** Snapshot data forwarded into one browser-only Phaser scene. */
export type GameCanvasData = { readonly gameType: GameType; readonly character: GameCharacter; readonly snapshot?: GameSnapshot; readonly answerResult?: GameAnswerResult }
/** User answer action emitted from the Phaser scene. */
export type GameCanvasActions = { readonly answer?: (index: number) => void }
/** Fixed public input of the browser-only Phaser canvas. */
export type GameCanvasProps = ComponentProps<GameCanvasData, GameCanvasActions>

/** Mounts Phaser only in the browser and forwards server-authoritative state to its scene. */
export const GameCanvas = ({ props, on }: GameCanvasProps) => {
    const host = useRef<HTMLDivElement>(null); const scene = useRef<import("@/modules/games/phaser/scenes/BaseGameScene").BaseGameScene | undefined>(undefined)
    const answer = useRef(on?.answer); answer.current = on?.answer
    const snapshot = useRef(props.snapshot); snapshot.current = props.snapshot
    const answerResult = useRef(props.answerResult); answerResult.current = props.answerResult

    useEffect(() => {
        let disposed = false; let game: Phaser.Game | undefined
        void Promise.all([
            import("phaser"), import("@/modules/games/phaser/scenes/VocabRaceScene"), import("@/modules/games/phaser/scenes/MatchPairsScene"),
            import("@/modules/games/phaser/scenes/CoupleQuizScene"), import("@/modules/games/phaser/scenes/VocabDefenseScene"),
        ]).then(([phaser, race, pairs, quiz, defense]) => {
            if (disposed || host.current === null) return
            let Scene: new () => import("@/modules/games/phaser/scenes/BaseGameScene").BaseGameScene = defense.VocabDefenseScene
            if (props.gameType === "VOCAB_RACE") Scene = race.VocabRaceScene
            else if (props.gameType === "MATCH_PAIRS") Scene = pairs.MatchPairsScene
            else if (props.gameType === "COUPLE_QUIZ") Scene = quiz.CoupleQuizScene
            const active = new Scene(); active.setAnswer((index) => answer.current?.(index)); scene.current = active
            active.setReady(() => {
                if (snapshot.current !== undefined) active.applySnapshot(snapshot.current)
                if (answerResult.current !== undefined) active.applyAnswerResult(answerResult.current)
            })
            game = new phaser.Game({ type: phaser.AUTO, width: 1280, height: 720, parent: host.current, backgroundColor: "transparent", scene: active, scale: { mode: phaser.Scale.FIT, autoCenter: phaser.Scale.CENTER_BOTH } })
        })
        return () => { disposed = true; scene.current = undefined; game?.destroy(true) }
    }, [props.gameType])

    useEffect(() => { if (props.snapshot !== undefined && scene.current?.scene.isActive()) scene.current.applySnapshot(props.snapshot) }, [props.snapshot])
    useEffect(() => { if (props.answerResult !== undefined && scene.current?.scene.isActive()) scene.current.applyAnswerResult(props.answerResult) }, [props.answerResult])
    // vn-ok: The accessible label is localized Vietnamese runtime copy.
    return <div ref={host} data-component="GameCanvas" className={CLASS_NAME_1} aria-label={`Màn chơi ${props.character}`} />
}

/** Declares the Phaser canvas as a pure leaf. */
