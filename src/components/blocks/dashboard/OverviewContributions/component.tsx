import { SurfaceCard } from "@/components/branches/SurfaceCard"
import {
    ContributionCalendar,
    type ContributionCalendarDay,
} from "@/components/composites/ContributionCalendar"
import { createCompositeNode, createGrammarNode } from "@/components/contracts/props"

/** One calendar day with its already-resolved accessible label. */
export type ContributionDay = ContributionCalendarDay

/** Resolved yearly activity and streak copy drawn by the block. */
export type OverviewContributionsData = {
    readonly label: string
    readonly year: number
    readonly years: ReadonlyArray<number>
    readonly yearLabel: string
    readonly streakLabel: string
    readonly lessLabel: string
    readonly moreLabel: string
    readonly emptyMessage: string
    readonly errorMessage: string
    readonly monthLabels?: ReadonlyArray<string>
    readonly weekdayLabels?: ReadonlyArray<string>
    readonly days?: ReadonlyArray<ContributionDay>
}

/** Product decisions reported by the pure contribution block. */
export type OverviewContributionsActions = {
    readonly selectYear?: (year: number) => void
}

/** State and data accepted by the pure contribution block. */
export type OverviewContributionsProps = {
    readonly state: "pending" | "empty" | "failed" | "ready"
    readonly props: OverviewContributionsData
    readonly on?: OverviewContributionsActions
}

/** Pick the headline label for the current load state: error beats empty beats the year total. */
const resolveTotalLabel = (input: OverviewContributionsProps) => {
    if (input.state === "failed") return input.props.errorMessage
    if (input.state === "empty") return input.props.emptyMessage
    return input.props.yearLabel
}

/** Draw the complete contribution calendar without owning its query or selected-year state. */
export const OverviewContributionsBase = (input: OverviewContributionsProps) => {
    const isLoading = input.state === "pending"
    const totalLabel = resolveTotalLabel(input)

    return (
        <SurfaceCard
            props={{ label: input.props.label }}
            contract="contribution-calendar-card"
            render={createGrammarNode("contribution-calendar-card", {
                calendar: createCompositeNode("contribution-calendar", {}, () => (
                    <ContributionCalendar
                        props={{
                            year: input.props.year,
                            years: input.props.years,
                            totalLabel,
                            streakLabel: input.props.streakLabel,
                            lessLabel: input.props.lessLabel,
                            moreLabel: input.props.moreLabel,
                            monthLabels: input.props.monthLabels,
                            weekdayLabels: input.props.weekdayLabels,
                            days: input.state === "ready" ? input.props.days : [],
                        }}
                        on={{ selectYear: input.on?.selectYear }}
                        isLoading={isLoading}
                    />
                )),
            })}
            isLoading={isLoading}
        />
    )
}

/** Source-level tier marker for the pure dashboard block. */
export const meta = { world: "pure", domain: "dashboard" } as const
