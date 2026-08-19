import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { _PricingOfferCatalog } from "./component"
const offer = { id: "pro" as const, badge: "Pro", title: "Pro", price: "100", body: "Good", benefits: ["Benefit"], action: "Choose", enabled: true }
describe("_PricingOfferCatalog", () => {
    it("renders loading and failed notices", () => { const onRetry = vi.fn(); expect(renderToStaticMarkup(<_PricingOfferCatalog state="loading" title="Offers" description="Desc" licenseTitle="Licenses" selected="pro" notice="Loading" retryLabel="Retry" onSelect={vi.fn()} onRetry={onRetry} />)).toContain("Loading"); expect(renderToStaticMarkup(<_PricingOfferCatalog state="failed" title="Offers" description="Desc" licenseTitle="Licenses" selected="pro" notice="Failed" retryLabel="Retry" onSelect={vi.fn()} onRetry={onRetry} />)).toContain("Retry") })
    it("renders learning and license offers", () => { const html = renderToStaticMarkup(<_PricingOfferCatalog state="ready" title="Offers" description="Desc" licenseTitle="Licenses" selected="pro" learning={offer} licenses={[{ ...offer, id: "personal", enabled: false }]} notice="" retryLabel="Retry" onSelect={vi.fn()} onRetry={vi.fn()} />); expect(html).toContain("Pro"); expect(html).toContain("Benefit") })
})
