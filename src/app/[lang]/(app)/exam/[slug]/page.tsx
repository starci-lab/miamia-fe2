import { ExamSessionPage } from "@/components/pages/ExamSessionPage"

type ExamSessionRouteProps = { readonly params: Promise<{ readonly lang: string; readonly slug: string }> }

/** Resolve one paper slug and mount its authenticated exam session. */
const ExamSessionRoute = async ({ params }: ExamSessionRouteProps) => {
    const { slug } = await params
    return <ExamSessionPage slug={slug} />
}

export default ExamSessionRoute
