import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryTopicDetailResponse } from "./types/study"

const query = gql`query TopicDetail($slug: String!) { topicDetail(slug: $slug) { success message error data { id slug level nameVi nameEn phrases { id text example audioKey level meaningVi meaningEn contextNoteVi contextNoteEn } } } }`

/** Fetches one public topic and its ordered phrases. */
export const queryTopicDetail = async (slug: string) => createApolloClient({ withAuth: false }).query<QueryTopicDetailResponse>({ query, variables: { slug } })
