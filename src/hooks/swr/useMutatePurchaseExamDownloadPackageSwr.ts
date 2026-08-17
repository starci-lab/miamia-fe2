import useSWRMutation from "swr/mutation"
import { mutationPurchaseExamDownloadPackage } from "@/modules/api/graphql/mutations/mutation-purchase-exam-download-package"
import type { PurchaseExamDownloadPackageRequest } from "@/modules/api/graphql/mutations/types/purchase-exam-download-package"

type Options = { readonly arg: PurchaseExamDownloadPackageRequest }
/** Owns the in-flight state of one download-license checkout request. */
export const useMutatePurchaseExamDownloadPackageSwr = () => useSWRMutation("MUTATE_PURCHASE_EXAM_DOWNLOAD_PACKAGE", async (_key: string, { arg }: Options) => mutationPurchaseExamDownloadPackage(arg))
