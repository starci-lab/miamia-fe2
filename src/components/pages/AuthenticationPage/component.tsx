import { Grammar } from "@/components/layouts/Grammar"
import { SurfaceFormCard } from "@/components/branches/SurfaceFormCard"
import { AuthenticationPanel } from "@/components/blocks/auth/AuthenticationPanel"
import { layoutNode, layoutContent } from "@/modules/types/layout"

/** What the authentication page reports. */
export type AuthenticationPageActions = {
    /** Called after the panel establishes a session. */
    readonly signedIn?: () => void
}

/** Props for {@link AuthenticationPageBase}. */
export type AuthenticationPageProps = {
    readonly on?: AuthenticationPageActions
}

/**
 * Draw the authentication block as the one centred surface on the route.
 *
 * @param input - {@link AuthenticationPageProps}
 */
export const AuthenticationPageBase = ({ on }: AuthenticationPageProps) => {
    const cardContent = layoutNode("authentication-panel-card", {
        panel: layoutContent("centred-page-column", () => (
            <AuthenticationPanel onSignedIn={on?.signedIn} />
        )),
    })

    return (
        <Grammar
            layout="centred-authentication-page"
            render={layoutNode("centred-authentication-page", {
                surface: layoutContent("authentication-panel-card", () => (
                    <SurfaceFormCard layout="authentication-panel-card" render={cardContent} />
                )),
            })}
        />
    )
}

/** Source-level tier marker for the authentication page. */
