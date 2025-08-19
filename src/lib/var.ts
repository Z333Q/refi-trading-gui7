import type { OrderPreviewAction, OrderPreviewProof } from '../types/api'

export interface VarProofClientConfig {
  baseUrl: string
  timeoutMs?: number
}

/**
 * Client for the zk-VaR proof service with fail-closed semantics.
 */
export class VarProofClient {
  private baseUrl: string
  private timeoutMs: number

  constructor(cfg: VarProofClientConfig) {
    this.baseUrl = cfg.baseUrl
    this.timeoutMs = cfg.timeoutMs ?? 8000
  }

  async prove(
    action: OrderPreviewAction,
  ): Promise<{ proof: OrderPreviewProof | null; degraded: boolean }> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      const res = await fetch(`${this.baseUrl}/prove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
        signal: controller.signal,
      })
      if (!res.ok) {
        return { proof: null, degraded: true }
      }
      const proof = (await res.json()) as OrderPreviewProof
      return { proof, degraded: false }
    } catch {
      return { proof: null, degraded: true }
    } finally {
      clearTimeout(timer)
    }
  }
}

