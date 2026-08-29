import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf, type BlockProps } from "@/modules/types/layout"

type StudyContinueData = { readonly eyebrow: string; readonly title: string; readonly body: string; readonly actionLabel: string; readonly browseLabel: string }
type StudyContinueActions = { readonly resume?: () => void; readonly browse?: () => void }
type StudyContinueProps = BlockProps<"pending" | "failed" | "empty" | "ready", StudyContinueData> & { readonly on?: StudyContinueActions }

/** Renders the response-backed resume promise without inventing local progress. */
export const StudyContinueBase = (input: StudyContinueProps) => {
    const loading = input.state === "pending"
    const primary = input.state === "ready" ? input.on?.resume : input.on?.browse
    return <SurfaceCard layout="study-resume-hero" render={layoutNode("study-resume-hero", {
        eyebrow: renderLeaf("badge", {}, () => <Badge props={{ content: input.props.eyebrow, tone: input.state === "ready" ? "accent" : "neutral" }} isLoading={loading} />),
        title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 1 }} isLoading={loading} />),
        body: renderLeaf("text", {}, () => <Text props={{ content: input.props.body, tone: "muted" }} isLoading={loading} />),
        action: renderLeaf("button", {}, () => <Button props={{ label: input.props.actionLabel, variant: "primary", icon: "next", iconPlacement: "trailing" }} on={{ press: primary }} isLoading={loading} />),
        ...(input.state === "ready" ? { secondary: renderLeaf("button", {}, () => <Button props={{ label: input.props.browseLabel, variant: "ghost" }} on={{ press: input.on?.browse }} />) } : {}),
    })} />
}
/** Declares the pure Study resume block. */
