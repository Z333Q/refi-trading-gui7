import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const portfolioData = [
  { time: '09:30', value: 100000, benchmark: 100000 },
  { time: '10:00', value: 101200, benchmark: 100300 },
  { time: '10:30', value: 102500, benchmark: 100100 },
  { time: '11:00', value: 101800, benchmark: 100500 },
  { time: '11:30', value: 103200, benchmark: 100800 },
  { time: '12:00', value: 104100, benchmark: 101200 },
  { time: '12:30', value: 105600, benchmark: 101500 },
  { time: '13:00', value: 107200, benchmark: 101800 },
  { time: '13:30', value: 108500, benchmark: 102100 },
  { time: '14:00', value: 110800, benchmark: 102400 },
  { time: '14:30', value: 112400, benchmark: 102700 },
  { time: '15:00', value: 114200, benchmark: 103000 },
  { time: '15:30', value: 116800, benchmark: 103300 },
  { time: '16:00', value: 118900, benchmark: 103600 },
]

const riskData = [
  { time: '09:30', var: 1.2, drawdown: 0 },
  { time: '10:00', var: 1.4, drawdown: -0.5 },
  { time: '10:30', var: 1.8, drawdown: 0 },
  { time: '11:00', var: 1.6, drawdown: -0.2 },
  { time: '11:30', var: 2.1, drawdown: 0 },
  { time: '12:00', var: 2.3, drawdown: 0 },
  { time: '12:30', var: 1.9, drawdown: 0 },
  { time: '13:00', var: 2.2, drawdown: 0 },
  { time: '13:30', var: 2.0, drawdown: 0 },
  { time: '14:00', var: 1.7, drawdown: 0 },
  { time: '14:30', var: 1.5, drawdown: 0 },
  { time: '15:00', var: 1.8, drawdown: 0 },
  { time: '15:30', var: 2.1, drawdown: 0 },
  { time: '16:00', var: 1.9, drawdown: 0 },
]

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
            <TabsTrigger value="latency">Latency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name === 'value' ? 'Portfolio' : 'Benchmark'
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                    name="Portfolio"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#6b7280" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Benchmark"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)}${name === 'var' ? '/10' : '%'}`,
                      name === 'var' ? 'VaR Score' : 'Drawdown'
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="var" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="VaR"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="drawdown" 
                    stackId="2"
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Drawdown"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="latency" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="text-lg font-bold text-green-600">89ms</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="text-lg font-bold text-blue-600">142ms</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">p95</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <div className="text-lg font-bold text-amber-600">150ms</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">SLO Target</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Inference Latency</span>
                <span className="text-sm font-medium">32ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">zk-VaR Proof</span>
                <span className="text-sm font-medium">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ACE Policy Check</span>
                <span className="text-sm font-medium">4ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Broker API</span>
                <span className="text-sm font-medium">41ms</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}