import { CLASS_NAME_1, CLASS_NAME_2 } from './styles'
import { Icon } from "@/components/leaves/Icon"
import type { ComponentProps } from "@/components/contracts/props"

/**
 * LEAF - `CurriculumLessonRow`: one lesson inside a disclosed curriculum module.
 *
 * Target path: `src/components/leaves/CurriculumLessonRow/index.tsx`.
 *
 * THE SAME SHAPE CLASS AS `ContentMapRow`, CARRYING A DIFFERENT FACT. `ContentMapRow` answers "is
 * this where I am" and "is this done" for a content the reader can already open, so it is a `Link`
 * with `isComplete`/`isCurrent`. A curriculum lesson browsed here answers "can I read this one for
 * free before enrolling" instead - a fact `ContentMapRow` has no slot for - and it opens nothing of
 * its own, so it stays a plain row rather than a control.
 */

/** What this leaf draws. */
export type CurriculumLessonRowData = {
    /** The already-resolved lesson title. */
    readonly title: string
    /** Whether this lesson is previewable before enrolment. */
    readonly isPreview?: boolean
}

/** Props for {@link CurriculumLessonRow}. */
export type CurriculumLessonRowProps = ComponentProps<CurriculumLessonRowData>

const ROW_CLASSES = "flex flex-row items-center gap-2"

/**
 * Draw one lesson row.
 *
 * @param input - {@link CurriculumLessonRowProps}
 */
export const CurriculumLessonRow = ({ props }: CurriculumLessonRowProps) => (
    <div
        data-tier="leaf"
        data-component="CurriculumLessonRow"
        className={ROW_CLASSES}
    >
        <span className={CLASS_NAME_1}>{props.title}</span>
        {props.isPreview === true ? (
            <span className={CLASS_NAME_2}>
                <Icon props={{ name: "review", role: "chip" }} />
            </span>
        ) : null}
    </div>
)

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
