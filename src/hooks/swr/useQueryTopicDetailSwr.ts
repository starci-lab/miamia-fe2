"use client"

import useSWR from "swr"
import { queryTopicDetail } from "@/modules/api/graphql/queries/query-topic-detail"
import type { StudyTopicDetail } from "@/modules/api/graphql/queries/types/study"

/** Loads one public Study topic. */
export const useQueryTopicDetailSwr = (slug: string) => useSWR<StudyTopicDetail | null>(slug ? ["QUERY_TOPIC_DETAIL", slug] : null, async () => (await queryTopicDetail(slug)).data?.topicDetail.data ?? null)
