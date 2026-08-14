"use client"

import { useMemo, useState, type ComponentType } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { ComingSoonOverlay } from "@/components/overlays/app/ComingSoonOverlay"
import { _MiaMiaAppLayout, type MiaMiaDestination, type MiaMiaNavItem } from "./component"

const ITEMS: ReadonlyArray<{ readonly id: MiaMiaDestination; readonly icon: MiaMiaNavItem["icon"] }> = [
    { id: "home", icon: "home" },
    { id: "exam", icon: "review" },
    { id: "study", icon: "course" },
    { id: "game", icon: "talents" },
    { id: "ranking", icon: "league" },
]

/** Defines the active surface rendered by the connected MiaMia shell. */
export type MiaMiaAppLayoutProps = { readonly surface: ComponentType }

/** Connects MiaMia navigation behavior and copy to the pure application shell. */
export const MiaMiaAppLayout = ({ surface }: MiaMiaAppLayoutProps) => {
    const t = useTranslations("miamia.nav")
    const pathname = usePathname()
    const router = useRouter()
    const [coming, setComing] = useState<MiaMiaDestination | undefined>()
    const items = useMemo(() => ITEMS.map((item) => ({ ...item, label: t(item.id), isCurrent: item.id === "exam" && pathname.includes("/exam") })), [pathname, t])
    const open = (id: string) => {
        if (id === "exam") router.push("/exam")
        else setComing(ITEMS.find((item) => item.id === id)?.id)
    }
    return (
        <>
            <_MiaMiaAppLayout
                props={{ spine: { lockedLabel: t("comingSoon"), groups: [{ id: "learn", label: t("group"), rows: items.map((item) => ({ ...item, isLocked: item.id !== "exam" })) }] }, mobileTabs: items }}
                on={{ openDestination: open }}
                surface={surface}
            />
            <ComingSoonOverlay isOpen={coming !== undefined} featureLabel={coming === undefined ? "" : t(coming)} onDismiss={() => setComing(undefined)} />
        </>
    )
}

/** Declares the component architecture metadata. */
export const meta = { shape: "layout", world: "connected", domain: "miamia" } as const
