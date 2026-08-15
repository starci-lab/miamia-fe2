#!/usr/bin/env node
/** Start local Next with ports forced from MiaMia's owning backend registry. */

import {
    readFileSync,
} from "node:fs"
import {
    dirname, resolve,
} from "node:path"
import {
    spawn, spawnSync,
} from "node:child_process"
import {
    fileURLToPath,
} from "node:url"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const registryPath = resolve(repoRoot, "../mia-mia-backend/metadata.json")
const syncScript = resolve(repoRoot, "scripts/sync-ports.mjs")
const nextBin = resolve(repoRoot, "node_modules/next/dist/bin/next")

const sync = spawnSync(process.execPath, [syncScript], {
    cwd: repoRoot,
    stdio: "inherit",
})
if (sync.status !== 0) process.exit(sync.status ?? 1)

const registry = JSON.parse(readFileSync(registryPath, "utf8"))
const webPort = registry.ports?.web
const apiPort = registry.ports?.api
const colyseusPort = registry.ports?.colyseus
if (!Number.isInteger(webPort) || !Number.isInteger(apiPort) || !Number.isInteger(colyseusPort)) {
    throw new Error("MiaMia registry must declare numeric ports.web, ports.api and ports.colyseus")
}

const child = spawn(process.execPath, [nextBin, "dev", "--hostname", "localhost", "--port", String(webPort)], {
    cwd: repoRoot,
    env: {
        ...process.env,
        NEXT_PUBLIC_API_GRAPHQL_BASE_URL: `http://localhost:${apiPort}/graphql`,
        NEXT_PUBLIC_COLYSEUS_URL: `ws://localhost:${colyseusPort}`,
    },
    stdio: "inherit",
})

for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal))
}
child.on("exit", (code) => process.exit(code ?? 1))
