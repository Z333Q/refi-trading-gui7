import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { 
  Shield, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Calculator,
  Lock,
  Zap,
  Target,
  BarChart3,
  Activity,
  Users,
  BookOpen,
  Award,
  Lightbulb,
  HelpCircle,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface ZkVarOnboardingFlowProps {
  onComplete: (config: AgentDeploymentConfig) => void
  onBack: () => void
}

interface RiskProfile {
  tolerance: 'conservative' | 'moderate' | 'aggressive'
  timeHorizon: '1-3months' | '3-12months' | '1-3years' | '3+years'
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  portfolioSize: 'small' | 'medium' | 'large' | 'institutional'
  objectives: string[]
}

interface AgentDeploymentConfig {
  riskTier: 'low' | 'medium' | 'high'
  agentTypes: string[]
  zkVarSettings: {
    confidenceLevel: number
    timeHorizon: number
    rebalanceFrequency: string
    privacyLevel: 'standard' | 'enhanced' | 'maximum'
  }
  riskProfile: RiskProfile
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to zk-VaR',
    subtitle: 'Privacy-Preserving Risk Management',
    component: 'WelcomeStep'
  },
  {
    id: 'education',
    title: 'Understanding zk-VaR',
    subtitle: 'Learn the Fundamentals',
    component: 'EducationStep'
  },
  {
    id: 'risk-assessment',
    title: 'Risk Profile Assessment',
    subtitle: 'Determine Your Risk Tolerance',
    component: 'RiskAssessmentStep'
  },
  {
    id: 'agent-selection',
    title: 'Agent Deployment Selection',
    subtitle: 'Choose Your Trading Strategy',
    component: 'AgentSelectionStep'
  },
  {
    id: 'privacy-settings',
    title: 'Privacy Configuration',
    subtitle: 'Configure Zero-Knowledge Settings',
    component: 'PrivacySettingsStep'
  },
  {
    id: 'verification',
    title: 'Verification & Deployment',
    subtitle: 'Confirm Your Configuration',
    component: 'VerificationStep'
  }
]

export function ZkVarOnboardingFlow({ onComplete, onBack }: ZkVarOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [riskProfile, setRiskProfile] = useState<RiskProfile>({
    tolerance: 'moderate',
    timeHorizon: '3-12months',
    experience: 'intermediate',
    portfolioSize: 'medium',
    objectives: []
  })
  const [deploymentConfig, setDeploymentConfig] = useState<AgentDeploymentConfig>({
    riskTier: 'medium',
    agentTypes: [],
    zkVarSettings: {
      confidenceLevel: 95,
      timeHorizon: 1,
      rebalanceFrequency: 'daily',
      privacyLevel: 'standard'
    },
    riskProfile: riskProfile
  })
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete({ ...deploymentConfig, riskProfile })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const renderStepContent = () => {
    switch (onboardingSteps[currentStep].component) {
      case 'WelcomeStep':
        return <WelcomeStep />
      case 'EducationStep':
        return <EducationStep />
      case 'RiskAssessmentStep':
        return (
          <RiskAssessmentStep 
            riskProfile={riskProfile}
            onUpdate={setRiskProfile}
          />
        )
      case 'AgentSelectionStep':
        return (
          <AgentSelectionStep 
            riskProfile={riskProfile}
            config={deploymentConfig}
            onUpdate={setDeploymentConfig}
          />
        )
      case 'PrivacySettingsStep':
        return (
          <PrivacySettingsStep 
            config={deploymentConfig}
            onUpdate={setDeploymentConfig}
          />
        )
      case 'VerificationStep':
        return (
          <VerificationStep 
            config={deploymentConfig}
            riskProfile={riskProfile}
          />
        )
      default:
        return <div>Step not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">zk-VaR Agent Deployment</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {onboardingSteps[currentStep].subtitle}
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-400">{currentStep + 1} of {onboardingSteps.length}</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
              {onboardingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentStep ? 'bg-green-600 text-white' :
                    index === currentStep ? 'bg-blue-600 text-white' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {completedSteps.has(index) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16 truncate">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{onboardingSteps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? 'Back to Setup' : 'Previous'}
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                Deploy Agents
                <Target className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step Components
function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Shield className="h-24 w-24 text-blue-500 animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <Lock className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4">Welcome to zk-VaR Trading</h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          Experience the future of risk management with <strong>Zero-Knowledge Value at Risk</strong> - 
          where mathematical precision meets complete privacy protection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-800 text-center">
          <Eye className="h-8 w-8 mx-auto mb-3 text-blue-500" />
          <h4 className="font-semibold text-blue-400 mb-2">Complete Privacy</h4>
          <p className="text-sm text-gray-400">
            Your portfolio data never leaves your control. Zero-knowledge proofs verify risk without revealing positions.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-green-950/20 border border-green-800 text-center">
          <Calculator className="h-8 w-8 mx-auto mb-3 text-green-500" />
          <h4 className="font-semibold text-green-400 mb-2">Mathematical Precision</h4>
          <p className="text-sm text-gray-400">
            Advanced VaR calculations provide accurate risk assessments for optimal position sizing.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-800 text-center">
          <Brain className="h-8 w-8 mx-auto mb-3 text-purple-500" />
          <h4 className="font-semibold text-purple-400 mb-2">Intelligent Agents</h4>
          <p className="text-sm text-gray-400">
            Deploy AI trading agents that respect your risk limits while maximizing opportunities.
          </p>
        </div>
      </div>

      <div className="bg-amber-950/20 border border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-400 mb-2">What You'll Learn</h4>
            <ul className="text-sm text-amber-300 space-y-1">
              <li>• How zero-knowledge proofs protect your privacy</li>
              <li>• Value at Risk (VaR) fundamentals and applications</li>
              <li>• Agent deployment strategies for different risk profiles</li>
              <li>• Privacy settings and security configurations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function EducationStep() {
  const [activeTab, setActiveTab] = useState('zk-proofs')

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zk-proofs">Zero-Knowledge Proofs</TabsTrigger>
          <TabsTrigger value="var-basics">VaR Fundamentals</TabsTrigger>
          <TabsTrigger value="agent-types">Agent Types</TabsTrigger>
        </TabsList>

        <TabsContent value="zk-proofs" className="space-y-4">
          <div className="text-center mb-6">
            <Lock className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-gray-400">Prove you know something without revealing what you know</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-950/20 border-green-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-400 mb-2">Traditional Risk Assessment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-4 w-4 text-red-500" />
                    <span>Portfolio data exposed to third parties</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-4 w-4 text-red-500" />
                    <span>Trading strategies become public</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-4 w-4 text-red-500" />
                    <span>Regulatory compliance requires disclosure</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-950/20 border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-400 mb-2">zk-VaR Approach</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span>Portfolio data stays completely private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span>Strategies remain confidential</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span>Compliance without data exposure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-3">How It Works</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">1</div>
                <div>
                  <div className="font-medium">Generate Proof</div>
                  <div className="text-sm text-gray-400">Your device creates a cryptographic proof of your risk metrics</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">2</div>
                <div>
                  <div className="font-medium">Verify Compliance</div>
                  <div className="text-sm text-gray-400">Network verifies your risk is within acceptable limits</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">3</div>
                <div>
                  <div className="font-medium">Execute Trades</div>
                  <div className="text-sm text-gray-400">Agents execute trades knowing risk is mathematically verified</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="var-basics" className="space-y-4">
          <div className="text-center mb-6">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold mb-2">Value at Risk (VaR)</h3>
            <p className="text-gray-400">Quantify potential losses with statistical confidence</p>
          </div>

          <div className="bg-red-950/20 border border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-400 mb-3">VaR Definition</h4>
            <p className="text-gray-300 mb-3">
              VaR answers the question: <em>"What is the maximum amount I could lose over a specific time period with X% confidence?"</em>
            </p>
            <div className="bg-gray-900 p-3 rounded font-mono text-sm">
              95% VaR of $10,000 over 1 day = "There's only a 5% chance of losing more than $10,000 tomorrow"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-950/20 border-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">90%</div>
                <div className="text-sm text-gray-400">Conservative</div>
                <div className="text-xs text-gray-500 mt-1">Lower confidence, more frequent breaches</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-950/20 border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-sm text-gray-400">Standard</div>
                <div className="text-xs text-gray-500 mt-1">Industry standard, balanced approach</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-950/20 border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">99%</div>
                <div className="text-sm text-gray-400">Conservative</div>
                <div className="text-xs text-gray-500 mt-1">High confidence, rare breaches</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">VaR Calculation Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-gray-800 border border-gray-700">
                <div className="font-medium text-blue-400">Historical</div>
                <div className="text-xs text-gray-400 mt-1">Uses past price movements to predict future risk</div>
              </div>
              <div className="p-3 rounded bg-gray-800 border border-gray-700">
                <div className="font-medium text-green-400">Parametric</div>
                <div className="text-xs text-gray-400 mt-1">Assumes normal distribution of returns</div>
              </div>
              <div className="p-3 rounded bg-gray-800 border border-gray-700">
                <div className="font-medium text-purple-400">Monte Carlo</div>
                <div className="text-xs text-gray-400 mt-1">Simulates thousands of possible outcomes</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agent-types" className="space-y-4">
          <div className="text-center mb-6">
            <Brain className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-bold mb-2">Trading Agent Types</h3>
            <p className="text-gray-400">Different strategies for different risk appetites</p>
          </div>

          <div className="space-y-4">
            <Card className="bg-green-950/20 border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-6 w-6 text-green-500" />
                  <h4 className="font-semibold text-green-400">Conservative Agents</h4>
                  <Badge variant="success" className="text-xs">Low Risk</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Characteristics:</div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Maximum 2% daily VaR</li>
                      <li>• Focus on capital preservation</li>
                      <li>• Lower volatility strategies</li>
                      <li>• Frequent rebalancing</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Best For:</div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Risk-averse investors</li>
                      <li>• Retirement portfolios</li>
                      <li>• Stable income needs</li>
                      <li>• Market uncertainty</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-950/20 border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                  <h4 className="font-semibold text-blue-400">Balanced Agents</h4>
                  <Badge variant="secondary" className="text-xs">Medium Risk</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Characteristics:</div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 2-5% daily VaR range</li>
                      <li>• Growth with protection</li>
                      <li>• Diversified strategies</li>
                      <li>• Adaptive positioning</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Best For:</div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Moderate risk tolerance</li>
                      <li>• Long-term growth</li>
                      <li>• Balanced portfolios</li>
                      <li>• Most investors</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-950/20 border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                  <h4 className="font-semibold text-red-400">Aggressive Agents</h4>
                  <Badge variant="destructive" className="text-xs">High Risk</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Characteristics:</div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 5%+ daily VaR exposure</li>
                      <li>• Maximum growth focus</li>
                      <li>• High volatility tolerance</li>
                      <li>• Opportunistic strategies</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Best For:</div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• High risk tolerance</li>
                      <li>• Growth portfolios</li>
                      <li>• Experienced traders</li>
                      <li>• Bull markets</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RiskAssessmentStep({ riskProfile, onUpdate }: { 
  riskProfile: RiskProfile
  onUpdate: (profile: RiskProfile) => void 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const questions = [
    {
      id: 'experience',
      title: 'Trading Experience',
      question: 'How would you describe your trading experience?',
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner', description: 'New to trading, learning the basics' },
        { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience, understand key concepts' },
        { value: 'advanced', label: 'Advanced', description: '3+ years, experienced with various strategies' },
        { value: 'expert', label: 'Expert', description: 'Professional trader or extensive experience' }
      ]
    },
    {
      id: 'tolerance',
      title: 'Risk Tolerance',
      question: 'If your portfolio dropped 20% in a month, what would you do?',
      type: 'single',
      options: [
        { value: 'conservative', label: 'Sell immediately', description: 'Preserve remaining capital' },
        { value: 'moderate', label: 'Hold and wait', description: 'Wait for recovery' },
        { value: 'aggressive', label: 'Buy more', description: 'See it as an opportunity' }
      ]
    },
    {
      id: 'timeHorizon',
      title: 'Investment Timeline',
      question: 'What is your investment time horizon?',
      type: 'single',
      options: [
        { value: '1-3months', label: '1-3 months', description: 'Short-term trading' },
        { value: '3-12months', label: '3-12 months', description: 'Medium-term positions' },
        { value: '1-3years', label: '1-3 years', description: 'Long-term growth' },
        { value: '3+years', label: '3+ years', description: 'Very long-term investing' }
      ]
    },
    {
      id: 'portfolioSize',
      title: 'Portfolio Size',
      question: 'What is your approximate portfolio size?',
      type: 'single',
      options: [
        { value: 'small', label: 'Under $50K', description: 'Building initial wealth' },
        { value: 'medium', label: '$50K - $500K', description: 'Growing portfolio' },
        { value: 'large', label: '$500K - $5M', description: 'Substantial assets' },
        { value: 'institutional', label: 'Over $5M', description: 'Institutional level' }
      ]
    },
    {
      id: 'objectives',
      title: 'Investment Objectives',
      question: 'What are your primary investment goals? (Select all that apply)',
      type: 'multiple',
      options: [
        { value: 'capital_preservation', label: 'Capital Preservation', description: 'Protect existing wealth' },
        { value: 'income_generation', label: 'Income Generation', description: 'Regular cash flow' },
        { value: 'growth', label: 'Capital Growth', description: 'Increase portfolio value' },
        { value: 'speculation', label: 'Speculation', description: 'High-risk, high-reward opportunities' }
      ]
    }
  ]

  const handleAnswer = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    
    // Update risk profile
    const updatedProfile = { ...riskProfile }
    Object.keys(newAnswers).forEach(key => {
      if (key in updatedProfile) {
        (updatedProfile as any)[key] = newAnswers[key]
      }
    })
    onUpdate(updatedProfile)
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = answers[currentQ.id] !== undefined
  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-16 w-16 mx-auto mb-4 text-blue-500" />
        <h3 className="text-xl font-bold mb-2">Risk Profile Assessment</h3>
        <p className="text-gray-400">Help us understand your risk tolerance and investment goals</p>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
        <span className="text-gray-400">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
      </div>
      <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-6" />

      <Card className="bg-blue-950/20 border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.title}</CardTitle>
          <p className="text-gray-400">{currentQ.question}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option) => (
            <div
              key={option.value}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                (currentQ.type === 'single' && answers[currentQ.id] === option.value) ||
                (currentQ.type === 'multiple' && answers[currentQ.id]?.includes(option.value))
                  ? 'border-blue-500 bg-blue-950/40'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => {
                if (currentQ.type === 'single') {
                  handleAnswer(currentQ.id, option.value)
                } else {
                  const current = answers[currentQ.id] || []
                  const updated = current.includes(option.value)
                    ? current.filter((v: string) => v !== option.value)
                    : [...current, option.value]
                  handleAnswer(currentQ.id, updated)
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  (currentQ.type === 'single' && answers[currentQ.id] === option.value) ||
                  (currentQ.type === 'multiple' && answers[currentQ.id]?.includes(option.value))
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-500'
                }`}>
                  {((currentQ.type === 'single' && answers[currentQ.id] === option.value) ||
                    (currentQ.type === 'multiple' && answers[currentQ.id]?.includes(option.value))) && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-400">{option.description}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          disabled={!isAnswered || currentQuestion === questions.length - 1}
        >
          Next Question
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {allAnswered && (
        <Card className="bg-green-950/20 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-400">Assessment Complete!</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Based on your answers, we'll recommend the most suitable agent deployment strategy.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AgentSelectionStep({ 
  riskProfile, 
  config, 
  onUpdate 
}: { 
  riskProfile: RiskProfile
  config: AgentDeploymentConfig
  onUpdate: (config: AgentDeploymentConfig) => void 
}) {
  const getRecommendedTier = (): 'low' | 'medium' | 'high' => {
    if (riskProfile.tolerance === 'conservative' || riskProfile.experience === 'beginner') {
      return 'low'
    } else if (riskProfile.tolerance === 'aggressive' && riskProfile.experience === 'expert') {
      return 'high'
    }
    return 'medium'
  }

  const recommendedTier = getRecommendedTier()

  const riskTiers = [
    {
      id: 'low' as const,
      name: 'Conservative Agents',
      subtitle: 'Capital Preservation Focus',
      icon: Shield,
      color: 'green',
      maxVaR: '2%',
      expectedReturn: '5-8%',
      volatility: 'Low',
      rebalanceFreq: 'Daily',
      strategies: ['Mean Reversion', 'Momentum (Conservative)', 'Volatility Arbitrage'],
      features: [
        'Maximum 2% daily VaR',
        'Capital preservation priority',
        'Lower volatility strategies',
        'Frequent risk monitoring',
        'Automatic stop-losses'
      ],
      warnings: [
        'Lower potential returns',
        'May underperform in bull markets'
      ]
    },
    {
      id: 'medium' as const,
      name: 'Balanced Agents',
      subtitle: 'Growth with Protection',
      icon: BarChart3,
      color: 'blue',
      maxVaR: '5%',
      expectedReturn: '8-15%',
      volatility: 'Medium',
      rebalanceFreq: 'Daily',
      strategies: ['Trend Following', 'Mean Reversion', 'Momentum', 'Pairs Trading'],
      features: [
        '2-5% daily VaR range',
        'Balanced risk-return profile',
        'Diversified strategy mix',
        'Adaptive position sizing',
        'Market regime detection'
      ],
      warnings: [
        'Moderate volatility expected',
        'Potential for drawdowns'
      ]
    },
    {
      id: 'high' as const,
      name: 'Aggressive Agents',
      subtitle: 'Maximum Growth Potential',
      icon: TrendingUp,
      color: 'red',
      maxVaR: '10%',
      expectedReturn: '15-25%',
      volatility: 'High',
      rebalanceFreq: 'Intraday',
      strategies: ['Momentum', 'Breakout', 'High-Frequency', 'Leveraged Strategies'],
      features: [
        '5-10% daily VaR exposure',
        'Maximum growth focus',
        'High-frequency strategies',
        'Leveraged positions',
        'Opportunistic trading'
      ],
      warnings: [
        'High volatility and drawdowns',
        'Requires experience and risk tolerance',
        'Potential for significant losses'
      ]
    }
  ]

  const selectedTier = riskTiers.find(tier => tier.id === config.riskTier) || riskTiers[1]

  const handleTierSelect = (tierId: 'low' | 'medium' | 'high') => {
    const tier = riskTiers.find(t => t.id === tierId)!
    onUpdate({
      ...config,
      riskTier: tierId,
      agentTypes: tier.strategies,
      zkVarSettings: {
        ...config.zkVarSettings,
        confidenceLevel: tierId === 'low' ? 99 : tierId === 'medium' ? 95 : 90
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="h-16 w-16 mx-auto mb-4 text-purple-500" />
        <h3 className="text-xl font-bold mb-2">Agent Deployment Selection</h3>
        <p className="text-gray-400">Choose your trading agent risk tier based on your profile</p>
      </div>

      {/* Recommendation */}
      <Card className="bg-blue-950/20 border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-400">Recommended for You</span>
          </div>
          <p className="text-sm text-gray-300">
            Based on your risk assessment, we recommend <strong>{riskTiers.find(t => t.id === recommendedTier)?.name}</strong> 
            {' '}for your experience level and risk tolerance.
          </p>
        </CardContent>
      </Card>

      {/* Risk Tier Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {riskTiers.map((tier) => {
          const Icon = tier.icon
          const isSelected = config.riskTier === tier.id
          const isRecommended = recommendedTier === tier.id
          
          return (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? `border-${tier.color}-500 bg-${tier.color}-950/30`
                  : `border-gray-700 hover:border-${tier.color}-600`
              } ${isRecommended ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleTierSelect(tier.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 text-${tier.color}-500`} />
                    <div>
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <p className="text-sm text-gray-400">{tier.subtitle}</p>
                    </div>
                  </div>
                  {isRecommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Max VaR:</span>
                    <div className="font-medium">{tier.maxVaR}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Expected Return:</span>
                    <div className="font-medium">{tier.expectedReturn}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Volatility:</span>
                    <div className="font-medium">{tier.volatility}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Rebalancing:</span>
                    <div className="font-medium">{tier.rebalanceFreq}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Key Features:</div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {tier.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                {tier.warnings.length > 0 && (
                  <div className="bg-amber-950/20 border border-amber-800 rounded p-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-medium text-amber-400">Considerations:</span>
                    </div>
                    <ul className="text-xs text-amber-300 space-y-1">
                      {tier.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Tier Details */}
      {config.riskTier && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <selectedTier.icon className={`h-5 w-5 text-${selectedTier.color}-500`} />
              <span>Selected: {selectedTier.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Available Strategies:</div>
              <div className="flex flex-wrap gap-2">
                {selectedTier.strategies.map((strategy) => (
                  <Badge key={strategy} variant="secondary" className="text-xs">
                    {strategy}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">All Features:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTier.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PrivacySettingsStep({ 
  config, 
  onUpdate 
}: { 
  config: AgentDeploymentConfig
  onUpdate: (config: AgentDeploymentConfig) => void 
}) {
  const privacyLevels = [
    {
      id: 'standard' as const,
      name: 'Standard Privacy',
      description: 'Basic zero-knowledge proofs with standard encryption',
      features: [
        'Portfolio positions remain private',
        'Risk metrics verified without disclosure',
        'Standard zk-SNARK proofs',
        'Basic audit trail protection'
      ],
      performance: 'Fastest verification',
      gasUsage: 'Lowest gas costs'
    },
    {
      id: 'enhanced' as const,
      name: 'Enhanced Privacy',
      description: 'Advanced privacy with additional obfuscation layers',
      features: [
        'All standard privacy features',
        'Trading pattern obfuscation',
        'Enhanced proof complexity',
        'Metadata privacy protection'
      ],
      performance: 'Moderate verification time',
      gasUsage: 'Medium gas costs'
    },
    {
      id: 'maximum' as const,
      name: 'Maximum Privacy',
      description: 'Highest privacy with advanced cryptographic techniques',
      features: [
        'All enhanced privacy features',
        'Multi-layer proof composition',
        'Advanced timing obfuscation',
        'Complete transaction unlinkability'
      ],
      performance: 'Slower verification',
      gasUsage: 'Higher gas costs'
    }
  ]

  const handlePrivacyLevelChange = (level: 'standard' | 'enhanced' | 'maximum') => {
    onUpdate({
      ...config,
      zkVarSettings: {
        ...config.zkVarSettings,
        privacyLevel: level
      }
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    onUpdate({
      ...config,
      zkVarSettings: {
        ...config.zkVarSettings,
        [key]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold mb-2">Privacy Configuration</h3>
        <p className="text-gray-400">Configure your zero-knowledge proof settings</p>
      </div>

      {/* Privacy Level Selection */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Privacy Level</h4>
        <div className="space-y-3">
          {privacyLevels.map((level) => (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all ${
                config.zkVarSettings.privacyLevel === level.id
                  ? 'border-green-500 bg-green-950/20'
                  : 'border-gray-700 hover:border-green-600'
              }`}
              onClick={() => handlePrivacyLevelChange(level.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-green-400">{level.name}</h5>
                    <p className="text-sm text-gray-400">{level.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    config.zkVarSettings.privacyLevel === level.id
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-500'
                  }`}>
                    {config.zkVarSettings.privacyLevel === level.id && (
                      <CheckCircle className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Features:</div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {level.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Performance:</span>
                      <span className="text-gray-300">{level.performance}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Gas Usage:</span>
                      <span className="text-gray-300">{level.gasUsage}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <Card className="bg-blue-950/20 border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <span>Advanced zk-VaR Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Confidence Level</label>
              <select
                value={config.zkVarSettings.confidenceLevel}
                onChange={(e) => handleSettingChange('confidenceLevel', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
              >
                <option value={90}>90% (More frequent breaches)</option>
                <option value={95}>95% (Standard)</option>
                <option value={99}>99% (Conservative)</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Time Horizon (Days)</label>
              <select
                value={config.zkVarSettings.timeHorizon}
                onChange={(e) => handleSettingChange('timeHorizon', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
              >
                <option value={1}>1 Day</option>
                <option value={7}>1 Week</option>
                <option value={30}>1 Month</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Rebalance Frequency</label>
              <select
                value={config.zkVarSettings.rebalanceFrequency}
                onChange={(e) => handleSettingChange('rebalanceFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
              >
                <option value="intraday">Intraday</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Impact Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Privacy Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded bg-green-950/20 border border-green-800">
              <Eye className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-sm font-medium text-green-400">Data Privacy</div>
              <div className="text-xs text-gray-400 mt-1">
                Portfolio positions completely hidden
              </div>
            </div>
            <div className="p-3 rounded bg-blue-950/20 border border-blue-800">
              <Shield className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-sm font-medium text-blue-400">Proof Verification</div>
              <div className="text-xs text-gray-400 mt-1">
                Risk compliance without disclosure
              </div>
            </div>
            <div className="p-3 rounded bg-purple-950/20 border border-purple-800">
              <Zap className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="text-sm font-medium text-purple-400">Performance</div>
              <div className="text-xs text-gray-400 mt-1">
                {privacyLevels.find(l => l.id === config.zkVarSettings.privacyLevel)?.performance}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function VerificationStep({ 
  config, 
  riskProfile 
}: { 
  config: AgentDeploymentConfig
  riskProfile: RiskProfile 
}) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStep, setDeploymentStep] = useState(0)

  const deploymentSteps = [
    'Generating zk-VaR proofs...',
    'Verifying risk parameters...',
    'Deploying trading agents...',
    'Initializing monitoring systems...',
    'Finalizing configuration...'
  ]

  const selectedTier = config.riskTier
  const tierInfo = {
    low: { name: 'Conservative Agents', color: 'green', maxVaR: '2%' },
    medium: { name: 'Balanced Agents', color: 'blue', maxVaR: '5%' },
    high: { name: 'Aggressive Agents', color: 'red', maxVaR: '10%' }
  }[selectedTier]

  const handleDeploy = async () => {
    setIsDeploying(true)
    
    for (let i = 0; i < deploymentSteps.length; i++) {
      setDeploymentStep(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Deployment complete - this would trigger onComplete in parent
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold mb-2">Configuration Complete</h3>
        <p className="text-gray-400">Review your settings before deploying agents</p>
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-950/20 border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg">Agent Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Risk Tier:</span>
              <Badge variant="secondary" className={`text-${tierInfo?.color}-400`}>
                {tierInfo?.name}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max VaR:</span>
              <span className="font-medium">{tierInfo?.maxVaR}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Strategies:</span>
              <span className="font-medium">{config.agentTypes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rebalancing:</span>
              <span className="font-medium capitalize">{config.zkVarSettings.rebalanceFrequency}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-950/20 border-green-800">
          <CardHeader>
            <CardTitle className="text-lg">Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Privacy Level:</span>
              <Badge variant="success" className="capitalize">
                {config.zkVarSettings.privacyLevel}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Confidence:</span>
              <span className="font-medium">{config.zkVarSettings.confidenceLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Horizon:</span>
              <span className="font-medium">{config.zkVarSettings.timeHorizon} day(s)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Profile Summary */}
      <Card className="bg-purple-950/20 border-purple-800">
        <CardHeader>
          <CardTitle className="text-lg">Your Risk Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Experience:</span>
              <div className="font-medium capitalize">{riskProfile.experience}</div>
            </div>
            <div>
              <span className="text-gray-400">Tolerance:</span>
              <div className="font-medium capitalize">{riskProfile.tolerance}</div>
            </div>
            <div>
              <span className="text-gray-400">Time Horizon:</span>
              <div className="font-medium">{riskProfile.timeHorizon}</div>
            </div>
            <div>
              <span className="text-gray-400">Portfolio Size:</span>
              <div className="font-medium capitalize">{riskProfile.portfolioSize}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status */}
      {isDeploying && (
        <Card className="bg-blue-950/20 border-blue-800">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h4 className="font-semibold text-blue-400 mb-2">Deploying Your Agents</h4>
              <p className="text-sm text-gray-400 mb-4">{deploymentSteps[deploymentStep]}</p>
              <Progress value={((deploymentStep + 1) / deploymentSteps.length) * 100} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notices */}
      <Card className="bg-amber-950/20 border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-400 mb-2">Important Notices</h4>
              <ul className="text-sm text-amber-300 space-y-1">
                <li>• Agents will begin trading according to your risk parameters</li>
                <li>• You can modify settings or pause agents at any time</li>
                <li>• All trades are subject to zk-VaR verification</li>
                <li>• Monitor your positions regularly through the dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isDeploying && (
        <div className="text-center">
          <Button 
            onClick={handleDeploy}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Deploy Trading Agents
          </Button>
        </div>
      )}
    </div>
  )
}