/**
 * Mock API Service
 * 
 * Simulates backend API calls for gamification, onboarding, and trading data.
 * Uses localStorage for persistence to simulate a real backend.
 * 
 * @author ReFi.Trading Team
 * @version 1.0.0
 */

import type { 
  GamificationProfile, 
  XPEvent, 
  UserBadge, 
  UserQuest, 
  Quest,
  Badge,
  EducationModule,
  QuizAttempt
} from '@/types/gamification'

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_STATUS: 'refi_onboarding_status',
  GAMIFICATION_PROFILE: 'refi_gamification_profile',
  XP_EVENTS: 'refi_xp_events',
  USER_BADGES: 'refi_user_badges',
  USER_QUESTS: 'refi_user_quests',
  QUIZ_ATTEMPTS: 'refi_quiz_attempts'
} as const

// Default data
const DEFAULT_PROFILE: GamificationProfile = {
  userId: '1',
  level: 1,
  xpTotal: 0,
  streakDays: 0,
  lastActiveAt: new Date().toISOString(),
  leaderboardOptIn: false,
  softCaps: {
    perTrade: 2000,
    perSymbol: 10000
  }
}

/**
 * Safely parse JSON from localStorage with fallback
 */
function safeParseJSON<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (error) {
    console.warn(`Failed to parse ${key} from localStorage:`, error)
    return fallback
  }
}

/**
 * Safely store data to localStorage
 */
function safeStoreJSON(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Failed to store ${key} to localStorage:`, error)
  }
}

/**
 * Mock API Service Class
 */
export class MockApiService {
  /**
   * Get onboarding completion status
   */
  static getOnboardingStatus(): Promise<{ completed: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const completed = safeParseJSON(STORAGE_KEYS.ONBOARDING_STATUS, false)
        resolve({ completed })
      }, 100) // Simulate network delay
    })
  }

  /**
   * Mark onboarding as completed
   */
  static completeOnboarding(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        safeStoreJSON(STORAGE_KEYS.ONBOARDING_STATUS, true)
        resolve()
      }, 100)
    })
  }

  /**
   * Get user's gamification profile
   */
  static getGamificationProfile(): Promise<GamificationProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = safeParseJSON(STORAGE_KEYS.GAMIFICATION_PROFILE, DEFAULT_PROFILE)
        resolve(profile)
      }, 150)
    })
  }

  /**
   * Update gamification profile
   */
  static updateGamificationProfile(updates: Partial<GamificationProfile>): Promise<GamificationProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = safeParseJSON(STORAGE_KEYS.GAMIFICATION_PROFILE, DEFAULT_PROFILE)
        const updated = { ...current, ...updates }
        safeStoreJSON(STORAGE_KEYS.GAMIFICATION_PROFILE, updated)
        resolve(updated)
      }, 100)
    })
  }

  /**
   * Add XP event and update profile
   */
  static addXPEvent(event: Omit<XPEvent, 'id' | 'createdAt'>): Promise<{ profile: GamificationProfile; event: XPEvent }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create XP event
        const xpEvent: XPEvent = {
          ...event,
          id: `xp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString()
        }

        // Store XP event
        const events = safeParseJSON<XPEvent[]>(STORAGE_KEYS.XP_EVENTS, [])
        events.unshift(xpEvent)
        // Keep only last 100 events
        const trimmedEvents = events.slice(0, 100)
        safeStoreJSON(STORAGE_KEYS.XP_EVENTS, trimmedEvents)

        // Update profile
        const profile = safeParseJSON(STORAGE_KEYS.GAMIFICATION_PROFILE, DEFAULT_PROFILE)
        const newXpTotal = profile.xpTotal + event.deltaXp
        const newLevel = this.calculateLevel(newXpTotal)
        
        const updatedProfile: GamificationProfile = {
          ...profile,
          xpTotal: newXpTotal,
          level: newLevel,
          lastActiveAt: new Date().toISOString(),
          softCaps: this.getSoftCapsForLevel(newLevel)
        }

        safeStoreJSON(STORAGE_KEYS.GAMIFICATION_PROFILE, updatedProfile)
        resolve({ profile: updatedProfile, event: xpEvent })
      }, 100)
    })
  }

  /**
   * Get recent XP events
   */
  static getRecentXPEvents(limit = 10): Promise<XPEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = safeParseJSON<XPEvent[]>(STORAGE_KEYS.XP_EVENTS, [])
        resolve(events.slice(0, limit))
      }, 100)
    })
  }

  /**
   * Calculate level based on XP total
   */
  private static calculateLevel(xpTotal: number): number {
    const levels = [0, 500, 1500, 3000, 6000, 10000]
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xpTotal >= levels[i]) {
        return i + 1
      }
    }
    return 1
  }

  /**
   * Get soft caps for a given level
   */
  private static getSoftCapsForLevel(level: number): { perTrade: number; perSymbol: number } {
    const caps = [
      { perTrade: 2000, perSymbol: 10000 },   // Level 1
      { perTrade: 5000, perSymbol: 20000 },   // Level 2
      { perTrade: 10000, perSymbol: 30000 },  // Level 3
      { perTrade: 15000, perSymbol: 50000 },  // Level 4
      { perTrade: 25000, perSymbol: 75000 }   // Level 5+
    ]
    return caps[Math.min(level - 1, caps.length - 1)]
  }

  /**
   * Get user badges
   */
  static getUserBadges(): Promise<UserBadge[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const badges = safeParseJSON<UserBadge[]>(STORAGE_KEYS.USER_BADGES, [])
        resolve(badges)
      }, 100)
    })
  }

  /**
   * Award badge to user
   */
  static awardBadge(badgeCode: string): Promise<UserBadge | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const badges = safeParseJSON<UserBadge[]>(STORAGE_KEYS.USER_BADGES, [])
        
        // Check if badge already awarded
        if (badges.some(b => b.badge.code === badgeCode)) {
          resolve(null)
          return
        }

        // Create mock badge (in real implementation, fetch from badges table)
        const mockBadge: UserBadge = {
          userId: '1',
          badgeId: `badge_${Date.now()}`,
          awardedAt: new Date().toISOString(),
          badge: {
            id: `badge_${Date.now()}`,
            code: badgeCode,
            name: this.getBadgeName(badgeCode),
            description: this.getBadgeDescription(badgeCode),
            icon: this.getBadgeIcon(badgeCode),
            criteria: {},
            active: true
          }
        }

        badges.push(mockBadge)
        safeStoreJSON(STORAGE_KEYS.USER_BADGES, badges)
        resolve(mockBadge)
      }, 100)
    })
  }

  /**
   * Get badge metadata (mock implementation)
   */
  private static getBadgeName(code: string): string {
    const names: Record<string, string> = {
      'ONBOARD_COMPLETE': 'Welcome Aboard',
      'FIRST_TRADE': 'First Trade',
      'RISK_MASTER': 'Risk Master',
      'EDUCATION_CHAMPION': 'Education Champion'
    }
    return names[code] || 'Achievement Badge'
  }

  private static getBadgeDescription(code: string): string {
    const descriptions: Record<string, string> = {
      'ONBOARD_COMPLETE': 'Completed the onboarding flow',
      'FIRST_TRADE': 'Executed your first trade',
      'RISK_MASTER': 'Demonstrated risk management mastery',
      'EDUCATION_CHAMPION': 'Completed all education modules'
    }
    return descriptions[code] || 'Achievement unlocked'
  }

  private static getBadgeIcon(code: string): string {
    const icons: Record<string, string> = {
      'ONBOARD_COMPLETE': '🎯',
      'FIRST_TRADE': '💰',
      'RISK_MASTER': '🛡️',
      'EDUCATION_CHAMPION': '🎓'
    }
    return icons[code] || '🏆'
  }

  /**
   * Get user quests
   */
  static getUserQuests(): Promise<UserQuest[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quests = safeParseJSON<UserQuest[]>(STORAGE_KEYS.USER_QUESTS, [])
        resolve(quests)
      }, 100)
    })
  }

  /**
   * Start a quest
   */
  static startQuest(questId: string): Promise<UserQuest> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quests = safeParseJSON<UserQuest[]>(STORAGE_KEYS.USER_QUESTS, [])
        
        // Create mock quest
        const mockQuest: UserQuest = {
          userId: '1',
          questId,
          status: 'active',
          progress: {},
          startedAt: new Date().toISOString(),
          quest: {
            id: questId,
            code: `QUEST_${questId}`,
            name: 'Sample Quest',
            description: 'Complete this quest to earn rewards',
            rewardXp: 50,
            steps: []
          }
        }

        quests.push(mockQuest)
        safeStoreJSON(STORAGE_KEYS.USER_QUESTS, quests)
        resolve(mockQuest)
      }, 100)
    })
  }

  /**
   * Clear all data (for testing/reset purposes)
   */
  static clearAllData(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key)
        })
        resolve()
      }, 100)
    })
  }
}

export default MockApiService