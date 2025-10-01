/**
 * zk-VaR Proof Client
 * 
 * Zero-knowledge Value at Risk proof generation and verification.
 * Implements fail-closed semantics for production safety.
 * 
 * @author ReFi.Trading Team
 * @version 1.0.0
 */

export interface VaRProofRequest {
  positions: Array<{
    symbol: string
    quantity: number
    price: number
  }>
  confidenceLevel: 90 | 95 | 99
  timeHorizon: number // days
  method: 'historical' | 'parametric' | 'monte_carlo'
  userId: string
}

export interface VaRProofResponse {
  proofId: string
  proofHash: string
  varEstimate: number
  confidenceLevel: number
  verified: boolean
  circuitParams: {
    n: number
    timeHorizon: number
    method: string
  }
  generatedAt: string
}

/**
 * zk-VaR Proof Client with fail-closed semantics
 */
export class VaRProofClient {
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly retryAttempts: number

  constructor(
    baseUrl = '/api/zkvar',
    timeout = 10000, // VaR proofs can take longer
    retryAttempts = 1 // Fewer retries due to computational cost
  ) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.retryAttempts = retryAttempts
  }

  /**
   * Generate zk-VaR proof
   * Implements fail-closed: returns high VaR estimate if service fails
   */
  async generateProof(request: VaRProofRequest): Promise<VaRProofResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(`${this.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`VaR proof generation failed: ${response.status} ${response.statusText}`)
        }

        const result: VaRProofResponse = await response.json()
        return result

      } catch (error) {
        lastError = error as Error
        console.warn(`VaR proof generation attempt ${attempt + 1} failed:`, error)
        
        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    // Fail-closed: return conservative high VaR estimate
    console.error('VaR proof service unavailable, failing closed with conservative estimate')
    const conservativeVaR = this.calculateConservativeVaR(request.positions)
    
    return {
      proofId: `fail_closed_${Date.now()}`,
      proofHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      varEstimate: conservativeVaR,
      confidenceLevel: request.confidenceLevel,
      verified: false,
      circuitParams: {
        n: request.positions.length,
        timeHorizon: request.timeHorizon,
        method: 'conservative_fallback'
      },
      generatedAt: new Date().toISOString()
    }
  }

  /**
   * Calculate conservative VaR estimate for fail-closed mode
   */
  private calculateConservativeVaR(positions: VaRProofRequest['positions']): number {
    // Conservative estimate: 10% of total notional value
    const totalNotional = positions.reduce((sum, pos) => 
      sum + Math.abs(pos.quantity * pos.price), 0
    )
    return totalNotional * 0.1
  }

  /**
   * Verify existing proof
   */
  async verifyProof(proofId: string): Promise<VaRProofResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/proofs/${proofId}`)
      
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`Failed to verify proof: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to verify VaR proof:', error)
      return null
    }
  }
}