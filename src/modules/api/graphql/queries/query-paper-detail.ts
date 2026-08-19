import { gql, type TypedDocumentNode } from "@apollo/client"
import { createApolloClient } from "../clients/create-apollo-client"
import type { QueryPaperDetailResponse } from "./types/exam"

type PaperDetailVariables = { readonly slug: string }

const query: TypedDocumentNode<QueryPaperDetailResponse, PaperDetailVariables> = gql`query PaperDetail($slug: String!) { paperDetail(slug: $slug) { success message error data { id slug kind level durationMinutes titleVi titleEn descriptionVi descriptionEn questions { position marks questionId slug stem optionA optionB optionC optionD skill passage { slug title body } } } } }`

/** Fetches the complete exam paper identified by its slug. */
export const queryPaperDetail = async (slug: string) => createApolloClient({ withAuth: true }).query({ query, variables: { slug } })
