export interface ZkVarConfig {
  confidenceLevel: number // 90, 95, 99
  timeHorizon: number // days
  calculationMethod: 'historical' | 'parametric' | 'monte_carlo'
  rebalanceFrequency: 'intraday' | 'daily' | 'weekly'
  privacyLevel: 'standard' | 'enhanced' | 'maximum'
}

export interface RiskProfile {
  tolerance: 'conservative' | 'moderate' | 'aggressive'
  timeHorizon: '1-3months' | '3-12months' | '1-3years' | '3+years'
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  portfolioSize: 'small' | 'medium' | 'large' | 'institutional'
  objectives: string[]
}

export interface AgentConfig {
  id: string
  name: string
  riskTier: 'low' | 'medium' | 'high'
  strategy: string
  allocation: number
  status: 'active' | 'paused' | 'stopped'
  maxVaR: number
  expectedReturn: [number, number] // min, max range
  volatility: 'low' | 'medium' | 'high'
  performance?: {
    return: number
    sharpe: number
    maxDrawdown: number
    winRate: number
  }
}

export interface AgentDeploymentConfig {
  riskTier: 'low' | 'medium' | 'high'
  agentTypes: string[]
  zkVarSettings: ZkVarConfig
  riskProfile: RiskProfile
  customAllocations?: Record<string, number>
}

export interface ZkProof {
  proofId: string
  timestamp: string
  varValue: number
  confidenceLevel: number
  verified: boolean
  proofHash: string
  circuitParams: {
    positions: number
    timeHorizon: number
    method: string
  }
}

export interface ComplianceResult {
  passed: boolean
  riskTier: 'low' | 'medium' | 'high'
  maxAllowedVaR: number
  actualVaR: number
  warnings: string[]
  recommendations: string[]
}

export interface MonitoringAlert {
  id: string
  type: 'var_breach' | 'performance' | 'system' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  agentId?: string
  resolved: boolean
}

export interface PerformanceMetrics {
  totalReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  calmarRatio: number
  sortinoRatio: number
  var95: number
  var99: number
  expectedShortfall: number
}

export interface RiskTierDefinition {
  id: 'low' | 'medium' | 'high'
  name: string
  description: string
  maxVaR: string
  expectedReturn: string
  volatility: 'Low' | 'Medium' | 'High'
  characteristics: string[]
  strategies: Array<{
    id: string
    name: string
    allocation: number
  }>
  warnings: string[]
  icon: React.ComponentType<any>
  color: string
}