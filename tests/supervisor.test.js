import { test } from 'node:test'
import assert from 'node:assert/strict'
import { supervisorDecision } from '../dist/lib/supervisor.js'

test('approves when checks pass', () => {
  const decision = supervisorDecision({
    checks: { aceOk: true, varOk: true, degraded: false },
    order: { side: 'buy', qty: 1 },
    currentQty: 0,
  })
  assert.equal(decision, 'APPROVE')
})

test('allows only reductions when degraded', () => {
  const decision = supervisorDecision({
    checks: { aceOk: false, varOk: false, degraded: true },
    order: { side: 'sell', qty: 5 },
    currentQty: 10,
  })
  assert.equal(decision, 'APPROVE_REDUCTION_ONLY')
})
