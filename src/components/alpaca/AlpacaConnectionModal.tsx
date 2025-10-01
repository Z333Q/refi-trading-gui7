import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Key,
  TestTube,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  Loader2
} from 'lucide-react'

interface AlpacaConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: AlpacaConfig) => void
}

interface AlpacaConfig {
  name: string
  environment: 'paper' | 'live'
  keyId: string
  secretKey: string
  baseUrl?: string
}

export function AlpacaConnectionModal({ isOpen, onClose, onSave }: AlpacaConnectionModalProps) {
  const [config, setConfig] = useState<AlpacaConfig>({
    name: '',
    environment: 'paper',
    keyId: '',
    secretKey: ''
  })
  const [showSecret, setShowSecret] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleEnvironmentChange = (env: 'paper' | 'live') => {
    setConfig(prev => ({
      ...prev,
      environment: env,
      baseUrl: env === 'paper' 
        ? 'https://paper-api.alpaca.markets'
        : 'https://api.alpaca.markets'
    }))
  }

  const testConnection = async () => {
    if (!config.keyId || !config.secretKey) {
      setErrorMessage('Please enter both Key ID and Secret Key')
      setConnectionStatus('error')
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus('idle')
    setErrorMessage('')

    try {
      // Simulate API test - in real implementation, this would call Alpaca API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock validation
      if (config.keyId.startsWith('PK') && config.secretKey.length > 20) {
        setConnectionStatus('success')
      } else {
        throw new Error('Invalid API credentials format')
      }
    } catch (error) {
      setConnectionStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSave = () => {
    if (connectionStatus === 'success') {
      // SECURITY CRITICAL: In production, send credentials to secure backend
      // POST /api/alpaca/save-credentials with { name, environment, keyId, secretKey }
      // Backend should encrypt and securely store credentials
      // Frontend should only receive a connection ID or status
      onSave(config)
      onClose()
      // Reset form
      setConfig({
        name: '',
        environment: 'paper',
        keyId: '',
        secretKey: ''
      })
      setConnectionStatus('idle')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold">Connect Alpaca Markets</h2>
                <p className="text-sm text-gray-400">Add your Alpaca API credentials for trading</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Environment Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Trading Environment</label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${
                  config.environment === 'paper' 
                    ? 'ring-2 ring-emerald-500 bg-emerald-950/20' 
                    : 'hover:border-gray-700'
                }`}
                onClick={() => handleEnvironmentChange('paper')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TestTube className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Paper Trading</h3>
                      <p className="text-xs text-gray-400">Risk-free testing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  config.environment === 'live' 
                    ? 'ring-2 ring-emerald-500 bg-emerald-950/20' 
                    : 'hover:border-gray-700'
                }`}
                onClick={() => handleEnvironmentChange('live')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium">Live Trading</h3>
                      <p className="text-xs text-gray-400">Real money trading</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Configuration Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Configuration Name</label>
            <input
              type="text"
              placeholder="e.g., My Alpaca Account"
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* API Credentials */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">API Key ID</label>
              <input
                type="text"
                placeholder="PKTEST... or PK..."
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                value={config.keyId}
                onChange={(e) => setConfig(prev => ({ ...prev, keyId: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Secret Key</label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  placeholder="Your secret key"
                  className="w-full px-3 py-2 pr-10 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                  value={config.secretKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="space-y-3">
            <Button
              onClick={testConnection}
              disabled={isTestingConnection || !config.keyId || !config.secretKey}
              className="w-full"
              variant="outline"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            {connectionStatus === 'success' && (
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-400">Connection successful!</span>
                </div>
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-800">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-400">{errorMessage}</span>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <Card className="bg-blue-950/20 border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Key className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">How to get your Alpaca API keys:</h4>
                  <ol className="text-sm text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Log in to your Alpaca account</li>
                    <li>Go to "Your API Keys" in the dashboard</li>
                    <li>Generate new API keys for {config.environment} trading</li>
                    <li>Copy the Key ID and Secret Key</li>
                  </ol>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-blue-400 hover:text-blue-300"
                    onClick={() => window.open('https://app.alpaca.markets/paper/dashboard/overview', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Alpaca Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={connectionStatus !== 'success'}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  )
}