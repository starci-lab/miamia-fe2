/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
const m = vi.hoisted(() => ({ catalog: { data: undefined as unknown, error: undefined as unknown, mutate: vi.fn() } }))
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/swr/useQueryMiaMiaPricingCatalogSwr", () => ({ useQueryMiaMiaPricingCatalogSwr: () => m.catalog }))
type CatalogBaseProps = { readonly state: string; readonly licenses?: Array<unknown>; readonly onRetry?: () => void }
vi.mock("./component", () => ({ PricingOfferCatalogBase: (p: CatalogBaseProps) => <><output>{p.state}:{p.licenses?.length ?? 0}</output>{p.onRetry && <button onClick={p.onRetry}>retry</button>}</> }))
import { PricingOfferCatalog } from "./index"
const ready = { membership: { enabled: true, monthlyPriceVnd: 100 }, examDownloads: { enabled: true, packages: [{ packageId: "personal", priceVnd: 200, brandPromotionMonths: 1 }, { packageId: "commercial", priceVnd: 300, brandPromotionMonths: 2 }] } }
describe("PricingOfferCatalog", () => { it("renders failed state and retries", () => { const mutate = vi.fn(); m.catalog = { data: undefined, error: new Error("offline"), mutate }; render(<PricingOfferCatalog selected="pro" onSelect={vi.fn()} />); expect(screen.getByText(/failed/)).toBeTruthy(); screen.getByText("retry").click(); expect(mutate).toHaveBeenCalled() }); it("renders loading state and retries", () => { const mutate = vi.fn(); m.catalog = { data: undefined, error: undefined, mutate }; render(<PricingOfferCatalog selected="pro" onSelect={vi.fn()} />); expect(screen.getByText(/loading/)).toBeTruthy(); screen.getByText("retry").click(); expect(mutate).toHaveBeenCalled() }); it("maps all ready offers", () => { const mutate = vi.fn(); m.catalog = { data: ready, error: undefined, mutate }; render(<PricingOfferCatalog selected="pro" onSelect={vi.fn()} />); expect(screen.getByText("ready:3")).toBeTruthy(); screen.getByText("retry").click(); expect(mutate).toHaveBeenCalled() }) })
