import { CLASS_NAME_1 } from './styles'
import type { ReactNode } from "react"
import { Dropdown } from "@heroui/react"
import { Icon, type IconName } from "@/components/leaves/Icon"

/** Placement choices exposed without leaking the vendor vocabulary beyond the shell. */
export type DropdownBranchPlacement = "bottom left" | "bottom right" | "top left" | "top right"

/** One menu item described by its caller without exposing HeroUI anatomy. */
export type DropdownBranchItemData<I extends string> = {
    readonly id: I
    readonly label: string
    readonly icon?: IconName
    readonly isDisabled?: boolean
}

/** One semantic section in a menu. */
export type DropdownBranchSectionData<I extends string> = {
    readonly items: ReadonlyArray<DropdownBranchItemData<I>>
}

/** Data the shell projects into complete vendor dropdown anatomy. */
export type DropdownBranchData<I extends string> = {
    readonly label: string
    readonly placement?: DropdownBranchPlacement
    readonly sections: ReadonlyArray<DropdownBranchSectionData<I>>
}

/** Menu selection reported without putting functions in item data. */
export type DropdownBranchActions<I extends string> = {
    readonly action?: (id: I) => void
}

/** Props for the content-agnostic dropdown mechanics. */
export type DropdownBranchProps<I extends string> = {
    readonly props: DropdownBranchData<I>
    readonly on?: DropdownBranchActions<I>
    readonly trigger: ReactNode
}

/**
 * BRANCH - `DropdownBranch`: the vendor's trigger, popover, focus, keyboard, section and item mechanics.
 *
 * Callers decide item meaning and grouping as data. This shell alone expands that data into the
 * complete HeroUI compound structure, so no block has to know that Section and Item exist.
 */
export const DropdownBranch = <const I extends string>(input: DropdownBranchProps<I>) => (
    <Dropdown>
        <Dropdown.Trigger
            aria-label={input.props.label}
            className={CLASS_NAME_1}
        >
            {input.trigger}
        </Dropdown.Trigger>
        <Dropdown.Popover placement={input.props.placement ?? "bottom right"}>
            <Dropdown.Menu aria-label={input.props.label}>
                {input.props.sections.map((section, sectionIndex) => (
                    <Dropdown.Section key={"section-" + sectionIndex}>
                        {section.items.map((item) => (
                            <Dropdown.Item
                                key={item.id}
                                id={item.id}
                                textValue={item.label}
                                isDisabled={item.isDisabled}
                                onAction={() => input.on?.action?.(item.id)}
                            >
                                {item.icon === undefined ? null : <Icon props={{ name: item.icon, role: "leading" }} />}
                                {item.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Section>
                ))}
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>
)

/** Source-level tier marker for the content-agnostic dropdown mechanics. */
export const meta = { shape: "branch", mechanics: true, world: "pure" } as const
