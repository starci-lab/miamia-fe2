import { CLASS_NAME_1, CLASS_NAME_2, CLASS_NAME_3 } from "./classNames"
import { Button, Kbd } from "@heroui/react"
import { Icon } from "@/components/leaves/Icon"
import type { ComponentProps } from "@/modules/types/layout"

/** Copy shown by the navbar's input-looking press target. */
export type PressableInputLikeData = {
    readonly placeholder: string
    readonly label: string
    readonly shortcut?: string
}

/** What pressing the input-looking control reports. */
export type PressableInputLikeActions = {
    readonly press?: () => void
}

/** Fixed props for the navbar search trigger. */
export type PressableInputLikeProps = ComponentProps<PressableInputLikeData, PressableInputLikeActions>

/**
 * Draw a button with the exact field appearance used by the legacy navbar.
 * It never accepts text: the whole field is one press target that opens search.
 */
export const PressableInputLike = ({ props, on }: PressableInputLikeProps) => (
    <Button

        data-component="PressableInputLike"
        variant="outline"
        aria-label={props.label}
        onPress={on?.press}
        className={CLASS_NAME_1}
    >
        <span className={CLASS_NAME_2}>
            <Icon props={{ name: "search", role: "leading" }} />
            <span className={CLASS_NAME_3}>{props.placeholder}</span>
        </span>
        {props.shortcut === undefined ? null : <Kbd>{props.shortcut}</Kbd>}
    </Button>
)

/** Source-level tier marker for the input-looking control. */
