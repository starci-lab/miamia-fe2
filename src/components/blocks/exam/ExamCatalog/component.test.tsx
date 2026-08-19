import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { _ExamCatalog } from "./component"
const data = { title: "Exams", description: "Practice", premiumTitle: "Premium", premiumBody: "More", premiumAction: "Upgrade", searchLabel: "Search", searchPlaceholder: "Search", searchClearLabel: "Clear", collectionLabel: "Collection", selectedCollectionId: "all", collections: [{ id: "all", label: "All", count: 1 }], sectionTitle: "Papers", countLabel: "1 paper", papers: [], page: 1, totalPages: 1, pageLabel: "Pages", previousLabel: "Previous", nextLabel: "Next", emptyMessage: "Empty", failedMessage: "Failed", retryLabel: "Retry" }
describe("_ExamCatalog", () => {
    it("renders loading, empty and failed notices", () => { const on = { search: vi.fn(), selectCollection: vi.fn(), changePage: vi.fn(), requestPremium: vi.fn(), retry: vi.fn() }; expect(renderToStaticMarkup(<_ExamCatalog state="loading" props={data} on={on} />)).toContain("Exams"); expect(renderToStaticMarkup(<_ExamCatalog state="empty" props={data} on={on} />)).toContain("Empty"); expect(renderToStaticMarkup(<_ExamCatalog state="failed" props={data} on={on} />)).toContain("Failed") })
})
