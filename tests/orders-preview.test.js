import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HttpException } from '@nestjs/common';
import { OrdersService } from '../dist/server/src/orders.service.js';

const okPolicy = { verdict_id: 'v1', allow: true, reasons: [] };
const okProof = { proof_id: 'p1', hash: '0x', ok: true, var_value: 0 };

test('returns preview when checks pass', async () => {
  const svc = new OrdersService({
    ace: { evaluate: async () => ({ policy: okPolicy, degraded: false }) },
    var: { prove: async () => ({ proof: okProof, degraded: false }) },
  });
  const res = await svc.preview({ symbol: 'AAPL', side: 'buy', qty: 1 }, 0);
  assert.equal(res.action.symbol, 'AAPL');
  assert.equal(res.policy.verdict_id, 'v1');
  assert.equal(res.proof.proof_id, 'p1');
});

test('throws in safe mode when services degraded', async () => {
  const svc = new OrdersService({
    ace: { evaluate: async () => ({ policy: null, degraded: true }) },
    var: { prove: async () => ({ proof: null, degraded: true }) },
  });
  await assert.rejects(
    () => svc.preview({ symbol: 'AAPL', side: 'buy', qty: 1 }, 0),
    (err) => err instanceof HttpException && err.getStatus() === 409,
  );
});

