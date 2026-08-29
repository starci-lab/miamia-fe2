"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { AuthenticationPageBase } from "./component"

/** Keep post-auth navigation inside this app and reject protocol-relative redirects. */
export const resolveAuthenticationReturnTo = (requested: string | null): string =>
    requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/exam"

/** Resolve authentication-route navigation and draw its pure page twin. */
export const AuthenticationPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnTo = resolveAuthenticationReturnTo(searchParams.get("returnTo"))
    return <AuthenticationPageBase on={{ signedIn: () => router.replace(returnTo) }} />
}

/** Source-level tier marker for the connected authentication page. */
