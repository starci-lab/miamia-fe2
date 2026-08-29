import { Grammar } from "@/components/layouts/Grammar"
import { ChoiceTabs } from "@/components/leaves/ChoiceTabs"
import { ContributionGrid } from "@/components/leaves/ContributionGrid"
import { ContributionIntensityLegend } from "@/components/leaves/ContributionIntensityLegend"
import { Text } from "@/components/leaves/Text"
import {
    layoutNode,
    renderLeaf,
    type CompositeProps,
} from "@/modules/types/layout"

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
    const heading = layoutNode("contribution-calendar-heading-row", {
        total: renderLeaf("text", { size: "xs", tone: "muted" }, () => (
            <Text props={{ content: props.totalLabel, size: "xs", tone: "muted" }} isLoading={isLoading} />
        )),
        years: renderLeaf("choice-tabs", {}, () => (
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
    const footer = layoutNode("contribution-calendar-footer-row", {
        streak: renderLeaf("text", { size: "sm" }, () => (
            <Text props={{ content: props.streakLabel, size: "sm" }} isLoading={isLoading} />
        )),
        intensity: renderLeaf("contribution-intensity-legend", {}, () => (
            <ContributionIntensityLegend
                props={{ lessLabel: props.lessLabel, moreLabel: props.moreLabel }}
                isLoading={isLoading}
            />
        )),
    })
    const content = layoutNode("contribution-calendar-stack", {
        heading,
        grid: renderLeaf("contribution-grid", {}, () => (
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

    return <Grammar layout="contribution-calendar-stack" render={content} />
}

/** Source-level tier marker for the fixed contribution calendar composition. */
