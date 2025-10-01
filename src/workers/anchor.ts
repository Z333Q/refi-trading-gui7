/**
 * Anchoring Worker
 * 
 * Background worker for handling zkSync anchoring operations.
 * Provides start/stop hooks and manages the anchoring queue.
 * 
 * @author ReFi.Trading Team
 * @version 1.0.0
 */

import { AnchorClient, type AnchorPreviewRequest, type AnchorFillRequest } from '../lib/anchor'

export interface AnchorWorkerConfig {
  rpcUrl: string
  contractAddress: string
  privateKey: string
  timeout?: number
  batchSize?: number
  retryAttempts?: number
}

export interface AnchorJob {
  id: string
  type: 'preview' | 'fill'
  data: AnchorPreviewRequest | AnchorFillRequest
  attempts: number
  createdAt: string
}

/**
 * Anchoring Worker Class
 */
export class AnchorWorker {
  private client: AnchorClient
  private isRunning = false
  private queue: AnchorJob[] = []
  private processingInterval: NodeJS.Timeout | null = null
  private readonly batchSize: number
  private readonly retryAttempts: number

  constructor(config: AnchorWorkerConfig) {
    this.client = new AnchorClient(
      config.rpcUrl,
      config.contractAddress,
      config.privateKey,
      config.timeout
    )
    this.batchSize = config.batchSize || 5
    this.retryAttempts = config.retryAttempts || 3
  }

  /**
   * Start the worker
   */
  start(): void {
    if (this.isRunning) {
      console.warn('Anchor worker is already running')
      return
    }

    this.isRunning = true
    console.log('Starting anchor worker...')

    // Process queue every 5 seconds
    this.processingInterval = setInterval(() => {
      this.processQueue().catch(error => {
        console.error('Error processing anchor queue:', error)
      })
    }, 5000)
  }

  /**
   * Stop the worker
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn('Anchor worker is not running')
      return
    }

    this.isRunning = false
    console.log('Stopping anchor worker...')

    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }

    // Process remaining queue items before stopping
    this.processQueue().catch(error => {
      console.error('Error processing final queue items:', error)
    })
  }

  /**
   * Add job to anchoring queue
   */
  enqueue(type: 'preview' | 'fill', data: AnchorPreviewRequest | AnchorFillRequest): string {
    const job: AnchorJob = {
      id: `anchor_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      attempts: 0,
      createdAt: new Date().toISOString()
    }

    this.queue.push(job)
    console.log(`Enqueued ${type} anchor job:`, job.id)
    return job.id
  }

  /**
   * Process anchoring queue
   */
  private async processQueue(): Promise<void> {
    if (!this.isRunning || this.queue.length === 0) {
      return
    }

    const batch = this.queue.splice(0, this.batchSize)
    console.log(`Processing ${batch.length} anchor jobs...`)

    const promises = batch.map(job => this.processJob(job))
    const results = await Promise.allSettled(promises)

    // Handle failed jobs
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const job = batch[index]
        job.attempts++

        if (job.attempts < this.retryAttempts) {
          // Re-queue for retry
          this.queue.unshift(job)
          console.warn(`Re-queuing failed job ${job.id} (attempt ${job.attempts})`)
        } else {
          console.error(`Job ${job.id} failed after ${job.attempts} attempts:`, result.reason)
        }
      }
    })
  }

  /**
   * Process individual anchoring job
   */
  private async processJob(job: AnchorJob): Promise<void> {
    try {
      if (job.type === 'preview') {
        await this.client.anchorPreview(job.data as AnchorPreviewRequest)
      } else if (job.type === 'fill') {
        await this.client.anchorFill(job.data as AnchorFillRequest)
      }
      
      console.log(`Successfully processed ${job.type} anchor job:`, job.id)
    } catch (error) {
      console.error(`Failed to process ${job.type} anchor job ${job.id}:`, error)
      throw error
    }
  }

  /**
   * Get queue status
   */
  getStatus(): { isRunning: boolean; queueLength: number; totalProcessed: number } {
    return {
      isRunning: this.isRunning,
      queueLength: this.queue.length,
      totalProcessed: 0 // In production, track this metric
    }
  }
}

/**
 * Create anchor worker from environment variables
 */
export function createAnchorWorkerFromEnv(): AnchorWorker {
  const config: AnchorWorkerConfig = {
    rpcUrl: process.env.ANCHOR_RPC_URL || '',
    contractAddress: process.env.ANCHOR_CONTRACT_ADDRESS || '',
    privateKey: process.env.ANCHOR_PRIVATE_KEY || '',
    timeout: parseInt(process.env.ANCHOR_TIMEOUT_MS || '30000', 10)
  }

  // Validate required environment variables
  if (!config.rpcUrl || !config.contractAddress || !config.privateKey) {
    throw new Error('Missing required anchor worker environment variables: ANCHOR_RPC_URL, ANCHOR_CONTRACT_ADDRESS, ANCHOR_PRIVATE_KEY')
  }

  return new AnchorWorker(config)
}