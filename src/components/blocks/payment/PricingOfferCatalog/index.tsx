"use client"

import { useTranslations } from "next-intl"
import { useQueryMiaMiaPricingCatalogSwr } from "@/hooks/swr/useQueryMiaMiaPricingCatalogSwr"
import type { MiaMiaOfferId, PricingExamDownloadPackage } from "@/modules/api/graphql/queries/types/miamia-pricing"
import { PricingOfferCatalogBase, type PricingOfferView } from "./component"

/** Selected URL offer and the page-owned intent callback. */
export type PricingOfferCatalogConnectedProps = { readonly selected: MiaMiaOfferId; readonly onSelect: (offer: MiaMiaOfferId) => void }
const money = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount)

/** Resolves server pricing and localized copy for the pure offer catalog. */
export const PricingOfferCatalog = ({ selected, onSelect }: PricingOfferCatalogConnectedProps) => {
    const t = useTranslations("miamia.pricing")
    const catalog = useQueryMiaMiaPricingCatalogSwr()
    if (catalog.error) return <PricingOfferCatalogBase state="failed" title={t("title")} description={t("description")} licenseTitle={t("licenseTitle")} selected={selected} notice={t("failed")} retryLabel={t("retry")} onSelect={onSelect} onRetry={() => void catalog.mutate()} />
    if (catalog.data === undefined || catalog.data === null) return <PricingOfferCatalogBase state="loading" title={t("title")} description={t("description")} licenseTitle={t("licenseTitle")} selected={selected} notice={t("loading")} retryLabel={t("retry")} onSelect={onSelect} onRetry={() => void catalog.mutate()} />
    const data = catalog.data
    const membership = data.membership
    const packageById = new Map(data.examDownloads?.packages.map((item) => [item.packageId, item]))
    const license = (id: "personal" | "commercial"): PricingOfferView => {
        const item: PricingExamDownloadPackage | undefined = packageById.get(id)
        return { id, badge: t(`${id}.badge`), title: t(`${id}.title`), price: item === undefined ? t("unavailable") : t("lifetimePrice", { price: money(item.priceVnd) }), body: t(`${id}.body`), benefits: [t(`${id}.benefitOne`), t(`${id}.benefitTwo`), t(`${id}.benefitThree`, { months: item?.brandPromotionMonths ?? 0 })], action: t(`${id}.action`), enabled: data.examDownloads?.enabled === true && item !== undefined }
    }
    const learning: PricingOfferView = { id: "pro", badge: t("pro.badge"), title: t("pro.title"), price: t("monthlyPrice", { price: money(membership.monthlyPriceVnd) }), body: t("pro.body"), benefits: [t("pro.benefitOne"), t("pro.benefitTwo"), t("pro.benefitThree")], action: t("pro.action"), enabled: membership.enabled }
    const whiteLabel: PricingOfferView = { id: "white-label", badge: t("whiteLabel.badge"), title: t("whiteLabel.title"), price: t("whiteLabel.price"), body: t("whiteLabel.body"), benefits: [t("whiteLabel.benefitOne"), t("whiteLabel.benefitTwo"), t("whiteLabel.benefitThree")], action: t("whiteLabel.action"), enabled: true }
    return <PricingOfferCatalogBase state="ready" title={t("title")} description={t("description")} licenseTitle={t("licenseTitle")} selected={selected} learning={learning} licenses={[license("personal"), license("commercial"), whiteLabel]} notice="" retryLabel={t("retry")} onSelect={onSelect} onRetry={() => void catalog.mutate()} />
}

/** Declares the connected pricing block boundary. */
export const meta = { shape: "block", world: "connected", domain: "payment" } as const
