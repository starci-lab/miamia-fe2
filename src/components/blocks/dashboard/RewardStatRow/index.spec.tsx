/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
type RewardBaseProps = { readonly state: string; readonly props?: { readonly label: string; readonly value?: string } }
const m = vi.hoisted(() => ({ wallet: { data: undefined as unknown, error: undefined as unknown } })); vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key })); vi.mock("@/hooks", () => ({ useQueryMyRewardWalletSwr: () => m.wallet })); vi.mock("./component", () => ({ RewardStatRowBase: (p: RewardBaseProps) => <output>{p.state}</output> })); import { RewardStatRow } from "./index"
describe("RewardStatRow", () => { it("renders pending", () => { m.wallet = { data: undefined, error: undefined }; render(<RewardStatRow />); expect(screen.getByText("pending")).toBeTruthy() }); it("renders empty", () => { m.wallet = { data: undefined, error: new Error("x") }; render(<RewardStatRow />); expect(screen.getByText("empty")).toBeTruthy() }); it("renders settled", () => { m.wallet = { data: { balance: 5 }, error: undefined }; render(<RewardStatRow />); expect(screen.getByText("settled")).toBeTruthy() }) })
