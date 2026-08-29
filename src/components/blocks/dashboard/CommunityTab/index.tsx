import { Grammar } from "@/components/layouts/Grammar"
import { LeagueCard } from "@/components/blocks/dashboard/LeagueCard"
import { TopLearners } from "@/components/blocks/dashboard/TopLearners"
import { layoutNode,layoutContent } from "@/modules/types/layout"
/** Orchestrate weekly and global competition blocks in legacy order. */
export const CommunityTab=()=> <Grammar layout="dashboard-tab-main" render={layoutNode("dashboard-tab-main",{section:[layoutContent("label-row-over-card",()=> <LeagueCard/>),layoutContent("label-row-over-card",()=> <TopLearners/>)]})}/>
/** Source-level ownership marker. */
