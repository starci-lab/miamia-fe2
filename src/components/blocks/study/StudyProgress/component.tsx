import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { LabelledProgressRow } from "@/components/composites/LabelledProgressRow"
import { StatRow, type StatRowData } from "@/components/composites/StatRow"
import { Heading } from "@/components/leaves/Heading"
import { renderComposite, layoutNode, renderLeaf, type BlockProps } from "@/modules/types/layout"

type StudyProgressData = { readonly title: string; readonly stats: ReadonlyArray<StatRowData>; readonly levelTitle: string; readonly levelPercent: number; readonly levelFact: string; readonly notice: string; readonly actionLabel: string }
type StudyProgressActions = { readonly browse?: () => void; readonly requireSignIn?: () => void; readonly retry?: () => void }
type StudyProgressProps = BlockProps<"guest" | "pending" | "failed" | "ready", StudyProgressData> & { readonly on?: StudyProgressActions }

/** Renders guest, loading, failure and verified progress as independent evidence. */
export const StudyProgressBase = (input: StudyProgressProps) => {
    const loading = input.state === "pending"
    const notice = input.state === "guest" || input.state === "failed"
    return <SurfaceCard layout="study-progress-card" render={layoutNode("study-progress-card", {
        title: renderLeaf("heading", {}, () => <Heading props={{ content: input.props.title, level: 2 }} />),
        ...(notice ? { notice: renderComposite("empty-notice", {}, () => <EmptyNotice props={{ icon: input.state === "guest" ? "account" : "retry", message: input.props.notice, actionLabel: input.props.actionLabel }} on={{ act: input.state === "guest" ? input.on?.requireSignIn : input.on?.retry }} />) } : {
            stat: input.props.stats.map((stat) => renderComposite("stat-row", {}, () => <StatRow key={stat.label} props={stat} isLoading={loading} />)),
            progress: renderComposite("labelled-progress-row", {}, () => <LabelledProgressRow props={{ id: "level", title: input.props.levelTitle, percent: input.props.levelPercent, percentText: input.props.levelFact }} isLoading={loading} />),
        }),
    })} />
}
/** Declares the pure Study progress block. */
