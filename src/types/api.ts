/**
 * API Types
 * 
 * TypeScript definitions for API requests and responses.
 * Based on the OpenAPI specification in openapi/openapi.yaml
 */

// Order Preview Types (from OpenAPI spec)
export interface OrderPreviewResult {
  order_preview_id: string
  action: {
    symbol: string
    side: 'buy' | 'sell'
    qty: number
  }
  proof: {
    proof_id: string
    hash: string
    ok: boolean
    var_value: number
  }
  policy: {
    verdict_id: string
    allow: boolean
    reasons?: string[]
  }
  trace_id: string
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Common API request types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Trading API types
export interface CreateOrderRequest {
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  orderType: 'market' | 'limit' | 'stop'
  limitPrice?: number
  stopPrice?: number
  timeInForce?: 'day' | 'gtc' | 'ioc' | 'fok'
  previewId?: string
}

export interface OrderResponse {
  orderId: string
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  fillPrice?: number
  fillQuantity?: number
  timestamp: string
}

// Proof verification types
export interface ProofVerificationRequest {
  proofId: string
  proofData: string
  circuitParams: {
    n: number
    timeHorizon: number
    method: 'historical' | 'parametric' | 'monte_carlo'
  }
}

export interface ProofVerificationResponse {
  verified: boolean
  proofHash: string
  timestamp: string
  circuitId: string
}