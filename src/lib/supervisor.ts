/**
 * Supervisor Decision Logic
 * 
 * Enforces reductions-only safe-mode when downstream services degrade.
 * Implements fail-safe trading controls for production safety.
 * 
 * @author ReFi.Trading Team
 * @version 1.0.0
 */

export interface SupervisorChecks {
  aceOk: boolean
  varOk: boolean
  degraded: boolean
}

export interface OrderRequest {
  side: 'buy' | 'sell'
  qty: number
}

export type SupervisorDecision = 
  | 'APPROVE' 
  | 'APPROVE_REDUCTION_ONLY' 
  | 'REJECT'

export interface SupervisorContext {
  checks: SupervisorChecks
  order: OrderRequest
  currentQty: number
}

/**
 * Main supervisor decision function
 * Implements fail-safe logic for trading operations
 * 
 * @param context - Trading context with checks and order details
 * @returns Supervisor decision
 */
export function supervisorDecision(context: SupervisorContext): SupervisorDecision {
  const { checks, order, currentQty } = context

  // If all systems are healthy, approve normally
  if (checks.aceOk && checks.varOk && !checks.degraded) {
    return 'APPROVE'
  }

  // If systems are degraded, only allow risk-reducing trades
  if (checks.degraded) {
    // Check if this trade reduces overall exposure
    const isReduction = isRiskReducingTrade(order, currentQty)
    
    if (isReduction) {
      return 'APPROVE_REDUCTION_ONLY'
    } else {
      return 'REJECT'
    }
  }

  // If either ACE or VaR checks fail but system isn't degraded, reject
  if (!checks.aceOk || !checks.varOk) {
    return 'REJECT'
  }

  // Default to rejection for safety
  return 'REJECT'
}

/**
 * Determines if a trade reduces overall risk exposure
 * 
 * @param order - Order to evaluate
 * @param currentQty - Current position quantity (positive = long, negative = short)
 * @returns True if trade reduces exposure
 */
function isRiskReducingTrade(order: OrderRequest, currentQty: number): boolean {
  // If no current position, any trade increases exposure
  if (currentQty === 0) {
    return false
  }

  // For long positions (currentQty > 0)
  if (currentQty > 0) {
    // Selling reduces exposure
    if (order.side === 'sell') {
      return true
    }
    // Buying increases exposure
    return false
  }

  // For short positions (currentQty < 0)
  if (currentQty < 0) {
    // Buying (covering) reduces exposure
    if (order.side === 'buy') {
      return true
    }
    // Selling (adding to short) increases exposure
    return false
  }

  return false
}

/**
 * Calculate risk reduction percentage
 * 
 * @param order - Order to evaluate
 * @param currentQty - Current position quantity
 * @returns Percentage of risk reduction (0-100)
 */
export function calculateRiskReduction(order: OrderRequest, currentQty: number): number {
  if (!isRiskReducingTrade(order, currentQty)) {
    return 0
  }

  const currentExposure = Math.abs(currentQty)
  const orderQty = order.qty
  
  // Calculate how much exposure would be reduced
  const reductionAmount = Math.min(orderQty, currentExposure)
  const reductionPercentage = (reductionAmount / currentExposure) * 100
  
  return Math.min(reductionPercentage, 100)
}