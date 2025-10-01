/**
 * ACE Policy Client
 * 
 * Automated Compliance Engine for UAE/GCC regulatory compliance.
 * Implements fail-closed semantics for production safety.
 * 
 * @author ReFi.Trading Team
 * @version 1.0.0
 */

export interface ACEPolicyRequest {
  userId: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  notionalValue: number
  jurisdiction: 'uae-gcc'
  timestamp: string
}

export interface ACEPolicyResponse {
  verdict: 'approved' | 'rejected' | 'clamped'
  verdictId: string
  originalNotional: number
  clampedNotional?: number
  reason?: string
  policyVersion: string
  jurisdiction: 'uae-gcc'
  timestamp: string
}

/**
 * ACE Policy Client with fail-closed semantics
 */
export class ACEPolicyClient {
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly retryAttempts: number

  constructor(
    baseUrl = '/api/ace',
    timeout = 5000,
    retryAttempts = 2
  ) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.retryAttempts = retryAttempts
  }

  /**
   * Check policy compliance for a trade
   * Implements fail-closed: returns rejection if service is unavailable
   */
  async checkPolicy(request: ACEPolicyRequest): Promise<ACEPolicyResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(`${this.baseUrl}/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`ACE Policy check failed: ${response.status} ${response.statusText}`)
        }

        const result: ACEPolicyResponse = await response.json()
        return result

      } catch (error) {
        lastError = error as Error
        console.warn(`ACE Policy check attempt ${attempt + 1} failed:`, error)
        
        if (attempt < this.retryAttempts) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    // Fail-closed: reject trade if ACE service is unavailable
    console.error('ACE Policy service unavailable after retries, failing closed')
    return {
      verdict: 'rejected',
      verdictId: `fail_closed_${Date.now()}`,
      originalNotional: request.notionalValue,
      reason: 'ACE Policy service unavailable - failing closed for safety',
      policyVersion: '1.0',
      jurisdiction: request.jurisdiction,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Get policy verdict by ID
   */
  async getVerdict(verdictId: string): Promise<ACEPolicyResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/verdicts/${verdictId}`)
      
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`Failed to fetch verdict: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch ACE verdict:', error)
      return null
    }
  }
}