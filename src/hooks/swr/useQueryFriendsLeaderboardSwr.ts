"use client"

import useSWR from "swr"
import { useViewerKey } from "../auth/useViewerKey"
import { queryFriendsLeaderboard } from "@/modules/api/graphql/queries/query-friends-leaderboard"
import type { FriendsLeaderboardRow } from "@/modules/api/graphql/queries/types/friends-leaderboard"

/** Stable private cache identity for the friend leaderboard query. */
export const QUERY_FRIENDS_LEADERBOARD_SWR_KEY = ["QUERY_FRIENDS_LEADERBOARD_SWR"]

/** Read the signed-in viewer's weekly mutual-follow standing. */
export const useQueryFriendsLeaderboardSwr = (enabled = true) => {
    const viewer = useViewerKey()
    return useSWR<ReadonlyArray<FriendsLeaderboardRow> | null>(
        enabled && viewer !== undefined ? [...QUERY_FRIENDS_LEADERBOARD_SWR_KEY, viewer] : null,
        async () => (await queryFriendsLeaderboard()).data?.friendsLeaderboard?.data ?? null,
    )
}
