import { StandingHeroCard } from "@/components/composites/StandingHeroCard"; import type { BlockProps } from "@/modules/types/layout"
type GameFriendStandingData = { readonly rank?: number; readonly title: string; readonly subtitle: string; readonly fact?: string; readonly ctaLabel: string; readonly progressLabel?: string; readonly progressRatio?: number }
type GameFriendStandingActions = { readonly chooseGame?: () => void; readonly requireSignIn?: () => void }
type GameFriendStandingProps = BlockProps<"pending" | "guest" | "ready" | "empty" | "failed", GameFriendStandingData> & { readonly on?: GameFriendStandingActions }
/** Render the friend-rivalry thesis through the shared standing hero. */
// vn-ok: The progress accessible label is localized Vietnamese runtime copy.
export const GameFriendStandingBase = (input: GameFriendStandingProps) => <StandingHeroCard props={{ standing: { rank: input.props.rank, rankLabel: input.props.rank === undefined ? undefined : `Hạng ${input.props.rank}`, title: input.props.title, subtitle: input.props.subtitle, fact: input.props.fact }, progress: input.props.progressRatio === undefined || input.props.progressLabel === undefined ? undefined : { ratio: input.props.progressRatio, label: input.props.progressLabel }, ctaLabel: input.props.ctaLabel, progressAccessibleLabel: "Tiến độ bám đuổi bạn bè" }} on={{ cta: input.state === "guest" ? input.on?.requireSignIn : input.on?.chooseGame }} isLoading={input.state === "pending"} />
/** Declares the rivalry hero renderer as a pure game block. */
