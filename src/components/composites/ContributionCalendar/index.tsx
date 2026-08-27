import { Grammar } from "@/components/branches/Grammar"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { ContributionGrid } from "@/components/leaves/ContributionGrid"
import { ContributionIntensityLegend } from "@/components/leaves/ContributionIntensityLegend"
import { Text } from "@/components/leaves/Text"
import {
    createGrammarNode,
    createLeafNode,
    type CompositeProps,
} from "@/components/contracts/props"

/** One contribution day with an accessible, already-resolved description. */
export type ContributionCalendarDay = {
    readonly date: string
    readonly count: number
    readonly label: string
}

/** Resolved labels and values for one yearly activity calendar. */
export type ContributionCalendarData = {
    readonly year: number
    readonly years: ReadonlyArray<number>
    readonly totalLabel?: string
    readonly streakLabel?: string
    readonly lessLabel?: string
    readonly moreLabel?: string
    readonly monthLabels?: ReadonlyArray<string>
    readonly weekdayLabels?: ReadonlyArray<string>
    readonly days?: ReadonlyArray<ContributionCalendarDay>
}

/** What changing the contribution year reports. */
export type ContributionCalendarActions = {
    readonly selectYear?: (year: number) => void
}

/** Props for the closed contribution-calendar composition. */
export type ContributionCalendarProps = CompositeProps<ContributionCalendarData, ContributionCalendarActions>

/** Draw the fixed year summary, intrinsic plot and its reading key. */
export const ContributionCalendar = ({ props, on, isLoading = false }: ContributionCalendarProps) => {
    const heading = createGrammarNode("contribution-calendar-heading-row", {
        total: createLeafNode("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: props.totalLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
        )),
        years: createLeafNode("choice-tabs", {}, () => (
            <ChoiceTabs
                props={{
                    label: props.totalLabel ?? "",
                    selectedKey: String(props.year),
                    tabs: props.years.map((year) => ({ id: String(year), label: String(year) })),
                }}
                on={{ select: (key) => on?.selectYear?.(Number(key)) }}
            />
        )),
    })
    const footer = createGrammarNode("contribution-calendar-footer-row", {
        streak: createLeafNode("text", { size: "sm" }, () => (
            <Text props={{ content: props.streakLabel, size: "sm" }} isLoading={isLoading} />
        )),
        intensity: createLeafNode("contribution-intensity-legend", {}, () => (
            <ContributionIntensityLegend
                props={{ lessLabel: props.lessLabel, moreLabel: props.moreLabel }}
                isLoading={isLoading}
            />
        )),
    })
    const content = createGrammarNode("contribution-calendar-stack", {
        heading,
        grid: createLeafNode("contribution-grid", {}, () => (
            <ContributionGrid
                props={{
                    year: props.year,
                    monthLabels: props.monthLabels ?? [],
                    weekdayLabels: props.weekdayLabels ?? [],
                    days: props.days ?? [],
                }}
                isLoading={isLoading}
            />
        )),
        footer,
    })

    return <Grammar contract="contribution-calendar-stack" render={content} />
}

/** Source-level tier marker for the fixed contribution calendar composition. */
export const meta = { shape: "composite", world: "pure" } as const
