import React from 'react'
import { useDisconnect } from 'wagmi'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { LanguageSelector } from '../ui/LanguageSelector'
import { LanguageSelector } from '../ui/LanguageSelector'
import { WalletConnect } from '../wallet/WalletConnect'
import { 
  Activity, 
  Shield, 
  Settings, 
  Bell,
  ChevronDown,
  Menu
} from 'lucide-react'
interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { disconnect } = useDisconnect()

  const handleDisconnect = () => {
    try {
      disconnect()
      // Clear any cached wallet data
      localStorage.removeItem('wagmi.wallet')
      localStorage.removeItem('wagmi.connected')
      // Force reload to ensure clean state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.warn('Disconnect error:', error)
      // Fallback: reload the page to clear wallet state
      window.location.reload()
    }
  }

  return (
    <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm flex-shrink-0">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Trading Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-gray-400">Alpaca Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-blue-500 fill-blue-500 animate-pulse" />
              <span className="text-sm text-gray-400">ACE Active</span>
            </div>
          </div>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}