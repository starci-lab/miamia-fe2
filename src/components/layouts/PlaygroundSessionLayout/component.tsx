import type { ComponentType } from "react"
import { Grammar } from "@/components/layouts/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { renderComposite, layoutNode, renderLeaf } from "@/modules/types/layout"

/** Data states the persistent playground frame can expose. */
export type PlaygroundSessionFrameState = "pending" | "ready" | "failed"

/** Resolved inputs for the pure persistent playground frame. */
export type PlaygroundSessionLayoutProps = {
    readonly state: PlaygroundSessionFrameState
    readonly surface: ComponentType
    readonly failedLabel: string
    readonly retryLabel: string
    readonly onRetry?: () => void
}

/** Keep the routed setup or session surface mounted inside one persistent data/socket owner. */
export const PlaygroundSessionLayoutBase = (input: PlaygroundSessionLayoutProps) => {
    const Surface = input.surface
    return (
        <Grammar layout="playground-session-frame" render={layoutNode("playground-session-frame", {
            ...(input.state === "failed" ? {} : {
                surface: renderLeaf("page", {}, () => <Surface />),
            }),
            ...(input.state !== "failed" ? {} : {
                notice: renderComposite("empty-notice", {}, () => (
                    <EmptyNotice
                        props={{ message: input.failedLabel, actionLabel: input.retryLabel }}
                        on={{ act: input.onRetry }}
                    />
                )),
            }),
        })} />
    )
}

/** Source-level ownership marker. */
