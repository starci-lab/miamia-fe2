import { CLASS_NAME_1, CLASS_NAME_2, CLASS_NAME_3 } from './styles'
"use client"

import { ListBox } from "@heroui/react"
import { Icon, type IconName } from "@/components/leaves/Icon"
import type { ComponentProps } from "@/components/contracts/props"

/** One destination in the legacy quick-access ListBox. */
export type QuickActionItem = {
    readonly id: string
    readonly label: string
    readonly icon: IconName
}

/** Resolved copy and items for the quick-access ListBox. */
export type QuickActionsListData = {
    readonly label: string
    readonly items: ReadonlyArray<QuickActionItem>
}

/** Selection reported by the quick-access ListBox. */
export type QuickActionsListActions = {
    readonly activate?: (id: string) => void
}

/** Fixed data and action slots for the quick-access ListBox. */
export type QuickActionsListProps = ComponentProps<QuickActionsListData, QuickActionsListActions>

/** Draw the original native HeroUI ListBox chrome used by the legacy dashboard rail. */
export const QuickActionsList = ({ props, on }: QuickActionsListProps) => (
    <ListBox
        data-tier="leaf"
        data-component="QuickActionsList"
        aria-label={props.label}
        selectionMode="none"
        onAction={(key) => on?.activate?.(String(key))}
        className={CLASS_NAME_1}
    >
        {props.items.map((item) => (
            <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.label}
                className={CLASS_NAME_2}
            >
                <Icon props={{ name: item.icon, role: "leading" }} />
                <span className={CLASS_NAME_3}>{item.label}</span>
            </ListBox.Item>
        ))}
    </ListBox>
)

/** Source-level tier marker for the closed quick-access list. */
export const meta = { shape: "leaf", world: "pure" } as const
