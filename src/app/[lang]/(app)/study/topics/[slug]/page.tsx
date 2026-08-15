import { StudyTopicPage } from "@/components/pages/StudyTopicPage"

type StudyTopicRouteProps = { readonly params: Promise<{ readonly lang: string; readonly slug: string }> }
const StudyTopicRoute = async ({ params }: StudyTopicRouteProps) => {
    const { slug } = await params
    return <StudyTopicPage slug={slug} />
}
export default StudyTopicRoute
