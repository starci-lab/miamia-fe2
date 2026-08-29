import { Grammar } from "@/components/layouts/Grammar"
import { CurriculumModuleRow } from "@/components/leaves/CurriculumModuleRow"
import { Heading } from "@/components/leaves/Heading"
import { layoutNode, renderLeaf } from "@/modules/types/layout"
import type { ModuleDetail } from "@/modules/api/graphql/queries/query-module"

/** State and resolved module data drawn by the pure module route. */
export type CourseLearnModulePageProps = {
    readonly state: "pending" | "ready" | "failed"
    readonly title?: string
    readonly module?: ModuleDetail
    readonly label: string
}

/** Draw one selected module and its authored content run. */
export const CourseLearnModulePageBase = (input: CourseLearnModulePageProps) => (
    <Grammar layout="course-learn-module-page" render={layoutNode("course-learn-module-page", {
        title: renderLeaf("heading", {}, () => (
            <Heading props={{ content: input.title, level: 1 }} isLoading={input.state === "pending"} />
        )),
        module: renderLeaf("curriculum-module-row", {}, () => (
            <CurriculumModuleRow
                props={{
                    title: input.module?.title ?? input.label,
                    lessons: (input.module?.contents ?? []).map((content) => ({ id: content.id, title: content.title })),
                }}
                isLoading={input.state === "pending"}
            />
        )),
    })} />
)

/** Purity and ownership metadata for the module page twin. */
