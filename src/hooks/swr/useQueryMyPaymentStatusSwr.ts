import { useRef } from "react"
import useSWR from "swr"
import { queryMyPaymentStatus } from "@/modules/api/graphql/queries/query-my-payment-status"
import type { MyPaymentStatusData } from "@/modules/api/graphql/queries/types/payment-status"

const MAX_POLLS = 15
/** Polls a pending transaction at two-second intervals with a fixed upper bound. */
export const useQueryMyPaymentStatusSwr = (referenceId?: string) => {
    const polls = useRef(0)
    return useSWR<MyPaymentStatusData | null>(
        referenceId === undefined || referenceId === "" ? null : ["QUERY_MY_PAYMENT_STATUS", referenceId],
        async () => {
            polls.current += 1
            const envelope = (await queryMyPaymentStatus({ referenceId })).data?.myPaymentStatus
            if (envelope?.success !== true || envelope.data === undefined) throw new Error(envelope?.message ?? "Payment status unavailable")
            return envelope.data
        },
        { refreshInterval: (data) => data?.status === "pending" && polls.current < MAX_POLLS ? 2_000 : 0 },
    )
}
