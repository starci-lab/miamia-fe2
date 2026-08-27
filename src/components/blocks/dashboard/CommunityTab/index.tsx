import { Grammar } from "@/components/branches/Grammar"
import { LeagueCard } from "@/components/blocks/dashboard/LeagueCard"
import { TopLearners } from "@/components/blocks/dashboard/TopLearners"
import { createGrammarNode,createGrammarProjection } from "@/components/contracts/props"
/** Orchestrate weekly and global competition blocks in legacy order. */
export const CommunityTab=()=> <Grammar contract="dashboard-tab-main" render={createGrammarNode("dashboard-tab-main",{section:[createGrammarProjection("label-row-over-card",()=> <LeagueCard/>),createGrammarProjection("label-row-over-card",()=> <TopLearners/>)]})}/>
/** Source-level ownership marker. */
export const meta={world:"pure",domain:"community"} as const
