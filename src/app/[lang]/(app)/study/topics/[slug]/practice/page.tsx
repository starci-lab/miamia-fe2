import { StudyPracticePage } from "@/components/pages/StudyPracticePage"

type StudyPracticeRouteProps = { readonly params: Promise<{ readonly lang: string; readonly slug: string }> }
const StudyPracticeRoute = async ({ params }: StudyPracticeRouteProps) => {
    const { slug } = await params
    return <StudyPracticePage slug={slug} />
}
export default StudyPracticeRoute
