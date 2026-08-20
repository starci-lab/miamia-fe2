/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PaymentReturnStatusBase } from "./component"
describe("PaymentReturnStatusBase", () => { it("renders copy and action", () => { render(<PaymentReturnStatusBase badge="Paid" title="Done" body="Thanks" tone="success" action="Continue" />); expect(screen.getByText("Done")).toBeTruthy(); expect(screen.getByText("Continue")).toBeTruthy() }); it("renders without optional action", () => { render(<PaymentReturnStatusBase badge="Pending" title="Wait" body="Soon" tone="warning" />); expect(screen.getByText("Wait")).toBeTruthy() }) })
