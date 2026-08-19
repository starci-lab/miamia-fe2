#!/usr/bin/env node
import { spawn } from "node:child_process"

const port = Number(process.env.PORT ?? 3071)
const baseUrl = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
})

let output = ""
server.stdout.on("data", (chunk) => { output += chunk.toString() })
server.stderr.on("data", (chunk) => { output += chunk.toString() })

const stop = () => { if (!server.killed) server.kill() }
process.on("exit", stop)
process.on("SIGINT", () => { stop(); process.exit(130) })
process.on("SIGTERM", () => { stop(); process.exit(143) })

try {
    let response
    for (let attempt = 0; attempt < 60; attempt += 1) {
        try {
            response = await fetch(`${baseUrl}/en`)
            if (response.status < 500) break
        } catch { /* server is still starting */ }
        await new Promise((resolve) => setTimeout(resolve, 500))
    }
    if (!response) throw new Error(`server did not become ready\n${output}`)
    const body = await response.text()
    if (response.status !== 200) throw new Error(`GET /en returned ${response.status}\n${body.slice(0, 500)}`)
    if (!body.includes("<!DOCTYPE html>") && !body.includes("<html")) {
        throw new Error("GET /en did not return an HTML document")
    }
    console.log(`HTTP E2E passed: GET /en -> ${response.status}`)
} finally {
    stop()
}
