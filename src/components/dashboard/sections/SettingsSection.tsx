import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Switch } from '../../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { AlpacaConnectionModal } from '../../alpaca/AlpacaConnectionModal'
import { 
  Key,
  User,
  Shield,
  Bell,
  CreditCard,
  Download,
  Settings,
  Trash2,
  Plus,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Activity
} from 'lucide-react'

const apiKeys = [
  {
    id: 1,
    name: 'Production Trading',
    provider: 'Alpaca Markets',
    environment: 'Production',
    permissions: ['read', 'trade'],
    created: '2024-01-15',
    lastUsed: '2 minutes ago',
    status: 'active',
    icon: Activity,
    keyId: 'PKTEST123...',
    secret: 'sk_test_abc123...'
  },
  {
    id: 2,
    name: 'Development Testing',
    provider: 'Alpaca Markets',
    environment: 'Sandbox',
    permissions: ['read'],
    created: '2024-01-10',
    lastUsed: '1 hour ago',
    status: 'active',
    icon: TestTube,
    keyId: 'PKTEST456...',
    secret: 'sk_test_def456...'
  }
]

const securitySettings = [
  {
    id: 'two_factor',
    title: '2FA Authentication',
    description: 'Secure your account with two-factor authentication',
    enabled: true,
    type: 'toggle'
  },
  {
    id: 'session_timeout',
    title: 'Auto Session Timeout',
    description: 'Automatically log out after 30 minutes of inactivity',
    enabled: true,
    type: 'toggle'
  },
  {
    id: 'api_whitelist',
    title: 'IP Whitelisting',
    description: 'Restrict API access to specific IP addresses',
    enabled: false,
    type: 'toggle'
  },
  {
    id: 'trade_confirmation',
    title: 'Trade Confirmations',
    description: 'Require confirmation for trades above $10,000',
    enabled: true,
    type: 'toggle'
  }
]

const notificationSettings = [
  {
    id: 'trade_alerts',
    title: 'Trade Execution Alerts',
    description: 'Get notified when trades are executed',
    enabled: true,
    channels: ['email', 'push']
  },
  {
    id: 'risk_alerts',
    title: 'Risk Threshold Alerts',
    description: 'Alerts when risk limits are approached',
    enabled: true,
    channels: ['email', 'push', 'sms']
  },
  {
    id: 'system_alerts',
    title: 'System Status Updates',
    description: 'Notifications about system maintenance and updates',
    enabled: false,
    channels: ['email']
  },
  {
    id: 'performance_reports',
    title: 'Daily Performance Reports',
    description: 'Daily summary of portfolio performance',
    enabled: true,
    channels: ['email']
  }
]

export function SettingsSection() {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [showApiKey, setShowApiKey] = useState<number | null>(null)
  const [showAlpacaModal, setShowAlpacaModal] = useState(false)
  const [apiKeysList, setApiKeysList] = useState(apiKeys)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const handleTestConnection = (keyId: number) => {
    // Simulate API connection test
    console.log(`Testing connection for API key ${keyId}`)
  }

  const handleDeleteApiKey = (keyId: number) => {
    setApiKeysList(prev => prev.filter(key => key.id !== keyId))
  }

  const toggleApiKeyVisibility = (keyId: number) => {
    setShowApiKey(showApiKey === keyId ? null : keyId)
  }

  const handleSaveAlpacaConfig = (config: any) => {
    const newApiKey = {
      id: Date.now(),
      name: config.name,
      provider: 'Alpaca Markets',
      environment: config.environment === 'paper' ? 'Sandbox' : 'Production',
      permissions: config.environment === 'paper' ? ['read'] : ['read', 'trade'],
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Just added',
      status: 'active' as const,
      icon: config.environment === 'paper' ? TestTube : Activity,
      keyId: config.keyId,
      secret: config.secretKey
    }
    setApiKeysList(prev => [...prev, newApiKey])
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account, security, and integrations
        </p>
      </div>

      <AlpacaConnectionModal
        isOpen={showAlpacaModal}
        onClose={() => setShowAlpacaModal(false)}
        onSave={handleSaveAlpacaConfig}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
          <Button
            variant={activeTab === 'api-keys' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-sm"
            onClick={() => setActiveTab('api-keys')}
          >
            <Key className="h-4 w-4 mr-3" />
            <span className="hidden sm:inline lg:inline">API Keys</span>
            <span className="sm:hidden lg:hidden">API</span>
          </Button>
          <Button
            variant={activeTab === 'account' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-sm"
            onClick={() => setActiveTab('account')}
          >
            <User className="h-4 w-4 mr-3" />
            <span className="hidden sm:inline lg:inline">Account</span>
            <span className="sm:hidden lg:hidden">User</span>
          </Button>
          <Button
            variant={activeTab === 'security' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-sm"
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-4 w-4 mr-3" />
            <span className="hidden sm:inline lg:inline">Security</span>
            <span className="sm:hidden lg:hidden">Sec</span>
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-sm"
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-4 w-4 mr-3" />
            <span className="hidden sm:inline lg:inline">Notifications</span>
            <span className="sm:hidden lg:hidden">Alerts</span>
          </Button>
          <Button
            variant={activeTab === 'billing' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-sm"
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard className="h-4 w-4 mr-3" />
            <span className="hidden sm:inline lg:inline">Billing</span>
            <span className="sm:hidden lg:hidden">Bill</span>
          </Button>
          <Button
            variant={activeTab === 'data-export' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-sm"
            onClick={() => setActiveTab('data-export')}
          >
            <Download className="h-4 w-4 mr-3" />
            <span className="hidden sm:inline lg:inline">Data & Export</span>
            <span className="sm:hidden lg:hidden">Data</span>
          </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">API Keys</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage broker connections and API access
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Alpaca
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAlpacaModal(true)}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Add Alpaca API
                </Button>
              </div>

              <div className="space-y-4">
                {apiKeysList.map((key) => {
                  const Icon = key.icon
                  return (
                    <Card key={key.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-6 w-6 text-emerald-600" />
                            <div>
                              <h4 className="font-medium">{key.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{key.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="success" className="text-xs">
                              {key.status}
                            </Badge>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteApiKey(key.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Environment</span>
                            <div className="mt-1">
                              <Badge 
                                variant={key.environment === 'Production' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {key.environment}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Permissions</span>
                            <div className="mt-1 flex space-x-1">
                              {key.permissions.map((perm) => (
                                <Badge key={perm} variant="success" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                          Created: {key.created} • Last used: {key.lastUsed}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleApiKeyVisibility(key.id)}
                            >
                              {showApiKey === key.id ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide Key
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Show Key
                                </>
                              )}
                            </Button>
                            {showApiKey === key.id && (
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {key.keyId || 'sk_live_abc123...def456'}
                                </code>
                                <Button variant="ghost" size="icon">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleTestConnection(key.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Test Connection
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-600">Secure Storage</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        API keys are encrypted using AES-256 and stored securely. Keys are only decrypted when needed for trading operations and are never logged or transmitted in plain text.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Account Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your profile and account settings
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Connected Wallet</label>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1">
                          {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => address && navigator.clipboard.writeText(address)}
                          disabled={!address}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Connection Status</label>
                      <div className="mt-1">
                        <Badge variant={isConnected ? "success" : "secondary"}>
                          {isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="pt-4 border-t border-gray-800">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          try {
                            disconnect()
                            // Clear localStorage data
                            localStorage.removeItem('wagmi.wallet')
                            localStorage.removeItem('wagmi.connected')
                            localStorage.removeItem('wagmi.store')
                            // Force reload to ensure clean state
                            setTimeout(() => {
                              window.location.reload()
                            }, 100)
                          } catch (error) {
                            console.warn('Disconnect error:', error)
                            // Fallback: reload the page to clear wallet state
                            window.location.reload()
                          }
                        }}
                        className="text-red-400 border-red-800 hover:bg-red-950/20"
                      >
                        Disconnect Wallet
                      </Button>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <div className="mt-1">
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800"
                        defaultValue="user@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure security preferences and authentication
                </p>
              </div>

              <div className="space-y-4">
                {securitySettings.map((setting) => (
                  <Card key={setting.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{setting.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {setting.description}
                          </p>
                        </div>
                        <Switch checked={setting.enabled} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose how and when you want to be notified
                </p>
              </div>

              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <Card key={setting.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{setting.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {setting.description}
                          </p>
                        </div>
                        <Switch checked={setting.enabled} />
                      </div>
                      <div className="flex space-x-2">
                        {setting.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Billing & Subscription</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your subscription and billing information
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="text-lg font-medium mb-2">Premium Plan</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Full access to all trading features and analytics
                    </p>
                    <div className="text-3xl font-bold mb-4">$99/month</div>
                    <Button variant="outline">Manage Subscription</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'data-export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Data & Export</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export your trading data and audit logs
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Trading History</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Export all your trading transactions and performance data
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Audit Trail</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Download immutable audit logs with zk-proofs
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}