import { CLASS_NAME_1, CLASS_NAME_2, CLASS_NAME_3, CLASS_NAME_4 } from './styles'
"use client"

import { Tabs } from "@heroui/react"
import { Icon, type IconName } from "@/components/leaves/Icon"
import type { ComponentProps } from "@/components/contracts/props"

/** One tab in the legacy dashboard strip. */
export type ExtendedTab = {
    readonly id: string
    readonly label: string
    readonly icon: IconName
}

/** The controlled data accepted by the closed StarCi tab primitive. */
export type ExtendedTabsData = {
    readonly label: string
    readonly selectedKey: string
    readonly tabs: ReadonlyArray<ExtendedTab>
}

/** Events reported by the tab primitive. */
export type ExtendedTabsActions = {
    readonly select?: (key: string) => void
}

/** Fixed data and actions accepted by the closed StarCi tab leaf. */
export type ExtendedTabsProps = ComponentProps<ExtendedTabsData, ExtendedTabsActions>

/**
 * The original StarCi `ExtendedTabs` rendering, closed over typed tab data.
 *
 * The old public `children` hole is deliberately replaced by `tabs`: the HeroUI compound anatomy,
 * secondary variant, icon sizing and indicator are still the legacy implementation, while callers
 * can no longer replace that anatomy with arbitrary markup.
 */
export const ExtendedTabs = ({ props, on }: ExtendedTabsProps) => (
    <div data-tier="leaf" data-component="ExtendedTabs" className={CLASS_NAME_1}>
        <Tabs
            variant="secondary"
            selectedKey={props.selectedKey}
            onSelectionChange={(key) => on?.select?.(String(key))}
            className={CLASS_NAME_2}
        >
            <Tabs.ListContainer>
                <Tabs.List aria-label={props.label}>
                    {props.tabs.map((tab) => (
                        <Tabs.Tab
                            key={tab.id}
                            id={tab.id}
                            aria-controls={`dashboard-panel-${tab.id}`}
                        >
                            <span className={CLASS_NAME_3}>
                                <Icon props={{ name: tab.icon, role: "leading" }} />
                                <span className={CLASS_NAME_4}>{tab.label}</span>
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>
        </Tabs>
    </div>
)

/** Source-level tier marker for the closed tab primitive. */
export const meta = { shape: "leaf", world: "pure" } as const
