import { SurfaceCard } from "@/components/branches/SurfaceCard"
import { Badge } from "@/components/leaves/Badge"
import { Button } from "@/components/leaves/Button"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { createGrammarNode, createLeafNode } from "@/components/contracts/props"

/** Resolved copy and action for one persisted transaction state. */
export type PaymentReturnStatusProps = { readonly badge: string; readonly title: string; readonly body: string; readonly tone: "neutral" | "success" | "warning" | "danger"; readonly action?: string; readonly pending?: boolean; readonly onAction?: () => void }
/** Renders provider-confirmed payment status without deriving state from the URL. */
export const PaymentReturnStatusBase = (input: PaymentReturnStatusProps) => <SurfaceCard contract="payment-return-status" render={createGrammarNode("payment-return-status", {
    badge: createLeafNode("badge", {}, () => <Badge props={{ content: input.badge, tone: input.tone }} />),
    title: createLeafNode("heading", {}, () => <Heading props={{ content: input.title, level: 2 }} />),
    body: createLeafNode("text", {}, () => <Text props={{ content: input.body, tone: "muted", live: "polite" }} />),
    ...(input.action === undefined ? {} : { action: createLeafNode("button", {}, () => <Button props={{ label: input.action ?? "", variant: "outline", isPending: input.pending }} on={{ press: input.onAction }} />) }),
})} />
/** Declares the pure payment status boundary. */
export const meta = { shape: "block", world: "pure", domain: "payment" } as const
