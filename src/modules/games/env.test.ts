import { afterEach, describe, expect, it } from "vitest"; import { getColyseusUrl } from "./env"
const original = process.env.NEXT_PUBLIC_COLYSEUS_URL
afterEach(() => { process.env.NEXT_PUBLIC_COLYSEUS_URL = original })
describe("getColyseusUrl", () => { it("uses the separate Colyseus endpoint", () => { process.env.NEXT_PUBLIC_COLYSEUS_URL = "ws://localhost:2638"; expect(getColyseusUrl()).toBe("ws://localhost:2638"); expect(getColyseusUrl()).not.toContain("graphql") }) })
