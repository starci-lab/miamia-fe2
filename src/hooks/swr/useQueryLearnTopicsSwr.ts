"use client"

import useSWR from "swr"
import { queryLearnTopics } from "@/modules/api/graphql/queries/query-learn-topics"
import type { LearnTopic } from "@/modules/api/graphql/queries/types/study"

/** Loads the public Study topic catalogue. */
export const useQueryLearnTopicsSwr = () => useSWR<ReadonlyArray<LearnTopic> | null>("QUERY_LEARN_TOPICS", async () => (await queryLearnTopics()).data?.learnTopics.data ?? null)
