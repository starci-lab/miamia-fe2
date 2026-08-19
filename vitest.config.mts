import {
    fileURLToPath,
} from "node:url"
import react from "@vitejs/plugin-react"
import {
    defineConfig,
} from "vitest/config"

/**
 * Vitest configuration for the twin-test convention: every source file has a
 * sibling `*.test.ts(x)` beside it, so tests are discovered from `src/` rather
 * than from a separate test root.
 *
 * `jsdom` gives the component tests a DOM; `vitest.setup.ts` installs the
 * jest-dom matchers. The `@/` alias mirrors the one in `tsconfig.json` so a test
 * imports a module by exactly the path the source does.
 */
export default defineConfig({
    plugins: [
        react(),
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: [
            "./vitest.setup.ts",
        ],
        include: [
            "src/**/*.test.{ts,tsx}",
        ],
        coverage: {
            provider: "v8",
            reporter: [
                "text-summary",
                "lcov",
            ],
            reportsDirectory: "./coverage",
            include: [
                "src/**/*.{ts,tsx}",
            ],
            exclude: [
                "src/**/*.test.{ts,tsx}",
                "src/**/*.d.ts",
            ],
        },
        server: {
            deps: {
                // `next` ships no `exports` map, so Vitest's native resolver — which externalizes
                // node_modules from Vite's normal (extension-resolving) pipeline by default — fails
                // on next-intl's bare `next/navigation` import. Inlining next-intl routes it through
                // Vite's own resolver instead, where extension resolution applies.
                inline: ["next-intl"],
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
