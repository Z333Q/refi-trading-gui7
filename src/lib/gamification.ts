import { GamificationProfile, XpEvent, UserBadge, UserQuest } from '@/types/gamification'

// Level configuration
export const LEVEL_CONFIG = [
  { level: 1, xpMin: 0, softCaps: { perTrade: 2000, perSymbol: 10000 } },
  { level: 2, xpMin: 500, softCaps: { perTrade: 5000, perSymbol: 20000 } },
  { level: 3, xpMin: 1500, softCaps: { perTrade: 10000, perSymbol: 30000 } },
  { level: 4, xpMin: 3000, softCaps: { perTrade: 15000, perSymbol: 50000 } },
  { level: 5, xpMin: 6000, softCaps: { perTrade: 25000, perSymbol: 75000 } },
]

// XP weights for different actions
export const XP_WEIGHTS = {
  preview: 5,
  risk_ok: 3,
  anchor_preview: 2,
  fill: 1,
  reduction_mode: 4,
  quiz_pass: 20,
  quiz_fail: 2,
  tour_complete: 10,
  streak_daily: 5,
  drift_improve: 8,
  onboarding: 15,
}

/**
 * Calculate user level based on total XP
 */
export function calculateLevel(xpTotal: number): number {
  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (xpTotal >= LEVEL_CONFIG[i].xpMin) {
      return LEVEL_CONFIG[i].level
    }
  }
  return 1
}

/**
 * Get soft caps for a given level
 */
export function getSoftCapsForLevel(level: number) {
  const config = LEVEL_CONFIG.find(c => c.level === level) || LEVEL_CONFIG[0]
  return config.softCaps
}

/**
 * Get XP required for next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  const nextLevelConfig = LEVEL_CONFIG.find(c => c.level === currentLevel + 1)
  return nextLevelConfig?.xpMin || LEVEL_CONFIG[LEVEL_CONFIG.length - 1].xpMin
}

/**
 * Get XP required for current level
 */
export function getXpForCurrentLevel(currentLevel: number): number {
  const currentLevelConfig = LEVEL_CONFIG.find(c => c.level === currentLevel)
  return currentLevelConfig?.xpMin || 0
}

/**
 * Calculate progress to next level as percentage
 */
export function calculateLevelProgress(xpTotal: number, currentLevel: number): number {
  const currentLevelXp = getXpForCurrentLevel(currentLevel)
  const nextLevelXp = getXpForNextLevel(currentLevel)
  
  if (nextLevelXp === currentLevelXp) return 100 // Max level
  
  return ((xpTotal - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
}

/**
 * Apply soft clamp to trading amounts (never exceed ACE caps)
 */
export function softClamp(notionalReq: number, aceCap: number, softCap?: number): number {
  const cap = Math.min(aceCap, softCap ?? aceCap)
  return Math.sign(notionalReq) * Math.min(Math.abs(notionalReq), cap)
}

/**
 * Check if user qualifies for a badge based on criteria
 */
export function checkBadgeCriteria(
  criteria: any,
  userStats: {
    xpEvents: XpEvent[]
    streakDays: number
    certificates: string[]
    completedQuests: string[]
  }
): boolean {
  switch (criteria.type) {
    case 'count':
      const relevantEvents = userStats.xpEvents.filter(e => e.source === criteria.source)
      return relevantEvents.length >= criteria.gte
      
    case 'streak':
      return userStats.streakDays >= criteria.days
      
    case 'certificates':
      return criteria.modules.every((module: string) => 
        userStats.certificates.includes(module)
      )
      
    case 'quest_complete':
      return userStats.completedQuests.includes(criteria.quest)
      
    default:
      return false
  }
}

/**
 * Generate XP event for tracking
 */
export function createXpEvent(
  userId: string,
  source: keyof typeof XP_WEIGHTS,
  sourceRefId?: string,
  accountId?: string,
  strategyId?: string,
  meta: Record<string, any> = {}
): Omit<XpEvent, 'id' | 'createdAt'> {
  return {
    userId,
    source,
    sourceRefId,
    accountId,
    strategyId,
    deltaXp: XP_WEIGHTS[source],
    meta,
  }
}

/**
 * Update streak based on activity
 */
export function updateStreak(lastActiveDate: Date | null, currentDate: Date = new Date()) {
  if (!lastActiveDate) {
    return { currentDays: 1, shouldAwardXp: true }
  }
  
  const daysDiff = Math.floor(
    (currentDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysDiff === 1) {
    // Consecutive day - extend streak
    return { currentDays: 1, shouldAwardXp: true } // Will be incremented by caller
  } else if (daysDiff === 0) {
    // Same day - no change
    return { currentDays: 0, shouldAwardXp: false }
  } else {
    // Streak broken - reset
    return { currentDays: 1, shouldAwardXp: true }
  }
}

/**
 * Format XP number for display
 */
export function formatXp(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  } else if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

/**
 * Get user's current segment based on level and activity
 */
export function getUserSegment(level: number, totalTrades: number): 'power_retail' | 'prosumer' | 'fund_ops' {
  if (level >= 4 && totalTrades >= 1000) {
    return 'fund_ops'
  } else if (level >= 3 && totalTrades >= 100) {
    return 'prosumer'
  }
  return 'power_retail'
}