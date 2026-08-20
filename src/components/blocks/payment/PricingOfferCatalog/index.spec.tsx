/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ catalog: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() } }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/swr/useQueryMiaMiaPricingCatalogSwr", () => ({ useQueryMiaMiaPricingCatalogSwr: () => m.catalog }))
type CatalogBaseProps = { readonly state: string; readonly licenses?: Array<unknown> }
vi.mock("./component", () => ({ PricingOfferCatalogBase: (p: CatalogBaseProps) => <output>{p.state}:{p.licenses?.length ?? 0}</output> }))
import { PricingOfferCatalog } from "./index"
const ready = { membership: { enabled: true, monthlyPriceVnd: 100 }, examDownloads: { enabled: true, packages: [{ packageId: "personal", priceVnd: 200, brandPromotionMonths: 1 }, { packageId: "commercial", priceVnd: 300, brandPromotionMonths: 2 }] } }
describe("PricingOfferCatalog", () => { it("renders failed state", () => { m.catalog = { data: undefined, error: new Error("offline"), mutate: vi.fn() }; render(<PricingOfferCatalog selected="pro" onSelect={vi.fn()} />); expect(screen.getByText(/failed/)).toBeTruthy() }); it("renders loading state", () => { m.catalog = { data: undefined, error: undefined, mutate: vi.fn() }; render(<PricingOfferCatalog selected="pro" onSelect={vi.fn()} />); expect(screen.getByText(/loading/)).toBeTruthy() }); it("maps all ready offers", () => { m.catalog = { data: ready, error: undefined, mutate: vi.fn() }; render(<PricingOfferCatalog selected="pro" onSelect={vi.fn()} />); expect(screen.getByText("ready:3")).toBeTruthy() }) })
