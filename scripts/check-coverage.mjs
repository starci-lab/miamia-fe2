#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const normalise = (value) => resolve(value).replaceAll("\\", "/")

export function computeMetrics(changedFiles, coverage) {
    const totals = { statements: [0, 0], functions: [0, 0], lines: [0, 0], branches: [0, 0] }
    for (const [name, changedLines] of changedFiles) {
        const record = Object.entries(coverage).find(([path]) => normalise(path).endsWith(`/${name}`))?.[1]
        if (!record) throw new Error(`coverage-final has no record for changed production file ${name}`)
        const lineSet = new Set(changedLines); const statementLines = new Map()
        for (const [id, location] of Object.entries(record.statementMap ?? {})) {
            const line = location.start.line
            if (!lineSet.has(line)) continue
            totals.statements[0] += 1; totals.statements[1] += (record.s?.[id] ?? 0) > 0 ? 1 : 0
            statementLines.set(line, (statementLines.get(line) ?? false) || (record.s?.[id] ?? 0) > 0)
        }
        for (const covered of statementLines.values()) { totals.lines[0] += 1; totals.lines[1] += covered ? 1 : 0 }
        for (const [id, fn] of Object.entries(record.fnMap ?? {})) {
            if (![...lineSet].some((line) => line >= fn.loc.start.line && line <= fn.loc.end.line)) continue
            totals.functions[0] += 1; totals.functions[1] += (record.f?.[id] ?? 0) > 0 ? 1 : 0
        }
        for (const [id, branch] of Object.entries(record.branchMap ?? {})) {
            if (!lineSet.has(branch.loc.start.line)) continue
            const hits = record.b?.[id] ?? []; totals.branches[0] += hits.length
            totals.branches[1] += hits.filter((hit) => hit > 0).length
        }
    }
    return Object.fromEntries(Object.entries(totals).map(([metric, [total, covered]]) => [metric, { total, covered, percent: total ? covered / total * 100 : 0 }]))
}

function changedProduction(baseSha) {
    const diff = execFileSync("git", ["diff", "--unified=0", `${baseSha}...HEAD`, "--", "src"], { encoding: "utf8" })
    const added = new Map(); let file = null
    for (const line of diff.split(/\r?\n/)) {
        if (line.startsWith("+++ b/")) file = line.slice(6)
        else if (line.startsWith("@@") && file) {
            const match = line.match(/\+(\d+)(?:,(\d+))?/) 
            if (!match) continue
            const start = Number(match[1]); const count = Number(match[2] ?? 1); const lines = added.get(file) ?? new Set()
            for (let lineNo = start; lineNo < start + count; lineNo += 1) lines.add(lineNo)
            added.set(file, lines)
        }
    }
    return new Map([...added].filter(([name]) => /\.(ts|tsx)$/.test(name) && !/\.spec\.(ts|tsx)$/.test(name)))
}

export function main(argv = process.argv.slice(2), env = process.env) {
    const baseArg = argv.indexOf("--base"); const baseSha = baseArg >= 0 ? argv[baseArg + 1] : env.COVERAGE_BASE_SHA
    if (!baseSha || !/^[0-9a-f]{7,64}$/i.test(baseSha)) throw new Error("COVERAGE_BASE_SHA or --base must name the explicit comparison commit")
    if (!existsSync("coverage/coverage-final.json")) throw new Error("coverage/coverage-final.json is missing")
    const changed = changedProduction(baseSha); mkdirSync("coverage", { recursive: true })
    if (changed.size === 0) {
        writeFileSync("coverage/patch-summary.json", `${JSON.stringify({ baseSha, status: "not-applicable", reason: "no authored production diff", metrics: null }, null, 2)}\n`)
        console.log(`Patch coverage: N/A (COVERAGE_BASE_SHA ${baseSha} has no authored production diff)`); return 0
    }
    const metrics = computeMetrics(changed, JSON.parse(readFileSync("coverage/coverage-final.json", "utf8")))
    writeFileSync("coverage/patch-summary.json", `${JSON.stringify({ baseSha, status: "measured", metrics }, null, 2)}\n`)
    console.log(`Patch coverage from ${baseSha}: ${Object.entries(metrics).map(([name, value]) => `${name} ${value.percent.toFixed(2)}% (${value.covered}/${value.total})`).join(", ")}`)
    return Object.values(metrics).every(({ percent }) => percent >= 90) ? 0 : 1
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll("\\", "/")}`) process.exitCode = main()
