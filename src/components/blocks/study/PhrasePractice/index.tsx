"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import useSWRMutation from "swr/mutation"
import { useQueryPhrasePracticeSwr } from "@/hooks"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { mutationRecordPractice } from "@/modules/api/graphql/mutations/mutation-record-practice"
import type { RecordPracticeData, RecordPracticeRequest } from "@/modules/api/graphql/mutations/types/record-practice"
import { _PhrasePractice } from "./component"

type PhrasePracticeConnectedProps = { readonly slug: string; readonly onRequireSignIn: () => void; readonly onExit: () => void }
type RecordPracticeMutationOptions = { readonly arg: RecordPracticeRequest }
/** Owns local answers and records one authenticated topic-linked practice batch. */
export const PhrasePractice = ({ slug, onRequireSignIn, onExit }: PhrasePracticeConnectedProps) => {
    const t = useTranslations("miamia.study.practice")
    const token = useSessionToken()
    const query = useQueryPhrasePracticeSwr(slug)
    const mutation = useSWRMutation(["MUTATE_RECORD_PRACTICE", slug], async (_key, { arg }: RecordPracticeMutationOptions) => mutationRecordPractice(arg))
    const [position, setPosition] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [result, setResult] = useState<RecordPracticeData | undefined>()
    const [submitFailed, setSubmitFailed] = useState(false)
    const items = query.data ?? []
    const current = items[position]
    const correctCount = useMemo(() => items.filter((item) => answers[item.promptPhraseId] === item.promptPhraseId).length, [answers, items])
    const submit = async () => {
        if (!token) { onRequireSignIn(); return }
        if (mutation.isMutating) return
        setSubmitFailed(false)
        try {
            const response = await mutation.trigger({ topicSlug: slug, results: items.map((item) => ({ phraseId: item.promptPhraseId, correct: answers[item.promptPhraseId] === item.promptPhraseId })) })
            const envelope = response.data?.recordPractice
            if (!envelope?.success || !envelope.data) throw new Error(envelope?.error ?? "RECORD_PRACTICE_FAILED")
            setResult(envelope.data)
        } catch { setSubmitFailed(true) }
    }
    const state = query.error || query.data === null ? "failed" : query.data === undefined ? "pending" : query.data.length === 0 ? "empty" : result ? "result" : mutation.isMutating ? "submitting" : "answering"
    const repeat = () => { setPosition(0); setAnswers({}); setResult(undefined); setSubmitFailed(false) }
    return <_PhrasePractice state={state} props={{ title: t("title"), position: items.length ? t("position", { current: position + 1, total: items.length }) : "", prompt: current?.meaningVi ?? "", questionLabel: t("question"), options: (current?.options ?? []).map((option) => ({ id: option.phraseId, label: option.text })), selectedKey: current ? answers[current.promptPhraseId] : undefined, previousLabel: t("previous"), nextLabel: t("next"), submitLabel: token ? t("submit") : t("signInToSave"), exitLabel: t("exit"), loading: t("loading"), failed: t("failed"), empty: t("empty"), retry: t("retry"), submitFailed: submitFailed ? t("submitFailed") : undefined, resultTitle: t("resultTitle"), resultStats: [{ icon: "complete", label: t("correct"), value: `${correctCount}/${items.length}` }, { icon: "course", label: t("studied"), value: String(result?.phrasesStudied ?? 0) }, { icon: "star", label: t("known"), value: String(result?.phrasesKnown ?? 0) }], repeatLabel: t("repeat"), backLabel: t("back") }} on={{ select: (id) => { if (current) setAnswers((value) => ({ ...value, [current.promptPhraseId]: id })) }, previous: position > 0 ? () => setPosition((value) => value - 1) : undefined, next: position < items.length - 1 ? () => setPosition((value) => value + 1) : undefined, submit, exit: onExit, retry: () => { void query.mutate() }, repeat }} />
}
/** Declares the connected phrase-practice block. */
export const meta = { shape: "block", world: "connected", domain: "study" } as const
