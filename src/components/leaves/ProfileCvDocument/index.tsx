import { CLASS_NAME_1 } from './styles'
import type { ComponentProps } from "@/components/contracts/props"

/** Intrinsic read-only document carried by the public-CV paper contract. */
export type ProfileCvDocumentData = { readonly title: string, readonly src?: string }
/** Input for the read-only public-CV document. */
export type ProfileCvDocumentProps = ComponentProps<ProfileCvDocumentData>

/** Embed one compiled public CV without editor controls. */
export const ProfileCvDocument = ({ props, isLoading = false }: ProfileCvDocumentProps) => (
    <iframe
        data-tier="leaf"
        data-component="ProfileCvDocument"
        data-loading={isLoading ? "true" : "false"}
        title={props.title}
        src={isLoading ? undefined : props.src}
        aria-busy={isLoading ? true : undefined}
        className={CLASS_NAME_1}
    />
)

/** Source-level tier marker. */
export const meta = { shape: "leaf", world: "pure" } as const
