import type { OrderPreviewAction, OrderPreviewPolicy } from '../types/api'

export interface AceClientConfig {
  baseUrl: string
  timeoutMs?: number
}

/**
 * Minimal ACE client that fails closed on errors or timeouts.
 */
export class AceClient {
  private baseUrl: string
  private timeoutMs: number

  constructor(cfg: AceClientConfig) {
    this.baseUrl = cfg.baseUrl
    this.timeoutMs = cfg.timeoutMs ?? 5000
  }

  async evaluate(
    action: OrderPreviewAction,
  ): Promise<{ policy: OrderPreviewPolicy | null; degraded: boolean }> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      const res = await fetch(`${this.baseUrl}/verdicts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
        signal: controller.signal,
      })
      if (!res.ok) {
        return { policy: null, degraded: true }
      }
      const policy = (await res.json()) as OrderPreviewPolicy
      return { policy, degraded: false }
    } catch {
      return { policy: null, degraded: true }
    } finally {
      clearTimeout(timer)
    }
  }
}

