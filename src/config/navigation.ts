/**
 * Navigation Configuration
 * 
 * Centralized navigation items for the sidebar component.
 * This separation improves maintainability and makes it easier to update navigation.
 */

import { 
  Activity, 
  BarChart3, 
  Shield, 
  Settings, 
  FileText, 
  Wallet,
  TrendingUp,
  Zap,
  Users,
  Bell,
  HelpCircle,
  BookOpen,
  Trophy
} from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  badge: string | null
}

export interface NavigationCategory {
  category: string
  items: NavigationItem[]
}

export const navigationItems: NavigationCategory[] = [
  {
    category: 'Trading',
    items: [
      { id: 'overview', label: 'Overview', icon: Activity, badge: null },
      { id: 'strategies', label: 'Strategies', icon: TrendingUp, badge: '3 Active' },
      { id: 'positions', label: 'Positions', icon: Wallet, badge: null },
      { id: 'orders', label: 'Orders', icon: BarChart3, badge: '12' },
      { id: 'education', label: 'Education', icon: BookOpen, badge: 'New' }
    ]
  },
  {
    category: 'Risk & Compliance',
    items: [
      { id: 'risk-monitor', label: 'Risk Monitor', icon: Shield, badge: 'Live' },
      { id: 'audit-trail', label: 'Audit Trail', icon: FileText, badge: null },
      { id: 'compliance', label: 'Compliance', icon: Users, badge: null }
    ]
  },
  {
    category: 'Analytics',
    items: [
      { id: 'gamification', label: 'Progress', icon: Trophy, badge: 'Lv 3' },
      { id: 'performance', label: 'Performance', icon: BarChart3, badge: null },
      { id: 'latency', label: 'Latency', icon: Zap, badge: '89ms' },
      { id: 'alerts', label: 'Alerts', icon: Bell, badge: '2' }
    ]
  },
  {
    category: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings, badge: null },
      { id: 'help', label: 'Help', icon: HelpCircle, badge: null }
    ]
  }
]