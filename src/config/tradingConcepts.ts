/**
 * Trading Concepts Configuration
 * 
 * Centralized definitions for trading concepts used in educational tooltips.
 * Each concept includes definition, examples, and related concepts for comprehensive learning.
 */

export interface TradingConcept {
  id: string
  term: string
  definition: string
  example: string
  relatedConcepts: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xpReward: number
}

export const tradingConcepts: Record<string, TradingConcept> = {
  'var': {
    id: 'var',
    term: 'Value at Risk (VaR)',
    definition: 'A statistical measure that estimates the potential loss in value of a portfolio over a specific time period at a given confidence level.',
    example: 'A 95% VaR of $10,000 over 1 day means there\'s only a 5% chance of losing more than $10,000 tomorrow.',
    relatedConcepts: ['Expected Shortfall', 'Confidence Interval', 'Risk Management'],
    difficulty: 'intermediate',
    xpReward: 10
  },
  'sharpe-ratio': {
    id: 'sharpe-ratio',
    term: 'Sharpe Ratio',
    definition: 'A measure of risk-adjusted return that compares the excess return of an investment to its volatility.',
    example: 'A Sharpe ratio of 1.5 means the strategy generates 1.5 units of return for each unit of risk taken.',
    relatedConcepts: ['Risk-Adjusted Return', 'Volatility', 'Benchmark'],
    difficulty: 'intermediate',
    xpReward: 8
  },
  'stop-loss': {
    id: 'stop-loss',
    term: 'Stop Loss',
    definition: 'A predetermined price level at which a losing position will be automatically closed to limit further losses.',
    example: 'If you buy a stock at $100 with a 5% stop loss, the position will be sold if the price drops to $95.',
    relatedConcepts: ['Risk Management', 'Position Sizing', 'Take Profit'],
    difficulty: 'beginner',
    xpReward: 5
  },
  'momentum': {
    id: 'momentum',
    term: 'Momentum Trading',
    definition: 'A strategy that involves buying securities that are rising and selling those that are falling, based on the belief that trends will continue.',
    example: 'Buying a stock that has broken above resistance with high volume, expecting the upward trend to continue.',
    relatedConcepts: ['Trend Following', 'Technical Analysis', 'Breakout'],
    difficulty: 'intermediate',
    xpReward: 12
  },
  'mean-reversion': {
    id: 'mean-reversion',
    term: 'Mean Reversion',
    definition: 'A trading strategy based on the assumption that asset prices will eventually return to their historical average or mean.',
    example: 'Buying an oversold stock that has dropped significantly below its moving average, expecting it to bounce back.',
    relatedConcepts: ['Statistical Arbitrage', 'Bollinger Bands', 'RSI'],
    difficulty: 'intermediate',
    xpReward: 12
  },
  'zk-proof': {
    id: 'zk-proof',
    term: 'Zero-Knowledge Proof',
    definition: 'A cryptographic method that allows one party to prove to another that they know a value without revealing the value itself.',
    example: 'Proving your portfolio risk is within limits without revealing your actual positions or trading strategies.',
    relatedConcepts: ['Cryptography', 'Privacy', 'Verification'],
    difficulty: 'advanced',
    xpReward: 15
  },
  'reinforcement-learning': {
    id: 'reinforcement-learning',
    term: 'Reinforcement Learning',
    definition: 'A machine learning approach where agents learn optimal trading strategies through trial and error, receiving rewards for profitable actions.',
    example: 'An RL agent learns to buy low and sell high by receiving positive rewards for profitable trades and negative rewards for losses.',
    relatedConcepts: ['Machine Learning', 'PPO', 'TD3', 'Q-Learning'],
    difficulty: 'advanced',
    xpReward: 18
  },
  'ppo': {
    id: 'ppo',
    term: 'Proximal Policy Optimization (PPO)',
    definition: 'A reinforcement learning algorithm that optimizes trading policies while preventing large, destabilizing updates to the strategy.',
    example: 'PPO gradually improves a momentum trading strategy by making small, controlled adjustments based on market feedback.',
    relatedConcepts: ['Reinforcement Learning', 'Policy Gradient', 'Momentum Trading'],
    difficulty: 'advanced',
    xpReward: 20
  },
  'td3': {
    id: 'td3',
    term: 'Twin Delayed Deep Deterministic (TD3)',
    definition: 'An advanced RL algorithm that uses two neural networks to reduce overestimation bias in value function learning.',
    example: 'TD3 agents excel at mean reversion strategies by accurately estimating the value of counter-trend positions.',
    relatedConcepts: ['Reinforcement Learning', 'Deep Learning', 'Mean Reversion'],
    difficulty: 'advanced',
    xpReward: 20
  }
}