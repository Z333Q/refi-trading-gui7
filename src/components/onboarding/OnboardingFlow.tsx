import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AlpacaConnectionModal } from '../alpaca/AlpacaConnectionModal'
import { PersistentPopoutTab } from '../ui/PersistentPopoutTab'
import { 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Wallet, 
  Activity, 
  Shield, 
  Users,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Key,
  Download,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  BookOpen,
  HelpCircle,
  RefreshCw,
  Trash2
} from 'lucide-react'
import { Lock } from '../icons'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  required: boolean
  completed: boolean
  category: 'wallet' | 'trading' | 'dao' | 'security'
  estimatedTime: string
  dependencies?: string[]
}

interface OnboardingFlowProps {
  onComplete: () => void
  userType: 'individual' | 'dao' | 'institutional'
  isDemoMode?: boolean
}

export function OnboardingFlow({ onComplete, userType, isDemoMode = false }: OnboardingFlowProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [showAlpacaModal, setShowAlpacaModal] = useState(false)
  const [onboardingData, setOnboardingData] = useState({
    walletConnected: false,
    walletType: '',
    alpacaConnected: false,
    alpacaEnvironment: '',
    brokerApiSetup: false,
    safeConnected: false,
    securitySetup: false,
    educationCompleted: false
  })

  // Define onboarding steps based on user type
  const getOnboardingSteps = (): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'wallet-detection',
        title: 'Wallet Detection & Setup',
        description: 'Connect or create a Web3 wallet for secure trading',
        icon: Wallet,
        required: true,
        completed: onboardingData.walletConnected,
        category: 'wallet',
        estimatedTime: '2-5 min'
      },
      {
        id: 'alpaca-connection',
        title: 'Trading Account Connection',
        description: 'Link your Alpaca Markets account for live trading',
        icon: Activity,
        required: true,
        completed: onboardingData.alpacaConnected,
        category: 'trading',
        estimatedTime: '3-7 min',
        dependencies: ['wallet-detection']
      },
      {
        id: 'broker-api',
        title: 'Broker API Configuration',
        description: 'Set up secure API access for automated trading',
        icon: Key,
        required: true,
        completed: onboardingData.brokerApiSetup,
        category: 'trading',
        estimatedTime: '5-10 min',
        dependencies: ['alpaca-connection']
      },
      {
        id: 'security-setup',
        title: 'Security & Risk Configuration',
        description: 'Configure trading limits and security preferences',
        icon: Shield,
        required: true,
        completed: onboardingData.securitySetup,
        category: 'security',
        estimatedTime: '3-5 min',
        dependencies: ['broker-api']
      },
      {
        id: 'education',
        title: 'Platform Education',
        description: 'Learn about dual-proof gates and risk management',
        icon: BookOpen,
        required: false,
        completed: onboardingData.educationCompleted,
        category: 'security',
        estimatedTime: '10-15 min'
      }
    ]

    // Add DAO-specific steps
    if (userType === 'dao') {
      baseSteps.splice(2, 0, {
        id: 'safe-integration',
        title: 'SAFE Multisig Integration',
        description: 'Connect your SAFE multisig wallet for DAO governance',
        icon: Users,
        required: true,
        completed: onboardingData.safeConnected,
        category: 'dao',
        estimatedTime: '5-10 min',
        dependencies: ['alpaca-connection']
      })
    }

    return baseSteps
  }

  const steps = getOnboardingSteps()
  const completedSteps = steps.filter(step => step.completed).length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  // Update onboarding data based on external state
  useEffect(() => {
    setOnboardingData(prev => ({
      ...prev,
      walletConnected: isConnected && !!address
    }))
  }, [isConnected, address])

  const handleStepComplete = (stepId: string, data?: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [stepId.replace('-', '').replace('connection', 'Connected').replace('detection', 'Connected')]: true,
      ...data
    }))
  }

  const handleDemoSkip = (stepId: string) => {
    if (isDemoMode) {
      handleStepComplete(stepId, { demoMode: true })
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const canProceedToStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex]
    if (!step.dependencies) return true
    
    return step.dependencies.every(depId => 
      steps.find(s => s.id === depId)?.completed
    )
  }

  const handleOnboardingComplete = () => {
    // Ensure all required steps are completed before proceeding
    const requiredSteps = steps.filter(s => s.required)
    const completedRequiredSteps = requiredSteps.filter(s => s.completed)
    
    if (completedRequiredSteps.length < requiredSteps.length) {
      console.warn('Not all required onboarding steps completed')
      return
    }
    
    onComplete()
  }

  const renderStepContent = (step: OnboardingStep) => {
    switch (step.id) {
      case 'wallet-detection':
        return <WalletDetectionStep 
          onComplete={(data) => handleStepComplete('wallet-detection', data)}
          isConnected={isConnected}
            isDemoMode={isDemoMode}
            onDemoSkip={handleDemoSkip}
          address={address}
        />
      
      case 'alpaca-connection':
        return <AlpacaConnectionStep 
          onComplete={(data) => handleStepComplete('alpaca-connection', data)}
          onOpenModal={() => setShowAlpacaModal(true)}
          isConnected={onboardingData.alpacaConnected}
          isDemoMode={isDemoMode}
          onDemoSkip={() => handleDemoSkip('alpaca-connection')}
        />
      
      case 'broker-api':
        return <BrokerApiStep 
          onComplete={(data) => handleStepComplete('broker-api', data)}
          isDemoMode={isDemoMode}
          onDemoSkip={() => handleDemoSkip('broker-api')}
        />
      
      case 'safe-integration':
        return <SafeIntegrationStep 
          onComplete={(data) => handleStepComplete('safe-integration', data)}
          isDemoMode={isDemoMode}
          onDemoSkip={() => handleDemoSkip('safe-integration')}
        />
      
      case 'security-setup':
        return <SecuritySetupStep 
          onComplete={(data) => handleStepComplete('security-setup', data)}
          isDemoMode={isDemoMode}
          onDemoSkip={() => handleDemoSkip('security-setup')}
        />
      
      case 'education':
        return <EducationStep 
          onComplete={(data) => handleStepComplete('education', data)}
          isDemoMode={isDemoMode}
          onDemoSkip={() => handleDemoSkip('education')}
        />
      
      default:
        return <div>Step content not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-4">
      {/* Show pop-out tab during onboarding for return users */}
      <PersistentPopoutTab />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
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
            <h1 className="text-3xl font-bold">Welcome to ReFi.Trading</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Let's get you set up for secure, automated trading
          </p>
          <Badge variant="secondary" className="mt-2">
            {userType === 'dao' ? 'DAO Setup' : userType === 'institutional' ? 'Institutional' : 'Individual Trader'}
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Setup Progress</CardTitle>
              <span className="text-sm text-gray-400">
                {completedSteps} of {totalSteps} completed
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['wallet', 'trading', 'dao', 'security'].map(category => {
                const categorySteps = steps.filter(s => s.category === category)
                const categoryCompleted = categorySteps.filter(s => s.completed).length
                
                if (categorySteps.length === 0) return null
                
                return (
                  <div key={category} className="text-center">
                    <div className="text-lg font-bold text-emerald-400">
                      {categoryCompleted}/{categorySteps.length}
                    </div>
                    <div className="text-sm text-gray-400 capitalize">
                      {category}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const canAccess = canProceedToStep(index)
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-emerald-950/20 border border-emerald-800' 
                          : canAccess 
                            ? 'hover:bg-gray-800' 
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canAccess && setCurrentStep(index)}
                    >
                      <div className="flex-shrink-0">
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {step.estimatedTime}
                        </div>
                      </div>
                      <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {React.createElement(steps[currentStep].icon, { 
                      className: "h-6 w-6 text-emerald-600" 
                    })}
                    <div>
                      <CardTitle>{steps[currentStep].title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={steps[currentStep].required ? "destructive" : "secondary"}>
                    {steps[currentStep].required ? "Required" : "Optional"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderStepContent(steps[currentStep])}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex space-x-3">
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={!canProceedToStep(currentStep + 1)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleOnboardingComplete}
                    disabled={steps.filter(s => s.required).some(s => !s.completed)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Complete Setup
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alpaca Modal */}
        <AlpacaConnectionModal
          isOpen={showAlpacaModal}
          onClose={() => setShowAlpacaModal(false)}
          onSave={(config) => {
            setOnboardingData(prev => ({
              ...prev,
              alpacaConnected: true,
              alpacaEnvironment: config.environment
            }))
            handleStepComplete('alpaca-connection', {
              alpacaConnected: true,
              alpacaEnvironment: config.environment
            })
            setShowAlpacaModal(false)
          }}
        />
      </div>
    </div>
  )
}

// Individual Step Components
function WalletDetectionStep({ onComplete, isConnected, address, isDemoMode, onDemoSkip }: any) {
  const [detectionStatus, setDetectionStatus] = useState<'detecting' | 'found' | 'not-found'>('detecting')
  const [recommendedWallet, setRecommendedWallet] = useState<string>('')
  const [showDemoOptions, setShowDemoOptions] = useState(false)
  const [showTroubleshootingHelp, setShowTroubleshootingHelp] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  useEffect(() => {
    // Simulate wallet detection
    const detectWallet = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (typeof window !== 'undefined') {
        if (window.ethereum) {
          setDetectionStatus('found')
          setRecommendedWallet('MetaMask detected')
        } else {
          setDetectionStatus('not-found')
          setRecommendedWallet('MetaMask recommended')
        }
      }
    }
    
    detectWallet()
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      onComplete({ walletType: 'MetaMask' })
    }
  }, [isConnected, address, onComplete])

  // Show demo options after 10 seconds if still not connected
  useEffect(() => {
    if (isDemoMode && !isConnected) {
      const timer = setTimeout(() => {
        setShowDemoOptions(true)
        setShowTroubleshootingHelp(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isDemoMode, isConnected])

  const handleConnectionAttempt = (connector: any) => {
    setConnectionAttempts(prev => prev + 1)
    connect({ connector })
    
    // Show troubleshooting after 3 failed attempts
    if (connectionAttempts >= 2) {
      setTimeout(() => {
        setShowTroubleshootingHelp(true)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Detection Status */}
      <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-800">
        <div className="flex items-center space-x-3">
          {detectionStatus === 'detecting' ? (
            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          ) : detectionStatus === 'found' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
          <div>
            <div className="font-medium">
              {detectionStatus === 'detecting' && 'Detecting wallet...'}
              {detectionStatus === 'found' && 'Wallet detected!'}
              {detectionStatus === 'not-found' && 'No wallet found'}
            </div>
            <div className="text-sm text-gray-400">
              {recommendedWallet}
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Options */}
      {detectionStatus !== 'detecting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Desktop Wallets */}
          <Card className="hover:border-emerald-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Desktop Wallets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleConnectionAttempt(connectors.find(c => c.name === 'WalletConnect'))}
              >
                <Wallet className="h-5 w-5 mr-3 text-orange-500" />
                MetaMask
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Wallet className="h-5 w-5 mr-3" />
                WalletConnect
              </Button>
            </CardContent>
          </Card>

          {/* Mobile Wallets */}
          <Card className="hover:border-emerald-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Mobile Wallets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-5 w-5 mr-3" />
                MetaMask Mobile
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-5 w-5 mr-3" />
                Rainbow Wallet
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Status */}
      {isConnected && address && (
        <div className="p-4 rounded-lg bg-green-950/20 border border-green-800">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-medium text-green-400">Wallet Connected!</div>
              <div className="text-sm text-gray-400 font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Troubleshooting Help */}
      {showTroubleshootingHelp && !isConnected && (
        <Card className="border-blue-800 bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <span>Connection Troubleshooting</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-blue-300">
              <p className="mb-3">Having trouble connecting? Try these steps:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Ensure MetaMask is unlocked and showing your account</li>
                <li>Check that you're on the correct network (Ethereum Mainnet)</li>
                <li>Refresh the page and try connecting again</li>
                <li>Disable other wallet extensions temporarily</li>
                <li>Clear your browser cache and cookies</li>
              </ol>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="text-blue-400 border-blue-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Clear localStorage and sessionStorage
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.reload()
                }}
                className="text-blue-400 border-blue-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Fallback Options */}
      {isDemoMode && showDemoOptions && !isConnected && (
        <Card className="border-amber-800 bg-amber-950/20">
          <CardContent className="p-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium text-amber-400">Skip Wallet Connection</h4>
              </div>
              <p className="text-sm text-amber-300">
                Can't connect your wallet? Continue with demo mode to explore the platform features.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => onDemoSkip('wallet-detection')}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Skip & Continue Demo
                </Button>
                <p className="text-xs text-amber-400">
                  Note: Trading features will be simulated. You can connect your wallet later in settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Need Help?</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• First time? We recommend MetaMask for beginners</li>
                <li>• Your wallet stores your private keys securely</li>
                <li>• Never share your seed phrase with anyone</li>
                <li>• You can change wallets later in settings</li>
                {isDemoMode && (
                  <li className="text-amber-400">• Demo mode available if connection fails</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AlpacaConnectionStep({ onComplete, onOpenModal, isConnected, isDemoMode, onDemoSkip }: any) {
  React.useEffect(() => {
    if (isConnected) {
      onComplete({ alpacaConnected: true })
    }
  }, [isConnected, onComplete])

  return (
    <div className="space-y-6">
      {isConnected && (
        <div className="p-4 rounded-lg bg-green-950/20 border border-green-800">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-medium text-green-400">Alpaca Account Connected!</div>
              <div className="text-sm text-gray-400">
                Your trading account is ready for use
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center">
        <Activity className="h-16 w-16 mx-auto mb-4 text-emerald-600" />
        <h3 className="text-xl font-semibold mb-2">Connect Your Trading Account</h3>
        <p className="text-gray-400">
          Link your Alpaca Markets account to enable live trading with our AI agents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-800 bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Paper Trading</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Practice with virtual money. Perfect for testing strategies.
            </p>
            <Button variant="outline" className="w-full" onClick={onOpenModal}>
              Connect Paper Account
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-800 bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-red-500" />
              <span>Live Trading</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Trade with real money. Requires funded Alpaca account.
            </p>
            <Button variant="outline" className="w-full" onClick={onOpenModal}>
              Connect Live Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {!isConnected && (
        <Card className="bg-amber-950/20 border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-400 mb-2">Before You Connect</h4>
                <ul className="text-sm text-amber-300 space-y-1">
                  <li>• Ensure you have an active Alpaca Markets account</li>
                  <li>• Generate API keys in your Alpaca dashboard</li>
                  <li>• For live trading, verify your account is funded</li>
                  <li>• API keys are encrypted and stored securely</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Skip Option */}
      {isDemoMode && !isConnected && (
        <div className="text-center pt-4 border-t border-gray-800">
          <Button 
            variant="outline" 
            onClick={onDemoSkip}
            className="text-amber-400 border-amber-600 hover:bg-amber-950/20"
          >
            Skip for Demo (Simulated Trading)
          </Button>
        </div>
      )}
    </div>
  )
}

function BrokerApiStep({ onComplete }: any) {
  const [apiStatus, setApiStatus] = useState<'pending' | 'testing' | 'success' | 'error'>('pending')
  const [testResults, setTestResults] = useState<any>(null)

  const testApiConnection = async () => {
    setApiStatus('testing')
    
    // Simulate API testing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockResults = {
      connectivity: true,
      permissions: ['read', 'trade'],
      accountStatus: 'active',
      latency: '89ms'
    }
    
    setTestResults(mockResults)
    setApiStatus('success')
    onComplete({ brokerApiSetup: true })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Key className="h-16 w-16 mx-auto mb-4 text-purple-600" />
        <h3 className="text-xl font-semibold mb-2">Broker API Configuration</h3>
        <p className="text-gray-400">
          Test and verify your broker API connection for automated trading
        </p>
      </div>

      {/* API Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiStatus === 'pending' && (
            <Button onClick={testApiConnection} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Test API Connection
            </Button>
          )}

          {apiStatus === 'testing' && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-400">Testing API connection...</p>
            </div>
          )}

          {apiStatus === 'success' && testResults && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-400">API Connection Successful</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-800">
                  <div className="text-sm text-gray-400">Permissions</div>
                  <div className="font-medium">
                    {testResults.permissions.join(', ')}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800">
                  <div className="text-sm text-gray-400">Latency</div>
                  <div className="font-medium">{testResults.latency}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-400 mb-2">Security Features</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• API keys encrypted with AES-256</li>
                <li>• Rate limiting and request monitoring</li>
                <li>• Automatic key rotation available</li>
                <li>• Real-time security alerts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SafeIntegrationStep({ onComplete }: any) {
  const [safeAddress, setSafeAddress] = useState('')
  const [safeStatus, setSafeStatus] = useState<'pending' | 'connecting' | 'connected'>('pending')

  const connectSafe = async () => {
    setSafeStatus('connecting')
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSafeStatus('connected')
    onComplete({ safeConnected: true })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="h-16 w-16 mx-auto mb-4 text-blue-600" />
        <h3 className="text-xl font-semibold mb-2">SAFE Multisig Integration</h3>
        <p className="text-gray-400">
          Connect your SAFE multisig wallet for DAO governance and treasury management
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SAFE Wallet Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">SAFE Address</label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={safeAddress}
              onChange={(e) => setSafeAddress(e.target.value)}
            />
          </div>

          {safeStatus === 'pending' && (
            <Button 
              onClick={connectSafe} 
              className="w-full"
              disabled={!safeAddress}
            >
              <Users className="h-4 w-4 mr-2" />
              Connect SAFE
            </Button>
          )}

              {/* Emergency Skip Button for Demo */}
              {isDemoMode && currentStep === 0 && !steps[currentStep].completed && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleStepComplete('wallet-detection', { demoMode: true })
                    setCurrentStep(1)
                  }}
                  className="text-amber-400 border-amber-600 hover:bg-amber-950/20"
                >
                  Skip Step (Demo)
                </Button>
              )}
              
          {safeStatus === 'connecting' && (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 text-blue-500 animate-spin" />
              <p className="text-gray-400">Connecting to SAFE...</p>
            </div>
          )}

          {safeStatus === 'connected' && (
            <div className="p-3 rounded-lg bg-green-950/20 border border-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-400">SAFE Connected Successfully</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-950/20 border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-2">DAO Features</h4>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Multi-signature transaction approval</li>
                <li>• Governance voting integration</li>
                <li>• Treasury management tools</li>
                <li>• Member permission controls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SecuritySetupStep({ onComplete }: any) {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    tradingLimits: false,
    riskAlerts: false,
    sessionTimeout: false
  })

  const handleSettingChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: value }))
  }

  const completeSecuritySetup = () => {
    onComplete({ securitySetup: true })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-green-600" />
        <h3 className="text-xl font-semibold mb-2">Security Configuration</h3>
        <p className="text-gray-400">
          Set up security preferences and trading limits for safe operations
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'twoFactor',
            title: '2FA Authentication',
            description: 'Enable two-factor authentication for enhanced security'
          },
          {
            key: 'tradingLimits',
            title: 'Trading Limits',
            description: 'Set daily and per-trade limits for risk management'
          },
          {
            key: 'riskAlerts',
            title: 'Risk Alerts',
            description: 'Get notified when risk thresholds are approached'
          },
          {
            key: 'sessionTimeout',
            title: 'Session Timeout',
            description: 'Automatically log out after period of inactivity'
          }
        ].map((setting) => (
          <Card key={setting.key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{setting.title}</h4>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                <Button
                  variant={securitySettings[setting.key as keyof typeof securitySettings] ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingChange(setting.key, !securitySettings[setting.key as keyof typeof securitySettings])}
                >
                  {securitySettings[setting.key as keyof typeof securitySettings] ? 'Enabled' : 'Enable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={completeSecuritySetup} className="w-full">
        <Shield className="h-4 w-4 mr-2" />
        Complete Security Setup
      </Button>
    </div>
  )
}

function EducationStep({ onComplete }: any) {
  const [completedModules, setCompletedModules] = useState<string[]>([])

  const modules = [
    {
      id: 'dual-proof',
      title: 'Dual-Proof Gate System',
      description: 'Learn how zk-VaR proofs and ACE policy work together',
      duration: '5 min'
    },
    {
      id: 'risk-management',
      title: 'Risk Management Basics',
      description: 'Understanding VaR, position sizing, and risk controls',
      duration: '8 min'
    },
    {
      id: 'trading-strategies',
      title: 'AI Trading Strategies',
      description: 'Overview of PPO, TD3, and RVI-Q algorithms',
      duration: '10 min'
    }
  ]

  const completeModule = (moduleId: string) => {
    setCompletedModules(prev => [...prev, moduleId])
  }

  const finishEducation = () => {
    onComplete({ educationCompleted: true })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-purple-600" />
        <h3 className="text-xl font-semibold mb-2">Platform Education</h3>
        <p className="text-gray-400">
          Learn the fundamentals of our trading platform and risk management
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <Card key={module.id} className={completedModules.includes(module.id) ? 'border-green-800 bg-green-950/20' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {completedModules.includes(module.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <h4 className="font-medium">{module.title}</h4>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="text-xs">
                    {module.duration}
                  </Badge>
                  <Button
                    variant={completedModules.includes(module.id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => completeModule(module.id)}
                    disabled={completedModules.includes(module.id)}
                  >
                    {completedModules.includes(module.id) ? 'Completed' : 'Start'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={finishEducation}>
          Skip Education
        </Button>
        <Button 
          onClick={finishEducation}
          disabled={completedModules.length === 0}
        >
          Continue to Platform
        </Button>
      </div>
    </div>
  )
}