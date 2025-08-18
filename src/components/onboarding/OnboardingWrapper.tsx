import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { FirstTimeVisitorOverlay } from './FirstTimeVisitorOverlay'
import { OnboardingFlow } from './OnboardingFlow'
import { PersistentPopoutTab } from '../ui/PersistentPopoutTab'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Users, 
  User, 
  Building, 
  ArrowRight,
  CheckCircle,
  Activity
} from 'lucide-react'

interface OnboardingWrapperProps {
  onComplete: () => void
}

export function OnboardingWrapper({ onComplete }: OnboardingWrapperProps) {
  const [userType, setUserType] = useState<'individual' | 'dao' | 'institutional' | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showFirstTimeOverlay, setShowFirstTimeOverlay] = useState(true)
  const { isConnected } = useAccount()

  // Tutorial is now always available - no restrictions based on time or previous visits

  const handleCloseOverlay = () => {
    setShowFirstTimeOverlay(false)
  }

  const handleStartOnboardingFromOverlay = () => {
    setShowFirstTimeOverlay(false)
    // Don't auto-select, let user choose their type
    setShowOnboarding(false) // Keep showing the selection screen
  }

  const userTypes = [
    {
      id: 'individual' as const,
      title: 'Individual Trader',
      description: 'Personal trading account with AI-powered strategies',
      icon: User,
      features: [
        'Personal wallet connection',
        'Alpaca Markets integration',
        'AI trading strategies',
        'Risk management tools'
      ],
      setupTime: '10-15 minutes'
    },
    {
      id: 'dao' as const,
      title: 'DAO Treasury',
      description: 'Multi-signature governance with automated trading',
      icon: Users,
      features: [
        'SAFE multisig integration',
        'Governance voting',
        'Treasury management',
        'Member permissions'
      ],
      setupTime: '15-25 minutes'
    },
    {
      id: 'institutional' as const,
      title: 'Institutional',
      description: 'Enterprise-grade trading with compliance features',
      icon: Building,
      features: [
        'Advanced compliance',
        'Custom integrations',
        'Dedicated support',
        'Enhanced security'
      ],
      setupTime: '20-30 minutes'
    }
  ]

  const handleUserTypeSelect = (type: 'individual' | 'dao' | 'institutional') => {
    setUserType(type)
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    // Ensure clean state transition to dashboard
    setShowOnboarding(false)
    setShowFirstTimeOverlay(false)
    onComplete()
  }

  if (showOnboarding && userType) {
    return (
      <>
        {showFirstTimeOverlay && (
          <FirstTimeVisitorOverlay
            onClose={handleCloseOverlay}
            onStartOnboarding={handleStartOnboardingFromOverlay}
          />
        )}
        <OnboardingFlow 
          userType={userType} 
          onComplete={handleOnboardingComplete}
          isDemoMode={true}
        />
      </>
    )
  }

  return (
    <>
      {showFirstTimeOverlay && (
        <FirstTimeVisitorOverlay
          onClose={handleCloseOverlay}
          onStartOnboarding={handleStartOnboardingFromOverlay}
        />
      )}
      
      {/* Show pop-out tab when overlay is not visible */}
      {!showFirstTimeOverlay && <PersistentPopoutTab />}
      
      <div className="min-h-screen bg-gray-900 text-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <img 
                src="/green-logo-only-squareArtboard 1.png" 
                alt="ReFi.Trading Logo" 
                className="h-12 w-12"
                onError={(e) => {
                  // Fallback to Activity icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Activity className="h-12 w-12 text-emerald-600 hidden" />
              <h1 className="text-4xl font-bold">Welcome to ReFi.Trading</h1>
            </div>
            <p className="text-xl text-gray-400 mb-4">
              Non-custodial AI trading with dual-proof verification
            </p>
            <Badge variant="secondary" className="text-sm">
              Powered by zk-VaR proofs and ACE policy compliance
            </Badge>
            
            {/* Add button to reopen tutorial */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowFirstTimeOverlay(true)}
                className="text-emerald-400 border-emerald-600 hover:bg-emerald-950/20"
              >
                View Tutorial
              </Button>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Choose Your Account Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card 
                    key={type.id}
                    className="hover:border-emerald-700 transition-all cursor-pointer group hover:shadow-lg hover:shadow-emerald-500/10"
                    onClick={() => handleUserTypeSelect(type.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-emerald-950/20 border border-emerald-800 group-hover:bg-emerald-950/40 transition-colors">
                        <Icon className="h-8 w-8 text-emerald-600" />
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {type.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Setup time:</span>
                          <Badge variant="secondary" className="text-xs">
                            {type.setupTime}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button className="w-full group-hover:bg-emerald-700 transition-colors">
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'Non-Custodial',
                description: 'Your keys, your crypto. We never hold your funds.',
                icon: '🔐'
              },
              {
                title: 'AI-Powered',
                description: 'Advanced RL algorithms for automated trading.',
                icon: '🤖'
              },
              {
                title: 'Dual-Proof',
                description: 'zk-VaR proofs + ACE policy for maximum security.',
                icon: '🛡️'
              },
              {
                title: 'Compliant',
                description: 'UAE/GCC regulatory compliance built-in.',
                icon: '✅'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Notice */}
          <Card className="bg-blue-950/20 border-blue-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Security First
              </h3>
              <p className="text-blue-300 mb-4">
                Your security is our priority. All connections are encrypted, API keys are stored securely, 
                and we never have access to your private keys or funds.
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AES-256 Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Zero-Knowledge Proofs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Non-Custodial</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}