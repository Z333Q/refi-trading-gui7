export interface GamificationProfile {
  userId: string
  level: number
  xpTotal: number
  streakDays: number
  lastActiveAt: string
  leaderboardOptIn: boolean
  handle?: string
  softCaps: {
    perTrade: number
    perSymbol: number
  }
}

export interface XPEvent {
  id: string
  userId: string
  source: 'preview' | 'fill' | 'quiz_pass' | 'quiz_fail' | 'tour_complete' | 
          'onboarding' | 'streak' | 'risk_ok' | 'reduction_mode' | 'drift_improve'
  sourceRefId?: string
  accountId?: string
  strategyId?: string
  deltaXp: number
  meta: Record<string, any>
  createdAt: string
}

export interface Badge {
  id: string
  code: string
  name: string
  description: string
  icon?: string
  criteria: Record<string, any>
  active: boolean
}

export interface UserBadge {
  userId: string
  badgeId: string
  awardedAt: string
  badge: Badge
}

export interface Quest {
  id: string
  seasonId?: string
  code: string
  name: string
  description: string
  segment?: 'power_retail' | 'prosumer' | 'fund_ops'
  rewardXp: number
  rewardBadgeId?: string
  startAt?: string
  endAt?: string
  active: boolean
  steps: QuestStep[]
}

export interface QuestStep {
  id: string
  questId: string
  ordinal: number
  stepType: 'connect_broker' | 'complete_preview' | 'execute_checked_order' |
            'anchor_preview' | 'pass_quiz' | 'tour_complete' | 'reduce_in_safe_mode'
  targetCount: number
  params: Record<string, any>
}

export interface UserQuest {
  userId: string
  questId: string
  status: 'active' | 'completed' | 'expired'
  progress: Record<string, any>
  startedAt: string
  completedAt?: string
  quest: Quest
}

export interface EducationModule {
  id: string
  code: string
  title: string
  description: string
  estimatedMinutes?: number
  orderWeight: number
  passingScore: number
  lessons: Lesson[]
  quizzes: Quiz[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  mediaUrl?: string
  contentMd?: string
  ordinal: number
}

export interface Quiz {
  id: string
  moduleId: string
  timeLimitSec?: number
  attemptsAllowed?: number
  questions: Question[]
}

export interface Question {
  id: string
  quizId: string
  kind: 'mcq' | 'multi' | 'numeric' | 'bool'
  stemMd: string
  choices?: Record<string, any>
  answerKey: Record<string, any>
  explanationMd?: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  scorePct: number
  passed: boolean
  answers: Record<string, any>
  attemptedAt: string
}

export interface GuideTour {
  id: string
  code: string
  title: string
  segment?: string
  triggerEvent?: string
  active: boolean
  steps: GuideStep[]
}

export interface GuideStep {
  id: string
  tourId: string
  ordinal: number
  action: string
  uiSelector: string
  textMd: string
}

export interface UserTour {
  userId: string
  tourId: string
  status: 'active' | 'completed' | 'dismissed'
  startedAt: string
  completedAt?: string
  tour: GuideTour
}