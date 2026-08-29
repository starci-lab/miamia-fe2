import { CLASS_NAME_1 } from "./classNames"
import type { ComponentProps } from "@/modules/types/layout"

/** Intrinsic read-only document carried by the public-CV paper layout. */
export type ProfileCvDocumentData = { readonly title: string, readonly src?: string }
/** Input for the read-only public-CV document. */
export type ProfileCvDocumentProps = ComponentProps<ProfileCvDocumentData>

/** Embed one compiled public CV without editor controls. */
export const ProfileCvDocument = ({ props, isLoading = false }: ProfileCvDocumentProps) => (
    <iframe

        data-component="ProfileCvDocument"
        data-loading={isLoading ? "true" : "false"}
        title={props.title}
        src={isLoading ? undefined : props.src}
        aria-busy={isLoading ? true : undefined}
        className={CLASS_NAME_1}
    />
)

/** Source-level tier marker. */
