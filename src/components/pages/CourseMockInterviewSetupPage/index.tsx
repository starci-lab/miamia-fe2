"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useQueryCourseSwr } from "@/hooks/swr/useQueryCourseSwr"
import { useQueryMyInProgressMockInterviewSessionSwr } from "@/hooks/swr/useQueryMyInProgressMockInterviewSessionSwr"
import { useMutateStartMockInterviewSessionSwr } from "@/hooks/swr/useMutateStartMockInterviewSessionSwr"
import { _CourseMockInterviewSetupPage as CourseMockInterviewSetupPageView } from "./component"

/** Route-owned input for the connected setup page. */
export type CourseMockInterviewSetupPageProps = { readonly displayId: string }

const COPY = {
    en: {
        title: "Mock interview",
        description: "Practise a technical interview grounded in this course, then receive detailed feedback.",
        level: "Seniority",
        mode: "Interview format",
        start: "Start interview",
        starting: "Starting your interview…",
        resume: "Resume interview",
        resumable: "You have an unfinished interview. Resume it or start a fresh draw.",
        failed: "The interview setup could not be loaded.",
        retry: "Try again",
        levels: { junior: "Junior", middle: "Middle", senior: "Senior" },
        modes: { qna: "Technical Q&A", design: "System design" },
    },
    vi: {
        title: "Phỏng vấn thử", // vn-ok: approved Vietnamese runtime copy
        description: "Luyện phỏng vấn kỹ thuật theo nội dung khóa học và nhận phản hồi chi tiết.", // vn-ok: approved Vietnamese runtime copy
        level: "Cấp độ", // vn-ok: approved Vietnamese runtime copy
        mode: "Hình thức phỏng vấn", // vn-ok: approved Vietnamese runtime copy
        start: "Bắt đầu phỏng vấn", // vn-ok: approved Vietnamese runtime copy
        starting: "Đang tạo buổi phỏng vấn…", // vn-ok: approved Vietnamese runtime copy
        resume: "Tiếp tục phỏng vấn", // vn-ok: approved Vietnamese runtime copy
        resumable: "Bạn có một buổi phỏng vấn chưa hoàn thành. Hãy tiếp tục hoặc bắt đầu đề mới.", // vn-ok: approved Vietnamese runtime copy
        failed: "Không tải được phần chuẩn bị phỏng vấn.", // vn-ok: approved Vietnamese runtime copy
        retry: "Thử lại", // vn-ok: approved Vietnamese runtime copy
        levels: { junior: "Sơ cấp", middle: "Trung cấp", senior: "Cao cấp" }, // vn-ok: approved Vietnamese runtime copy
        modes: { qna: "Hỏi đáp kỹ thuật", design: "Thiết kế hệ thống" }, // vn-ok: approved Vietnamese runtime copy
    },
} as const

type SetupState = "failed" | "starting" | "pending" | "ready" | "resumable"

/** Inputs that decide which single situation the setup page is in. */
type SetupStateInput = {
    readonly failed: boolean
    readonly isMutating: boolean
    readonly pending: boolean
    readonly hasNoInProgressSession: boolean
}

/** Resolves the single situation the setup page is in, in the priority order the page decided on. */
const resolveSetupState = (input: SetupStateInput): SetupState => {
    if (input.failed) return "failed"
    if (input.isMutating) return "starting"
    if (input.pending) return "pending"
    if (input.hasNoInProgressSession) return "ready"
    return "resumable"
}

/** Resolves the status message shown for a non-ready setup state. */
/**
 * The three status sentences this page can show.
 *
 * Declared structurally rather than as `typeof COPY.en`, because the caller passes whichever
 * locale is active and the two locales are different literal types - naming one of them made
 * the other unassignable.
 */
interface SetupStatusCopy {
    resumable: string
    starting: string
    failed: string
}

const resolveSetupStatus = (state: SetupState, copy: SetupStatusCopy) => {
    if (state === "resumable") return copy.resumable
    if (state === "starting") return copy.starting
    if (state === "failed") return copy.failed
    return undefined
}

/** Resolve setup data, start or resume a durable mock-interview session, and navigate to its route. */
export const CourseMockInterviewSetupPage = ({ displayId }: CourseMockInterviewSetupPageProps) => {
    const locale = useLocale()
    const copy = locale === "vi" ? COPY.vi : COPY.en
    const router = useRouter()
    const course = useQueryCourseSwr({ displayId })
    const courseId = course.data?.id
    const inProgress = useQueryMyInProgressMockInterviewSessionSwr(courseId)
    const startSession = useMutateStartMockInterviewSessionSwr(courseId)
    const [level, setLevel] = useState("middle")
    const [mode, setMode] = useState("qna")
    const [startError, setStartError] = useState(false)
    const failed = course.error !== undefined || inProgress.error !== undefined || startError || course.data === null
    const pending = !failed && (course.data === undefined || inProgress.data === undefined)
    const state = resolveSetupState({
        failed,
        isMutating: startSession.isMutating,
        pending,
        hasNoInProgressSession: inProgress.data === null,
    })

    const openSession = (sessionId: string) => {
        router.push(`/courses/${displayId}/learn/mock-interview/interview/${sessionId}`)
    }

    const start = async () => {
        if (courseId === undefined) return
        setStartError(false)
        try {
            const response = await startSession.trigger({ courseId, level, mode })
            const payload = response.data?.startMockInterviewSession
            if (payload?.success !== true || payload.data === null || payload.data === undefined) throw new Error(payload?.error ?? "START_FAILED")
            await inProgress.mutate()
            openSession(payload.data.sessionId)
        } catch {
            setStartError(true)
        }
    }

    const resumableSessionId = inProgress.data?.sessionId

    return (
        <CourseMockInterviewSetupPageView
            state={state}
            props={{
                title: copy.title,
                description: copy.description,
                status: resolveSetupStatus(state, copy),
                levelLabel: copy.level,
                modeLabel: copy.mode,
                levels: Object.entries(copy.levels).map(([id, label]) => ({ id, label })),
                modes: Object.entries(copy.modes).map(([id, label]) => ({ id, label })),
                selectedLevel: level,
                selectedMode: mode,
                startLabel: copy.start,
                resumeLabel: copy.resume,
                retryLabel: copy.retry,
            }}
            on={{
                configure: (field, value) => {
                    if (field === "level") setLevel(value)
                    else setMode(value)
                },
                start: () => { void start() },
                resume: resumableSessionId === undefined ? undefined : () => openSession(resumableSessionId),
                retry: () => {
                    setStartError(false)
                    void Promise.all([course.mutate(), inProgress.mutate()])
                },
            }}
        />
    )
}

/** Source-level ownership marker for the connected setup twin. */
export const meta = { world: "connected", domain: "learn" } as const
