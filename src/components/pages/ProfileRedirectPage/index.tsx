"use client"
import { useEffect, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useSessionRefresh } from "@/hooks/auth/useSessionRefresh"
import { useSessionToken } from "@/hooks/auth/useSessionToken"
import { queryMe } from "@/modules/api/graphql/queries/query-me"
import { ProfileRedirectPageBase } from "./component"

/** Match the backend's first-access username rule using public JWT identity claims. */
export const profileHandleFromToken = (token?: string): string | undefined => {
    if (token === undefined) return undefined
    try {
        const encoded = token.split(".")[1]
        if (encoded === undefined) return undefined
        const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/")
        const claims = JSON.parse(window.atob(normalized)) as { email?: unknown; preferred_username?: unknown }
        const email = typeof claims.email === "string" ? claims.email.trim() : ""
        const fallback = typeof claims.preferred_username === "string" ? claims.preferred_username.trim() : ""
        return (email.includes("@") ? email.slice(0, email.indexOf("@")) : email) || fallback || undefined
    } catch {
        return undefined
    }
}
/** Resolve the current username and replace `/profile`. */
export const ProfileRedirectPage = () => {
    const router = useRouter()
    const token = useSessionToken()
    const session = useSessionRefresh()
    const resolvingToken = useRef<string | undefined>(undefined)
    useEffect(() => {
        if (session.isRestoring) return
        if (token === undefined) {
            router.replace("/authentication?returnTo=/profile")
            return
        }
        if (resolvingToken.current === token) return
        resolvingToken.current = token
        void queryMe().then((result) => {
            const identity = result.data?.me?.data
            const email = identity?.email?.trim() ?? ""
            const handle = identity?.username?.trim()
                || (email.includes("@") ? email.slice(0, email.indexOf("@")) : email)
                || profileHandleFromToken(token)
            if (handle) router.replace(`/profile/${handle}`)
            else router.replace("/authentication?returnTo=/profile")
        }).catch(() => router.replace("/authentication?returnTo=/profile"))
    }, [router, session.isRestoring, token])
    return <ProfileRedirectPageBase />
}
export * from "./component"
/** Source-level tier marker. */
export const meta = { world: "connected", domain: "profile" } as const
