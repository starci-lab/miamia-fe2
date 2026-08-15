/** Resolve the public Colyseus endpoint. No secret belongs in this URL. */
export const getColyseusUrl = (): string => process.env.NEXT_PUBLIC_COLYSEUS_URL || "ws://localhost:2638"

