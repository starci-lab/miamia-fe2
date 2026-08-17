import { gql } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { MyPaymentStatusRequest, QueryMyPaymentStatusResponse } from "./types/payment-status"

const query = gql`query MyPaymentStatus($request: MyPaymentStatusRequest!) { myPaymentStatus(request: $request) { success message error data { transactionId referenceId status purchaseKind paymentType amount examDownloadPackage createdAt updatedAt } } }`
/** Reads one persisted payment transaction owned by the viewer. */
export const queryMyPaymentStatus = async (request: MyPaymentStatusRequest) => createApolloClient({ withAuth: true }).query<QueryMyPaymentStatusResponse>({ query, variables: { request }, fetchPolicy: "network-only" })
