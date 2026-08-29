import { SurfaceFormCard } from "@/components/branches/SurfaceFormCard"
import { EmptyNotice } from "@/components/composites/EmptyNotice"
import { Field } from "@/components/composites/Field"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Label } from "@/components/leaves/Label"
import { Text } from "@/components/leaves/Text"
import { Textarea } from "@/components/leaves/Textarea"
import { renderComposite, layoutNode, renderLeaf } from "@/modules/types/layout"

/** User-entered values retained across validation and retry. */
export type WhiteLabelInquiryValues = { readonly name: string; readonly email: string; readonly message: string }
/** Field-scoped validation messages for the inquiry form. */
export type WhiteLabelInquiryErrors = Partial<Record<keyof WhiteLabelInquiryValues, string>>
/** Pure inquiry form state, copy and actions. */
export type WhiteLabelInquiryPanelProps = { readonly state: "idle" | "invalid" | "submitting" | "succeeded" | "failed"; readonly values: WhiteLabelInquiryValues; readonly errors: WhiteLabelInquiryErrors; readonly copy: Readonly<Record<string, string>>; readonly onChange: (field: keyof WhiteLabelInquiryValues, value: string) => void; readonly onSubmit: () => void; readonly onDismiss: () => void }
/** The result notice for a settled submission, or nothing while the form is still open. */
const resolveNotice = (input: WhiteLabelInquiryPanelProps) => {
    if (input.state === "succeeded") {
        return { notice: renderComposite("empty-notice", {}, () => <EmptyNotice props={{ message: input.copy.succeeded }} />) }
    }
    if (input.state === "failed") {
        return {
            notice: renderComposite("empty-notice", {}, () => (
                <EmptyNotice props={{ message: input.copy.failed, actionLabel: input.copy.retry }} on={{ act: input.onSubmit }} />
            )),
        }
    }
    return {}
}

/** Renders the complete anonymous White-label inquiry form. */
export const WhiteLabelInquiryPanelBase = (input: WhiteLabelInquiryPanelProps) => <SurfaceFormCard layout="white-label-inquiry-panel" render={layoutNode("white-label-inquiry-panel", {
    title: renderLeaf("heading", {}, () => <Heading props={{ content: input.copy.title, level: 2 }} />),
    body: renderLeaf("text", {}, () => <Text props={{ content: input.copy.body, tone: "muted" }} />),
    name: renderComposite("field", {}, () => <Field props={{ id: "white-label-name", name: "name", label: input.copy.name, placeholder: input.copy.namePlaceholder, hint: input.errors.name, isInvalid: input.errors.name !== undefined, disabled: input.state === "submitting" }} on={{ change: (value) => input.onChange("name", value) }} />),
    email: renderComposite("field", {}, () => <Field props={{ id: "white-label-email", name: "email", label: input.copy.email, kind: "email", placeholder: input.copy.emailPlaceholder, hint: input.errors.email, isInvalid: input.errors.email !== undefined, disabled: input.state === "submitting" }} on={{ change: (value) => input.onChange("email", value) }} />),
    messageLabel: renderLeaf("label", {}, () => <Label props={{ htmlFor: "white-label-message", content: input.copy.message }} />),
    message: renderLeaf("textarea", {}, () => <Textarea props={{ id: "white-label-message", name: "message", label: input.copy.message, placeholder: input.copy.messagePlaceholder, defaultValue: input.values.message, isInvalid: input.errors.message !== undefined, disabled: input.state === "submitting" }} on={{ change: (value) => input.onChange("message", value) }} />),
    ...(input.errors.message === undefined ? {} : { messageHint: renderLeaf("text", {}, () => <Text props={{ content: input.errors.message, size: "xs", live: "assertive" }} />) }),
    ...resolveNotice(input),
    action: [
        renderLeaf("button", {}, () => <Button props={{ label: input.copy.submit, variant: "primary", isPending: input.state === "submitting", disabled: input.state === "succeeded" }} on={{ press: input.onSubmit }} />),
        renderLeaf("button", {}, () => <Button props={{ label: input.copy.cancel, variant: "ghost", disabled: input.state === "submitting" }} on={{ press: input.onDismiss }} />),
    ],
})} />
/** Declares the pure inquiry block boundary. */
