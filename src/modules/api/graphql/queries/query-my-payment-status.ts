import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MyPaymentStatusRequest, QueryMyPaymentStatusResponse } from "./types/payment-status"

type MyPaymentStatusVariables = { readonly request: MyPaymentStatusRequest }

const query: TypedDocumentNode<QueryMyPaymentStatusResponse, MyPaymentStatusVariables> = gql`query MyPaymentStatus($request: MyPaymentStatusRequest!) { myPaymentStatus(request: $request) { success message error data { transactionId referenceId status purchaseKind paymentType amount examDownloadPackage createdAt updatedAt } } }`
/** Reads one persisted payment transaction owned by the viewer. */
export const queryMyPaymentStatus = async (request: MyPaymentStatusRequest) => createApolloClient({ withAuth: true }).query({ query, variables: { request }, fetchPolicy: "network-only" })
