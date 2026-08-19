import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { GraphQLResponse, LookupQueryParams } from "../types"
import type { HeadhuntingCompany } from "./query-headhunting-companies"

interface QueryHeadhuntingCompanyRequest {
    readonly id?: string
    readonly displayId?: string
}

interface QueryHeadhuntingCompanyResponse {
    readonly headhuntingCompany: GraphQLResponse<HeadhuntingCompany>
}

type QueryHeadhuntingCompanyVariables = { readonly request: QueryHeadhuntingCompanyRequest }

const query1: TypedDocumentNode<QueryHeadhuntingCompanyResponse, QueryHeadhuntingCompanyVariables> = gql`
    query HeadhuntingCompany($request: HeadhuntingCompanyRequest!) {
        headhuntingCompany(request: $request) {
            success
            message
            error
            data {
                id
                displayId
                title
                description
                websiteUrl
                logoUrl
                address
                phone
                email
                facebookUrl
                linkedinUrl
                sortIndex
            }
        }
    }
`

export enum QueryHeadhuntingCompany { Query1 = "query1" }

const queryHeadhuntingCompanyMap: Record<QueryHeadhuntingCompany, TypedDocumentNode<QueryHeadhuntingCompanyResponse, QueryHeadhuntingCompanyVariables>> = {
    [QueryHeadhuntingCompany.Query1]: query1,
}

/** Reads one company by the route's proven UUID. */
export const queryHeadhuntingCompany = async ({
    query = QueryHeadhuntingCompany.Query1,
    request,
    headers,
    signal,
    debug,
}: LookupQueryParams<QueryHeadhuntingCompany, QueryHeadhuntingCompanyRequest>) => {
    const apollo = createApolloClient({ withAuth: true, headers, signal, debug })
    return apollo.query({
        query: queryHeadhuntingCompanyMap[query],
        variables: { request },
    })
}
