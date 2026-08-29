import { CLASS_NAME_1 } from "./classNames"
import type { ComponentProps } from "@/modules/types/layout"

/** Resolved copy around the fixed five-step contribution scale. */
export type ContributionIntensityLegendData = {
    readonly lessLabel?: string
    readonly moreLabel?: string
}

/** Props for the intrinsic contribution intensity key. */
export type ContributionIntensityLegendProps = ComponentProps<ContributionIntensityLegendData>

const LEVEL_CLASSES = [
    "size-3 rounded-sm bg-default",
    "size-3 rounded-sm bg-accent/20",
    "size-3 rounded-sm bg-accent/40",
    "size-3 rounded-sm bg-accent/60",
    "size-3 rounded-sm bg-accent",
] as const

/** Draw the conventional less-to-more key as one intrinsic legend. */
export const ContributionIntensityLegend = ({ props, isLoading = false }: ContributionIntensityLegendProps) => (
    <span className={CLASS_NAME_1} data-part="intensity-legend">
        <span className={isLoading ? "h-3 w-6 animate-pulse rounded bg-default" : "text-xs text-muted"}>{isLoading ? "" : props.lessLabel}</span>
        {LEVEL_CLASSES.map((className, index) => (
            <span key={className} data-level={index} aria-hidden="true" className={isLoading ? "size-3 animate-pulse rounded-sm bg-default" : className} />
        ))}
        <span className={isLoading ? "h-3 w-6 animate-pulse rounded bg-default" : "text-xs text-muted"}>{isLoading ? "" : props.moreLabel}</span>
    </span>
)

/** Source-level tier marker for the intrinsic contribution legend. */
