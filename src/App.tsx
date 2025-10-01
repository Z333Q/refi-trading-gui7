import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { OnboardingWrapper } from './components/onboarding/OnboardingWrapper'
import { Sidebar } from './components/dashboard/Sidebar'
import { Header } from './components/dashboard/Header'
import { OverviewSection } from './components/dashboard/sections/OverviewSection'
import { StrategiesSection } from './components/dashboard/sections/StrategiesSection'
import { RiskMonitorSection } from './components/dashboard/sections/RiskMonitorSection'
import { PerformanceSection } from './components/dashboard/sections/PerformanceSection'
import { AuditTrailSection } from './components/dashboard/sections/AuditTrailSection'
import { SettingsSection } from './components/dashboard/sections/SettingsSection'
import { GamificationSection } from './components/dashboard/sections/GamificationSection'
import { EducationSection } from './components/dashboard/sections/EducationSection'
import { TradingInterface } from './components/dashboard/TradingInterface'
import { TooltipProvider } from './components/ui/tooltip'
import { PersistentPopoutTab } from './components/ui/PersistentPopoutTab'
import MockApiService from './services/mockApiService'

function App() {
  const { ready } = useTranslation()
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user has completed onboarding using mock API
        const { completed: hasCompletedOnboarding } = await MockApiService.getOnboardingStatus()
        
        if (hasCompletedOnboarding) {
          setShowOnboarding(false)
        } else {
          setShowOnboarding(true)
        }
        
        setIsInitialized(true)
      } catch (error) {
        console.warn('Error initializing app:', error)
        // Default to showing onboarding if there's an error
        setShowOnboarding(true)
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [])

  const handleOnboardingComplete = async () => {
    try {
      // Mark onboarding as completed using mock API
      await MockApiService.completeOnboarding()
      setShowOnboarding(false)
    } catch (error) {
      console.warn('Error saving onboarding completion:', error)
      // Still proceed to dashboard even if localStorage fails
      setShowOnboarding(false)
    }
  }

  // Show loading state while initializing or translations loading
  if (!isInitialized || !ready) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {!ready ? 'Loading translations...' : 'Initializing ReFi.Trading...'}
          </p>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingWrapper onComplete={handleOnboardingComplete} />
      </ErrorBoundary>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />
      case 'strategies':
        return <StrategiesSection />
      case 'positions':
      case 'orders':
        return <TradingInterface />
      case 'risk-monitor':
        return <RiskMonitorSection />
      case 'audit-trail':
        return <AuditTrailSection />
      case 'performance':
        return <PerformanceSection />
      case 'education':
        return <EducationSection />
      case 'gamification':
        return <GamificationSection />
      case 'latency':
        return <RiskMonitorSection />
      case 'compliance':
        return <RiskMonitorSection />
      case 'alerts':
        return <OverviewSection />
      case 'settings':
        return <SettingsSection />
      case 'help':
        return <div className="p-8 text-center text-gray-500">Help documentation coming soon...</div>
      default:
        return <OverviewSection />
    }
  }

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-900 text-gray-50 overflow-hidden" data-theme="dark">
          {/* Persistent Pop-out Tab - Only show on overview section */}
          {activeSection === 'overview' && <PersistentPopoutTab />}
          
          <div className="flex h-screen">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={(section) => {
                setActiveSection(section)
                setSidebarOpen(false) // Close sidebar on mobile after selection
              }}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <ErrorBoundary>
                  {renderSection()}
                </ErrorBoundary>
              </main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App