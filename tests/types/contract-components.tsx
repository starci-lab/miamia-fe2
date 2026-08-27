import { Grammar } from "@/components/branches/Grammar"
import { Heading } from "@/components/leaves/Heading"
import {
    createGrammarNode,
    createLeafNode,
    type ContractComponent,
    type RenderLeaf,
} from "@/components/contracts/props"

const heading = createLeafNode("heading", {}, () => <Heading props={{ content: "Title", level: 2 }} />)
const title = createGrammarNode("title-with-end-action", { title: heading })
const smallText = createLeafNode("text", { size: "sm" }, () => null)

const acceptsTitle: ContractComponent<"title-with-end-action"> = title
const acceptsText: RenderLeaf<"text", { readonly size: "sm" }> = smallText

export const contractTypeProof = () => (
    <>
        <Grammar contract="title-with-end-action" render={acceptsTitle} />
        {/* @ts-expect-error A render function branded for another contract cannot cross this slot. */}
        <Grammar contract="title-with-baseline-fact" render={acceptsTitle} />
        {/* @ts-expect-error A bare inline callback carries no contract metadata. */}
        <Grammar contract="title-with-end-action" render={() => null} />
    </>
)

// @ts-expect-error Leaf identity is nominal even when the constrained literals are identical.
const wrongLeafName: RenderLeaf<"heading", { readonly size: "sm" }> = acceptsText
void wrongLeafName

// @ts-expect-error The contract requires the literal size "sm", not merely a text leaf.
createGrammarNode("centred-title-pair", { title: heading, description: createLeafNode("text", {}, () => null) })
