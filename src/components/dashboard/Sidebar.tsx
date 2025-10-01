import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
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

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-gray-950 border-r border-gray-800 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <img 
            src="/green-logo-only-squareArtboard 1.png" 
            alt="ReFi.Trading Logo" 
            className="h-8 w-8"
            onError={(e) => {
              // Fallback to Activity icon if logo fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <Activity className="h-8 w-8 text-emerald-600 hidden" />
          <div>
            <h1 className="text-xl font-bold">ReFi.Trading</h1>
            <p className="text-xs text-gray-500">Alpha v1.1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigationItems.map((category) => (
          <div key={category.category}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {category.category}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 px-3 ${
                      isActive 
                        ? 'bg-emerald-950/20 text-emerald-400 border-emerald-800' 
                        : 'text-gray-300 hover:bg-gray-900'
                    }`}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "success" : "secondary"} 
                        className="text-xs ml-2"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-gray-400">System Online</span>
        </div>
      </div>
      </aside>
    </>
  )
}