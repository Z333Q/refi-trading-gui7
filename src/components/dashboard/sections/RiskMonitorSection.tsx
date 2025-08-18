import React from 'react'
import { useTradingSimulation } from '@/hooks/useTradingSimulation'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Activity,
  TrendingDown,
  Hash
} from 'lucide-react'

const riskMetrics = [
  {
    title: 'Portfolio VaR (95%)',
    value: '$2,450',
    status: 'normal',
    limit: '$5,000',
    utilization: 49
  },
  {
    title: 'Position Concentration',
    value: '12.3%',
    status: 'normal',
    limit: '25%',
    utilization: 49.2
  },
  {
    title: 'Leverage Ratio',
    value: '1.8x',
    status: 'normal',
    limit: '3.0x',
    utilization: 60
  },
  {
    title: 'Drawdown',
    value: '2.1%',
    status: 'warning',
    limit: '5%',
    utilization: 42
  }
]

const complianceChecks = [
  {
    id: 1,
    check: 'KYC Verification',
    status: 'passed',
    lastCheck: '2 hours ago',
    nextCheck: 'Daily'
  },
  {
    id: 2,
    check: 'Sanctions Screening',
    status: 'passed',
    lastCheck: '15 min ago',
    nextCheck: 'Real-time'
  },
  {
    id: 3,
    check: 'Trading Hours',
    status: 'passed',
    lastCheck: 'Continuous',
    nextCheck: 'Continuous'
  },
  {
    id: 4,
    check: 'Notional Limits',
    status: 'passed',
    lastCheck: '1 min ago',
    nextCheck: 'Per trade'
  }
]

const zkProofs = [
  {
    id: 1,
    type: 'VaR Proof',
    proofId: 'plonk_0x1a2b3c4d',
    timestamp: '14:32:15',
    status: 'verified',
    gasUsed: '245,678'
  },
  {
    id: 2,
    type: 'Position Proof',
    proofId: 'plonk_0x2b3c4d5e',
    timestamp: '14:28:42',
    status: 'verified',
    gasUsed: '198,432'
  },
  {
    id: 3,
    type: 'Leverage Proof',
    proofId: 'plonk_0x3c4d5e6f',
    timestamp: '14:25:11',
    status: 'verified',
    gasUsed: '267,891'
  }
]

export function RiskMonitorSection() {
  const { latencyMetrics, dualProofGate } = useTradingSimulation()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Risk Monitor</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time risk metrics and compliance monitoring with zk-proof verification
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {riskMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </CardTitle>
                <Badge 
                  variant={
                    metric.status === 'normal' ? 'success' : 
                    metric.status === 'warning' ? 'warning' : 'destructive'
                  }
                  className="text-xs"
                >
                  {metric.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{metric.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Limit: {metric.limit}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                <div 
                  className={`h-2 rounded-full ${
                    metric.status === 'normal' ? 'bg-emerald-600' : 
                    metric.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{width: `${metric.utilization}%`}}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metric.utilization}% utilized
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>ACE Compliance Checks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">{check.check}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Last: {check.lastCheck} • Next: {check.nextCheck}
                    </div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">
                  {check.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-purple-500" />
              <span>Recent zk-Proofs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {zkProofs.map((proof) => (
              <div key={proof.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {proof.type}
                    </Badge>
                    <span className="text-sm font-medium">{proof.timestamp}</span>
                  </div>
                  <Badge variant="success" className="text-xs">
                    {proof.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Proof ID: <span className="font-mono">{proof.proofId}</span></div>
                  <div>Gas Used: {proof.gasUsed}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>System Performance</span>
            </div>
            <Badge variant="success">All Systems Operational</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{Math.round(latencyMetrics.current)}ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(latencyMetrics.p95)}ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">p95 Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(latencyMetrics.proofTime)}ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Proof Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}