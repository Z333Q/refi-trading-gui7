import { AnchorClient } from '../lib/anchor.js'

export interface AnchorWorkerOptions {
  rpcUrl: string
  contractAddress: string
  privateKey: string
  timeoutMs?: number
}

/**
 * AnchorWorker wraps AnchorClient with start/stop hooks.
 * Actual event consumption will be wired later once messaging exists.
 */
export class AnchorWorker {
  private client: AnchorClient
  private running = false

  constructor(opts: AnchorWorkerOptions) {
    this.client = new AnchorClient(opts)
  }

  start() {
    this.running = true
  }

  stop() {
    this.running = false
  }

  async anchorPreview(
    previewId: string,
    proofCid: string,
    verdictCid: string,
    traceId: string,
  ) {
    return this.running
      ? this.client.anchorPreview(previewId, proofCid, verdictCid, traceId)
      : { txHash: null }
  }

  async anchorFill(
    orderId: string,
    fillCid: string,
    deltaNotional: bigint,
    slippageBps: bigint,
    traceId: string,
  ) {
    return this.running
      ? this.client.anchorFill(orderId, fillCid, deltaNotional, slippageBps, traceId)
      : { txHash: null }
  }
}

export function createAnchorWorkerFromEnv(): AnchorWorker {
  const rpcUrl = process.env.ANCHOR_RPC_URL
  const contractAddress = process.env.ANCHOR_CONTRACT_ADDRESS
  const privateKey = process.env.ANCHOR_PRIVATE_KEY
  const timeoutMs = process.env.ANCHOR_TIMEOUT_MS
    ? parseInt(process.env.ANCHOR_TIMEOUT_MS, 10)
    : undefined

  if (!rpcUrl || !contractAddress || !privateKey) {
    throw new Error('missing anchoring env vars')
  }

  return new AnchorWorker({ rpcUrl, contractAddress, privateKey, timeoutMs })
}
