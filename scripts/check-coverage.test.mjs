import test from "node:test"
import assert from "node:assert/strict"
import { computeMetrics } from "./check-coverage.mjs"

const coverage = {
    "/workspace/src/feature.ts": {
        statementMap: { 0: { start: { line: 10 }, end: { line: 10 } } }, s: { 0: 1 },
        fnMap: { 0: { loc: { start: { line: 10 }, end: { line: 12 } } } }, f: { 0: 1 },
        branchMap: { 0: { loc: { start: { line: 10 } } } }, b: { 0: [1, 0] },
    },
}

test("computes all four patch metrics from coverage-final", () => {
    const metrics = computeMetrics(new Map([["src/feature.ts", new Set([10])]]), coverage)
    assert.deepEqual(metrics.statements, { total: 1, covered: 1, percent: 100 })
    assert.deepEqual(metrics.functions, { total: 1, covered: 1, percent: 100 })
    assert.deepEqual(metrics.lines, { total: 1, covered: 1, percent: 100 })
    assert.deepEqual(metrics.branches, { total: 2, covered: 1, percent: 50 })
})

test("does not turn a missing branch denominator into a passing metric", () => {
    const noBranches = { ...coverage[Object.keys(coverage)[0]], branchMap: {}, b: {} }
    const metrics = computeMetrics(new Map([["src/feature.ts", new Set([10])]]), { "/workspace/src/feature.ts": noBranches })
    assert.equal(metrics.branches.percent, 0)
})

test("rejects changed files absent from coverage-final", () => {
    assert.throws(() => computeMetrics(new Map([["src/missing.ts", new Set([1])]]), {}), /no record/)
})
