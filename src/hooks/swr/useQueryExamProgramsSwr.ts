import useSWR from "swr"
import { queryExamPrograms } from "@/modules/api/graphql/queries/query-exam-programs"
import type { ExamProgram } from "@/modules/api/graphql/queries/types/exam"

/** Loads the exam programs available to the signed-in learner. */
export const useQueryExamProgramsSwr = () => useSWR<ReadonlyArray<ExamProgram> | null>("QUERY_EXAM_PROGRAMS", async () => (await queryExamPrograms()).data?.examPrograms.data ?? null)
