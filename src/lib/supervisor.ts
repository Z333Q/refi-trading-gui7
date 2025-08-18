export function isReduction(currentQty: number, side: 'buy' | 'sell', qty: number): boolean {
  const nextQty = currentQty + (side === 'buy' ? +qty : -qty)
  return Math.abs(nextQty) < Math.abs(currentQty)
}

export interface SupervisorDecisionCtx {
  checks: { aceOk: boolean; varOk: boolean; degraded: boolean }
  order: { side: 'buy' | 'sell'; qty: number }
  currentQty: number
}

export function supervisorDecision(ctx: SupervisorDecisionCtx): 'APPROVE' | 'REJECT' | 'APPROVE_REDUCTION_ONLY' {
  const { aceOk, varOk, degraded } = ctx.checks
  const { order, currentQty } = ctx
  if (!degraded) {
    return aceOk && varOk ? 'APPROVE' : 'REJECT'
  }
  // In degraded mode, only allow reductions
  return isReduction(currentQty, order.side, order.qty) ? 'APPROVE_REDUCTION_ONLY' : 'REJECT'
}
