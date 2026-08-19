import { gql, type OperationVariables, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MutationPurchaseExamDownloadPackageResponse, PurchaseExamDownloadPackageRequest } from "./types/purchase-exam-download-package"

const mutation: TypedDocumentNode<MutationPurchaseExamDownloadPackageResponse, OperationVariables> = gql`mutation PurchaseExamDownloadPackage($request: PurchaseExamDownloadPackageRequest!) { purchaseExamDownloadPackage(request: $request) { success message error data { checkoutUrl referenceId transactionId amount packageId } } }`

/** Starts an authenticated download-license checkout. */
export const mutationPurchaseExamDownloadPackage = async (request: PurchaseExamDownloadPackageRequest) => createApolloClient({ withAuth: true }).mutate({ mutation, variables: { request } })

