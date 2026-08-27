import type { ComponentType } from "react"
import { Grammar } from "@/components/branches/Grammar"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { createCompositeNode, createGrammarNode, createLeafNode } from "@/components/contracts/props"

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
        <Grammar contract="playground-session-frame" render={createGrammarNode("playground-session-frame", {
            ...(input.state === "failed" ? {} : {
                surface: createLeafNode("page", {}, () => <Surface />),
            }),
            ...(input.state !== "failed" ? {} : {
                notice: createCompositeNode("empty-notice", {}, () => (
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
export const meta = { shape: "layout", world: "pure", domain: "learn" } as const
