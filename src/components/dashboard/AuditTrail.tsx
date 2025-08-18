import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  ExternalLink, 
  Download, 
  FileText, 
  Shield, 
  CheckCircle,
  Clock,
  Hash
} from 'lucide-react'

const auditEvents = [
  {
    id: 1,
    timestamp: '2024-01-15 14:32:15',
    type: 'trade_executed',
    symbol: 'AAPL',
    action: 'BUY 100 @ $178.45',
    zkProof: 'plonk_0x1a2b3c4d5e',
    aceVerdict: 'ace_approved_789',
    baseTx: '0xabc123...def456',
    status: 'anchored',
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:28:42',
    type: 'risk_check',
    symbol: 'TSLA',
    action: 'VaR validation passed',
    zkProof: 'plonk_0x2b3c4d5e6f',
    aceVerdict: 'ace_approved_790',
    baseTx: '0xdef456...ghi789',
    status: 'anchored',
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:25:11',
    type: 'strategy_deployed',
    symbol: 'N/A',
    action: 'PPO Momentum v2.1',
    zkProof: 'N/A',
    aceVerdict: 'ace_approved_791',
    baseTx: '0xghi789...jkl012',
    status: 'pending',
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:20:33',
    type: 'compliance_check',
    symbol: 'NVDA',
    action: 'KYC verification',
    zkProof: 'N/A',
    aceVerdict: 'ace_approved_792',
    baseTx: '0xjkl012...mno345',
    status: 'anchored',
  },
]

export function AuditTrail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Immutable Audit Trail</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Badge variant="secondary">Base L2</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      event.type === 'trade_executed' ? 'success' :
                      event.type === 'risk_check' ? 'warning' :
                      event.type === 'strategy_deployed' ? 'secondary' :
                      'secondary'
                    }
                    className="capitalize"
                  >
                    {event.type.replace('_', ' ')}
                  </Badge>
                  {event.symbol !== 'N/A' && (
                    <span className="text-sm font-medium">{event.symbol}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={event.status === 'anchored' ? 'success' : 'secondary'}
                    className="text-xs"
                  >
                    {event.status === 'anchored' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Anchored
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                  <span className="text-xs text-gray-500">{event.timestamp}</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-900 dark:text-gray-100">{event.action}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {event.zkProof !== 'N/A' && (
                  <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-1 mb-1">
                      <Shield className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-600 font-medium">zk-Proof</span>
                    </div>
                    <div className="font-mono text-blue-700 dark:text-blue-400">
                      {event.zkProof}
                    </div>
                  </div>
                )}
                
                <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-1 mb-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">ACE Verdict</span>
                  </div>
                  <div className="font-mono text-green-700 dark:text-green-400">
                    {event.aceVerdict}
                  </div>
                </div>

                <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-1 mb-1">
                    <Hash className="h-3 w-3 text-purple-600" />
                    <span className="text-purple-600 font-medium">Base Tx</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-purple-700 dark:text-purple-400 truncate">
                      {event.baseTx}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium mb-1">Audit Compliance</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All trades immutably logged with dual-proof verification
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">100% Coverage</div>
              <div className="text-xs text-gray-500">Last 30 days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}