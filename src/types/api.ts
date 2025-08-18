export interface OrderPreviewAction {
  symbol: string
  side: 'buy' | 'sell'
  qty: number
}

export interface OrderPreviewProof {
  proof_id: string
  hash: string
  ok: boolean
  var_value: number
}

export interface OrderPreviewPolicy {
  verdict_id: string
  allow: boolean
  reasons?: string[]
}

export interface OrderPreviewResult {
  order_preview_id: string
  action: OrderPreviewAction
  proof: OrderPreviewProof
  policy: OrderPreviewPolicy
  trace_id: string
}
