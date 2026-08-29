import { skeletonVariants } from "@heroui/react"
import type { ComponentProps } from "@/modules/types/layout"

/** Semantic states represented by a compact legend mark. */
export type StatusDotTone = "accent" | "success" | "warning" | "danger"
/** Meaning and accessible name for one status mark. */
export type StatusDotData = { readonly tone: StatusDotTone; readonly label: string }
/** Closed leaf props for a status mark. */
export type StatusDotProps = ComponentProps<StatusDotData>

const TONES = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
} as const
const RESTING = skeletonVariants({ animationType: "shimmer" }).base()

/** Draw one semantic legend mark; the adjacent visible label carries its wording. */
export const StatusDot = ({ props, isLoading = false }: StatusDotProps) => (
    <span

        data-component="StatusDot"
        data-tone={props.tone}
        aria-label={isLoading ? undefined : props.label}
        aria-hidden={isLoading || undefined}
        className={`size-2.5 shrink-0 rounded-full ${isLoading ? RESTING : TONES[props.tone]}`}
    />
)

/** Source-level tier marker. */
