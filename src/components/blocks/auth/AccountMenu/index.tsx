import { AccountMenuBase, type AccountMenuProps } from "./component"

/**
 * Composition-facing account-menu block.
 *
 * ShellNav already resolves this shared navigation copy and owns the authentication overlays, so
 * this half receives those resolved values and delegates the complete product sentence to its
 * pure twin.
 */
export const AccountMenu = (input: AccountMenuProps) => <AccountMenuBase {...input} />

/** Source-level tier marker for the account-menu block. */
