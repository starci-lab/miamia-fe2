import { ModalBranch } from "@/components/branches/ModalBranch"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { layoutNode, renderLeaf } from "@/modules/types/layout"

/** Defines content and dismissal behavior for the coming-soon overlay. */
export type ComingSoonOverlayProps = { readonly isOpen: boolean; readonly title: string; readonly body: string; readonly closeLabel: string; readonly onDismiss: () => void }

/** Renders the pure coming-soon dialog. */
export const ComingSoonOverlayBase = (input: ComingSoonOverlayProps) => (
    <ModalBranch
        isOpen={input.isOpen}
        size="xs"
        layout="coming-soon-panel"
        render={layoutNode("coming-soon-panel", {
            title: renderLeaf("heading", {}, () => <Heading props={{ content: input.title, level: 2 }} />),
            body: renderLeaf("text", {}, () => <Text props={{ content: input.body, tone: "muted" }} />),
            action: renderLeaf("button", {}, () => <Button props={{ label: input.closeLabel, variant: "primary" }} on={{ press: input.onDismiss }} />),
        })}
        onDismiss={input.onDismiss}
    />
)

/** Declares the component architecture metadata. */
