import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryFriendsLeaderboardResponse } from "./types/friends-leaderboard"

const query = gql`query FriendsLeaderboard { friendsLeaderboard { success message error data { rank userId name avatar weeklyXp isViewer } } }`

/** Fetch the signed-in viewer's mutual-follow weekly XP board. */
export const queryFriendsLeaderboard = async () => createApolloClient({ withAuth: true }).query<QueryFriendsLeaderboardResponse>({ query })

