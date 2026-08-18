import { ModalBranch } from "@/components/branches/ModalBranch"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"

/** Defines content and dismissal behavior for the coming-soon overlay. */
export type ComingSoonOverlayProps = { readonly isOpen: boolean; readonly title: string; readonly body: string; readonly closeLabel: string; readonly onDismiss: () => void }

/** Renders the pure coming-soon dialog. */
export const _ComingSoonOverlay = (input: ComingSoonOverlayProps) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="xs"
        contract="coming-soon-panel"
        render={defineContractComponent("coming-soon-panel", {
            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: input.title, level: 2 }} />),
            body: defineLeafComponent("text", {}, () => <Text props={{ content: input.body, tone: "muted" }} />),
            action: defineLeafComponent("button", {}, () => <Button props={{ label: input.closeLabel, variant: "primary" }} on={{ press: input.onDismiss }} />),
        })}
        onDismiss={input.onDismiss}
    />
)

/** Declares the component architecture metadata. */
export const meta = { shape: "overlay", world: "pure", domain: "app" } as const
