import { Grammar } from "@/components/branches/Grammar"
import { CurriculumModuleRow } from "@/components/leaves/CurriculumModuleRow"
import { Heading } from "@/components/leaves/Heading"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"
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
    <Grammar contract="course-learn-module-page" render={createGrammarNode("course-learn-module-page", {
        title: createLeafNode("heading", {}, () => (
            <Heading props={{ content: input.title, level: 1 }} isLoading={input.state === "pending"} />
        )),
        module: createLeafNode("curriculum-module-row", {}, () => (
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
export const meta = { world: "pure", domain: "learn" } as const
