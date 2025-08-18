export interface Position {
  id: string
  symbol: string
  quantity: number
  avgPrice: number
  marketValue: number
  unrealizedPnl: number
  side: 'long' | 'short'
  lastUpdated: string
}

export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  orderType: 'market' | 'limit' | 'stop'
  limitPrice?: number
  stopPrice?: number
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  timeInForce: 'day' | 'gtc' | 'ioc' | 'fok'
  submittedAt: string
  filledAt?: string
  proofHash?: string
  aceVerdict?: string
  anchorTxHash?: string
}

export interface VaRProof {
  proofId: string
  positions: Position[]
  varEstimate: number
  confidenceLevel: number
  proofHash: string
  generatedAt: string
  verified: boolean
  circuitParams: {
    n: number // N=12 for MVP
    timeHorizon: number
    method: 'historical' | 'parametric' | 'monte_carlo'
  }
}

export interface ACEPolicyResult {
  verdict: 'approved' | 'rejected' | 'clamped'
  originalNotional: number
  clampedNotional?: number
  reason?: string
  policyVersion: string
  jurisdiction: 'uae-gcc'
  timestamp: string
}

export interface DualProofGate {
  zkVarProof: VaRProof
  acePolicyResult: ACEPolicyResult
  gateDecision: 'pass' | 'fail'
  previewAnchorTx?: string
  postFillAnchorTx?: string
}

export interface SafeModeStatus {
  active: boolean
  reason?: 'market_volatility' | 'system_degradation' | 'risk_breach'
  activatedAt?: string
  restrictionsOnly: boolean // true = reductions only
}

export interface StrategyAgent {
  id: string
  name: string
  type: 'ppo' | 'td3' | 'rvi-q'
  status: 'active' | 'paused' | 'stopped'
  performance: {
    totalReturn: number
    sharpeRatio: number
    maxDrawdown: number
    winRate: number
  }
  riskMetrics: {
    currentVaR: number
    positionCount: number
    leverage: number
  }
  lastAction: string
  sessionKeyActive: boolean
}