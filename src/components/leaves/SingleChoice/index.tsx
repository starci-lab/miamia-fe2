"use client"

import { Radio, RadioGroup } from "@heroui/react"
import type { LeafProps } from "@/components/contracts/props"

/** Describes one answer option in a single-choice question. */
export type SingleChoiceOptionData = {
    readonly id: string
    readonly label: string
    readonly disabled?: boolean
    readonly verdict?: "neutral" | "correct" | "incorrect"
}

/** Holds the question content and answer options. */
export type SingleChoiceData = {
    readonly label: string
    readonly name: string
    readonly options: ReadonlyArray<SingleChoiceOptionData>
    readonly selectedKey?: string
    readonly disabled?: boolean
    readonly readOnly?: boolean
}

/** Defines answer-selection behavior. */
export type SingleChoiceActions = { readonly select?: (id: string) => void }
/** Defines the pure single-choice leaf contract. */
export type SingleChoiceProps = LeafProps<SingleChoiceData, SingleChoiceActions>

/** Renders a single-choice question and its answer options. */
export const SingleChoice = ({ props, on }: SingleChoiceProps) => (
    <RadioGroup
        aria-label={props.label}
        value={props.selectedKey ?? null}
        onChange={(value) => on?.select?.(String(value))}
        isDisabled={props.disabled === true}
        isReadOnly={props.readOnly === true}
        data-tier="leaf"
        data-component="SingleChoice"
    >
        {props.options.map((option) => (
            <Radio key={option.id} name={props.name} value={option.id} isDisabled={option.disabled === true}>
                <Radio.Control data-verdict={option.verdict ?? "neutral"}>
                    <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>{option.label}</Radio.Content>
            </Radio>
        ))}
    </RadioGroup>
)

/** Declares the component architecture metadata. */
export const meta = { shape: "leaf", world: "pure" } as const
