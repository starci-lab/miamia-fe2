import type { GraphQLResponse } from "../../types"

/** One weekly-XP standing from the viewer's mutual-follow graph. */
export type FriendsLeaderboardRow = {
    readonly rank: number
    readonly userId: string
    readonly name: string
    readonly avatar?: string | null
    readonly weeklyXp: number
    readonly isViewer: boolean
}

/** GraphQL envelope returned by the friends leaderboard operation. */
export type QueryFriendsLeaderboardResponse = {
    readonly friendsLeaderboard: GraphQLResponse<ReadonlyArray<FriendsLeaderboardRow>>
}
