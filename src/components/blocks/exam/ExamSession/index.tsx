"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryPaperDetailSwr } from "@/hooks/swr/useQueryPaperDetailSwr"
import { useMutateGradePaperSwr } from "@/hooks/swr/useMutateGradePaperSwr"
import type { GradePaperData } from "@/modules/api/graphql/mutations/types/grade-paper"
import { _ExamSession, type ExamAnswerReviewData, type ExamSkillSummary } from "./component"

/** Defines routing input and exit behavior for the connected exam session. */
export type ExamSessionConnectedProps = { readonly slug: string; readonly onExit: () => void }

/** Connects paper data and grading mutations to the pure exam session. */
export const ExamSession = ({ slug, onExit }: ExamSessionConnectedProps) => {
    const t = useTranslations("miamia.exam.session")
    const locale = useLocale()
    const paper = useQueryPaperDetailSwr(slug)
    const grade = useMutateGradePaperSwr()
    const [position, setPosition] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [result, setResult] = useState<GradePaperData | undefined>()
    const [failedSubmit, setFailedSubmit] = useState(false)
    const detail = paper.data ?? undefined
    const question = detail?.questions[position]
    const localized = (vi?: string | null, en?: string | null, fallback = "") => (locale === "vi" ? vi || en : en || vi) || fallback
    const submit = async () => {
        if (!detail) return
        setFailedSubmit(false)
        try {
            const response = await grade.trigger({ paperSlug: detail.slug, answers: detail.questions.map((item) => ({ questionId: item.questionId, selected: answers[item.questionId] ?? null, secondsSpent: null })) })
            const envelope = response.data?.gradePaper
            if (!envelope?.success || envelope.data === undefined) throw new Error(envelope?.message ?? "Grade failed")
            setResult(envelope.data)
        } catch { setFailedSubmit(true) }
    }
    const skills = useMemo<ReadonlyArray<ExamSkillSummary>>(() => {
        if (!detail || !result) return []
        const rows = new Map<string, { correct: number; total: number }>()
        for (const item of detail.questions) {
            const row = rows.get(item.skill) ?? { correct: 0, total: 0 }
            row.total += 1
            if (result.answers.find((answer) => answer.questionId === item.questionId)?.isCorrect) row.correct += 1
            rows.set(item.skill, row)
        }
        return [...rows.entries()].map(([id, row]) => ({ id, title: id, percent: Math.round((row.correct / row.total) * 100), percentText: `${row.correct}/${row.total}` }))
    }, [detail, result])
    const reviews = useMemo<ReadonlyArray<ExamAnswerReviewData>>(() => (result?.answers ?? []).map((answer, index) => ({ id: answer.questionId, number: t("questionNumber", { number: index + 1 }), verdict: answer.isCorrect ? t("correct") : t("incorrect"), stem: answer.stem, selectedLabel: t("selected"), selected: answer.selected ?? t("skipped"), correctLabel: t("correctAnswer"), correct: answer.correct, explanation: localized(answer.explanationVi, answer.explanationEn) || undefined })), [result, t, locale])
    const state = paper.error || paper.data === null || failedSubmit ? "failed" : paper.data === undefined ? "loading" : result ? "graded" : grade.isMutating ? "submitting" : "ready"
    const count = detail?.questions.length ?? 0
    return <_ExamSession state={state} props={{ title: localized(detail?.titleVi, detail?.titleEn, slug), positionLabel: count === 0 ? "" : t("position", { current: position + 1, total: count }), exitLabel: t("exit"), exitConfirmLabel: t("exitConfirm"), passage: question?.passage?.body, questionLabel: t("questionNumber", { number: position + 1 }), stem: question?.stem ?? "", options: question ? [{ id: "a", label: question.optionA }, { id: "b", label: question.optionB }, { id: "c", label: question.optionC }, { id: "d", label: question.optionD }] : [], selectedKey: question ? answers[question.questionId] : undefined, previousLabel: t("previous"), nextLabel: t("next"), submitLabel: t("submit"), isLast: position >= count - 1, loadingMessage: t("loading"), failedMessage: failedSubmit ? t("submitFailed") : t("failed"), retryLabel: t("retry"), resultTitle: t("resultTitle"), scoreText: result ? t("score", { score: result.score, max: result.maxScore }) : "", scoreBody: t("resultBody"), skillTitle: t("skills"), skills, reviews, backLabel: t("back") }} on={{ selectAnswer: (id) => { if (question) setAnswers((current) => ({ ...current, [question.questionId]: id })) }, previous: () => setPosition((current) => Math.max(0, current - 1)), forward: () => setPosition((current) => Math.min(count - 1, current + 1)), submit, exit: onExit, retry: () => { setFailedSubmit(false); void paper.mutate() }, back: onExit }} />
}

/** Declares the component architecture metadata. */
export const meta = { shape: "block", world: "connected", domain: "exam" } as const
