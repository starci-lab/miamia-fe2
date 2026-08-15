"use client"

import { useMemo, useState, type ComponentType } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { ComingSoonOverlay } from "@/components/overlays/app/ComingSoonOverlay"
import { useSessionRefresh } from "@/hooks/auth/useSessionRefresh"
import { _MiaMiaAppLayout, type MiaMiaDestination, type MiaMiaNavItem } from "./component"

const MOBILE_ITEMS: ReadonlyArray<{ readonly id: MiaMiaDestination; readonly icon: MiaMiaNavItem["icon"] }> = [
    { id: "home", icon: "home" },
    { id: "exam", icon: "review" },
    { id: "study", icon: "course" },
    { id: "game", icon: "talents" },
    { id: "ranking", icon: "league" },
]
const SPINE_ITEMS: ReadonlyArray<{ readonly id: MiaMiaDestination; readonly icon: MiaMiaNavItem["icon"] }> = [...MOBILE_ITEMS, { id: "profile", icon: "account" }]

/** Defines the active surface rendered by the connected MiaMia shell. */
export type MiaMiaAppLayoutProps = { readonly surface: ComponentType }

/** Connects MiaMia navigation behavior and copy to the pure application shell. */
export const MiaMiaAppLayout = ({ surface }: MiaMiaAppLayoutProps) => {
    useSessionRefresh()
    const t = useTranslations("miamia.nav")
    const pathname = usePathname()
    const router = useRouter()
    const [coming, setComing] = useState<MiaMiaDestination | undefined>()
    const isCurrent = (id: MiaMiaDestination) => id === "profile"
        ? pathname.includes("/profile")
        : id === "exam"
            ? pathname.includes("/exam")
            : id === "study" && (pathname.endsWith("/study") || pathname.includes("/study/"))
    const mobileItems = useMemo(() => MOBILE_ITEMS.map((item) => ({ ...item, label: t(item.id), isCurrent: isCurrent(item.id) })), [pathname, t])
    const spineItems = useMemo(() => SPINE_ITEMS.map((item) => ({ ...item, label: t(item.id), isCurrent: isCurrent(item.id) })), [pathname, t])
    const open = (id: string) => {
        if (id === "exam") router.push("/exam")
        else if (id === "study") router.push("/study")
        else if (id === "profile") router.push("/profile")
        else setComing(SPINE_ITEMS.find((item) => item.id === id)?.id)
    }
    return (
        <>
            <_MiaMiaAppLayout
                props={{ spine: { lockedLabel: t("comingSoon"), groups: [{ id: "learn", label: t("group"), rows: spineItems.map((item) => ({ ...item, isLocked: item.id !== "exam" && item.id !== "study" && item.id !== "profile" })) }] }, mobileTabs: mobileItems }}
                on={{ openDestination: open }}
                surface={surface}
            />
            <ComingSoonOverlay isOpen={coming !== undefined} featureLabel={coming === undefined ? "" : t(coming)} onDismiss={() => setComing(undefined)} />
        </>
    )
}

/** Declares the component architecture metadata. */
export const meta = { shape: "layout", world: "connected", domain: "miamia" } as const
